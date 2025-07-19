import json, os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
from routes.admin_stats import admin_stats_bp
from routes.admin_feedback import feedback_bp 
from routes.admin_predictions import predictions_bp
from routes.admin_users import admin_users

app = Flask(__name__)
CORS(app)

app.register_blueprint(admin_stats_bp)
app.register_blueprint(feedback_bp)
app.register_blueprint(predictions_bp)
app.register_blueprint(admin_users)

# Load the model, scaler, and label encoder
model = joblib.load('models/random_forest_model.pkl')
scaler = joblib.load('models/scaler.pkl')
label_encoder = joblib.load('models/label_encoder.pkl')

# Define feature columns (same as in the dataset, excluding 'not.fully.paid')
columns = ['credit.policy', 'purpose', 'int.rate', 'installment', 'log.annual.inc',
           'dti', 'fico', 'days.with.cr.line', 'revol.bal', 'revol.util',
           'inq.last.6mths', 'delinq.2yrs', 'pub.rec']

BASE_DIR =os.path.dirname(os.path.abspath(__file__))

USER_FILE = os.path.join(BASE_DIR, 'data', 'users.json')
HISTORY_FILE = os.path.join(BASE_DIR, 'data', 'history.json')


def load_users():
    if not os.path.exists(USER_FILE):
        return []
    with open(USER_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USER_FILE, "w") as f:
        json.dump(users, f)

def load_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    with open(HISTORY_FILE, "r") as f:
        return json.load(f)

def save_history(history):
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f)

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    users = load_users()

    if any(u["email"] == data["email"] for u in users):
        return jsonify({"error": "User already exists"}), 400

    users.append({
        "email": data["email"],
        "password": data["password"]  # 👈 Store hashed in real apps!
    })

    save_users(users)
    return jsonify({"message": "Signup successful"})

@app.route("/login", methods=["POST"])

def login():
    data = request.get_json()
    users = load_users()

    user = next((u for u in users if u["email"] == data["email"] and u["password"] == data["password"]), None)
    if user:
        return jsonify({"message": "Login successful"})
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()  # ✅ receive JSON from React

        # Create DataFrame with input data
        input_data = {}
        for col in columns:
            if col == 'purpose':
                # Encode the 'purpose' column
                input_data[col] = label_encoder.transform([data[col]])[0]
            else:
                input_data[col] = float(data[col])

        df = pd.DataFrame([input_data], columns=columns)

        # Scale only numerical features
        numerical_cols = ['int.rate', 'installment', 'log.annual.inc', 'dti', 'fico',
                          'days.with.cr.line', 'revol.bal', 'revol.util', 'inq.last.6mths',
                          'delinq.2yrs', 'pub.rec']
        df[numerical_cols] = scaler.transform(df[numerical_cols])

        # Predict
        prediction = model.predict(df)[0]
        probability = model.predict_proba(df)[0][1]

        result = 'Loan Likely to be Repaid' if prediction == 0 else 'Loan at Risk of Non-Repayment'
        confidence = f"{probability * 100:.2f}% chance of non-repayment"

        user_email = request.headers.get("X-User-Email", "guest")
        entry = {
            "email": user_email,
            "input": data,
            "result": result,
            "confidence": confidence,
            "timestamp": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")
            }
        history = load_history()
        history.append(entry)
        save_history(history)


        return jsonify({'result': result, 'confidence': confidence})
    

    except Exception as e:
        return jsonify({'error': str(e)}), 400
    



@app.route("/history", methods=["GET", "DELETE"])
def history():
    email = request.args.get("email")
    if request.method == "GET":
        history = load_history()
        user_history = [h for h in history if h["email"] == email]
        return jsonify(user_history)
    elif request.method == "DELETE":
        history = load_history()
        new_history = [h for h in history if h["email"] != email]
        save_history(new_history)
        return jsonify({"message": "History cleared successfully"})

@app.route("/admin/predictions", methods=["GET"])
def get_all_predictions():
    try:
        with open("users.json", "r") as f:
            users_data =json.load(f)
        all_predictions =[]

        for user, records in users_data.items():
            for r in records:
                r["user"] = user
                all_predictions.apend(r)

        return jsonify({"success":True, "data":all_predictions[::-1]})
    except Exception as e:
        return jsonify({"success":False, "error":str(e)}),500

if __name__ == '__main__':
    app.run(debug=True)
