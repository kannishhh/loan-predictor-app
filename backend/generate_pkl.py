import joblib
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
import pandas as pd
from sklearn.model_selection import train_test_split

# Load the dataset
try:
    df = pd.read_csv("backend/loan_data.csv")
except FileNotFoundError:
    print("Error: loan_data.csv not found! Please place it in the project folder.")
    exit(1)

# Preprocess the data (as per the notebook)
X = df.drop('not.fully.paid', axis=1)
y = df['not.fully.paid']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=101)

# Encode the 'purpose' column
le = LabelEncoder()
X_train['purpose'] = le.fit_transform(X_train['purpose'])
X_test['purpose'] = le.transform(X_test['purpose'])

# Train the Random Forest model (as per notebook)
rf_clf = RandomForestClassifier(n_estimators=600)
rf_clf.fit(X_train, y_train)

# Scale the numerical features
scaler = StandardScaler()
numerical_cols = ['int.rate', 'installment', 'log.annual.inc', 'dti', 'fico',
                  'days.with.cr.line', 'revol.bal', 'revol.util', 'inq.last.6mths',
                  'delinq.2yrs', 'pub.rec']
X_train[numerical_cols] = scaler.fit_transform(X_train[numerical_cols])

# Save the model, scaler, and label encoder
joblib.dump(rf_clf, 'backend/models/random_forest_model.pkl')
joblib.dump(scaler, 'backend/models/scaler.pkl')
joblib.dump(le, 'backend/models/label_encoder.pkl')

print("Success: random_forest_model.pkl, scaler.pkl, and label_encoder.pkl have been generated!")
