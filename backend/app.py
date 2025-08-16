import os
import joblib
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore, auth
from google.cloud.firestore_v1 import SERVER_TIMESTAMP
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
CORS(app) 

# --- Firebase Admin SDK Initialization ---
try:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase Admin SDK initialized successfully.")
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")
    db = None

# Load the model, scaler, and label encoder
try:
    model = joblib.load('models/random_forest_model.pkl')
    scaler = joblib.load('models/scaler.pkl')
    label_encoder = joblib.load('models/label_encoder.pkl')
except FileNotFoundError as e:
    print(f"Error loading model files: {e}. Ensure 'models/' directory and files exist.")
    model = None
    scaler = None
    label_encoder = None
except Exception as e:
    print(f"Error loading model files: {e}")
    model = None
    scaler = None
    label_encoder = None

# Define feature column
columns = ['credit.policy', 'purpose', 'int.rate', 'installment', 'log.annual.inc',
           'dti', 'fico', 'days.with.cr.line', 'revol.bal', 'revol.util',
           'inq.last.6mths', 'delinq.2yrs', 'pub.rec']

@app.route('/predict', methods=['POST'])
def predict():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized: Missing or invalid Authorization header'}), 401
    
    id_token = auth_header.split(' ')[1]

    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
    except Exception as e:
        print(f"Token verification error: {e}")
        return jsonify({'error': 'Unauthorized: Invalid token'}), 403


    if model is None or scaler is None or label_encoder is None:
        return jsonify({'error': 'Server configuration error: Model not loaded.'}), 500


    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided.'}), 400
        

        credit_score_type = data.get('credit_score_type')
        if credit_score_type == 'cibil':
            cibil_Score = data.get('cibil')
            if cibil_Score:
                data['fico'] = float(cibil_Score) / 1000 * 850

        # for col in columns:
        #     if col not in data:
        #         return jsonify({'error': f"Missing data for required field: {col}"}), 400

        input_data = {}
        for col in columns:
            if col == 'purpose':
               
                try:
                    input_data[col] = label_encoder.transform([data[col]])[0]
                except ValueError:
                    
                    return jsonify({'error': f"Invalid purpose: {data[col]}. Must be one of {list(label_encoder.classes_)}"}), 400
            else:
                try:
                    value = data.get(col)
                    if value is None or value == '':
                         return jsonify({'error': f"Field '{col}' cannot be empty."}), 400
                    input_data[col] = float(value)
                except (ValueError, TypeError):
                    return jsonify({'error': f"Invalid number format for field: {col}"}), 400

        df = pd.DataFrame([input_data], columns=columns)
        numerical_cols = ['int.rate', 'installment', 'log.annual.inc', 'dti', 'fico',
                          'days.with.cr.line', 'revol.bal', 'revol.util', 'inq.last.6mths',
                          'delinq.2yrs', 'pub.rec']
        df[numerical_cols] = scaler.transform(df[numerical_cols])

        prediction = model.predict(df)[0]       
        probability_non_repaid = model.predict_proba(df)[0][1] 

        
        if prediction == 0:
            result = 'Loan Likely to be Repaid'
            confidence_value = 1 - probability_non_repaid
        else:
            result = 'Loan at Risk of Non-Repayment'
            confidence_value = probability_non_repaid

        if not np.isfinite(confidence_value):
            confidence_value = 0.0 

        # confidence_display = f"{(confidence_value * 100):.2f}%"

        # entry = {
        #     "input": data,
        #     "result": result,
        #     "confidence": confidence_value,
        #     "timestamp": datetime.now().isoformat()
        # }

        # return jsonify(entry)

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': 'An unexpected error occurred during prediction.'}), 500
    

    if db:
        try:
            user_predictions_ref = db.collection('users').document(uid).collection('predictions')
            prediction_record ={
                "userId": uid,
                "prediction": result,
                "confidence": confidence_value,
                "timestamp": SERVER_TIMESTAMP,
                "input": data
            }
            user_predictions_ref.add(prediction_record)
        except Exception as e:
            print(f"Firestore save error: {e}")
            return jsonify({'error': 'Failed to save prediction to database.'}), 500
        
    return jsonify({
        "result": result,
        "confidence": float(f"{(confidence_value * 100):.2f}%")
    }), 200


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "running"}), 200

if __name__ == '__main__':
    app.run(port=5000)
