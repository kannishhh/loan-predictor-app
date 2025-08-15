# 🏦 Loan Eligibility Prediction App

A full-stack Loan Prediction web application built with **React(Vite + Tailwind CSS)** for the frontend and **Flask** for the backend. It allows users to check loan approval eligibility using a machine learning model, view their prediction history, download results as a PDF. The project is now powered by Firebase for real-time data and authentication, focusing on a robust user experience.

---

## 🔧 Tech Stack

### 🌐 Frontend:

- ⚛️ React (Vite)
- 🎨 Tailwind CSS
- 🧠 React Hooks & Routing
- 📄 html2pdf.js for PDF generation
- 📊 Chart.js & react-chartjs-2 & Recharts for data visualization
- ✨ Heroicons for modern UI icons
- 🔥 Firebase (Authentication, Firestore Database) for user management and centralized data storage (upcoming)

### 🔙 Backend:

- 🐍 Flask
- 🔮 Trained ML Model (Logistic Regression / Decision Tree)
- 🧪 Scikit-Learn, Pandas, NUmpy

---

## ✅ Current Features

- 🔐 **Secure User Authentication:** Implemented with Firebase Authentication for email/password and social logins (e.g., Google, GitHub).
- 📝 **Loan Prediction Form:** An intuitive and enhanced form with dynamic inputs (FICO/CIBIL).
- 📊 **User Dashboard:** A personalized landing page with a summary of user activity and a visual breakdown of past predictions.
- 📂 **Real-time Prediction History:** Users can view their entire prediction history, with data fetched in real-time from Firestore.
- 📄 **Export Prediction to PDF:** Download individual prediction results as a PDF report.
- ☁️ **Centralized Prediction Storage (Firestore):** All user predictions are securely stored in a Firebase Firestore database.

---

## 🧠 Machine Leraning

- Model trained using public loan dataset (e.g. Kaggle Loan Prediction).
- Data Preprocessing and model training performed using Pandas & Scikit-Learn.
- Prediction served via a Flask API endpoint.

---

## 📁 Folder Structure

```bash
root/
│
├── backend/ # Flask Backend
│ ├── models/ # Trained model files (e.g., model.pkl, scaler.pkl)
│ ├── app.py # Main Flask app
│ ├── generate_pkl.py # Script to train and save model
│ └── loan_data.csv # Dataset used for training
│
├── frontend/ # Vite + React Frontend
│ ├── assets/
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ │ ├── predictor/ # Components specific to the predictor page
│ │ │ │    ├── PredictionResult.jsx
│ │ │ │    ├── PredictorInputs.jsx
│ │ │ │    └── PredictorSelector.jsx
│ │ │ ├── shimmer/ 
│ │ │ └── History.jsx
│ │ ├── constants/ # Global constants like form initial state, labels, icons
│ │ │ └── predictorConstants.js
│ │ ├── context/ 
│ │ │ └── PredictonContext.jsx
│ │ ├── pages/ # Main pages (Home, Predictor, History)
│ │ └── App.jsx
│ └── index.html
│
├── .gitignore # Ignore node_modules, pycache, etc.
└── README.md
```

---

## 🚀 How to Run Locally

To run this application, you'll need to set up both the Flask backend and the React frontend, and crucially, configure your Firebase project.

### 🔙 Backend (Flask)

1. Navigate to the `backend` directory:

```bash
cd backend
```

2. Install the required Python packages:

```bash
pip install -r requirements.txt
```

3. Run the Flask application:

```bash
python app.py
```

The backend server will typically run on `http://localhost:5000.`

### 🌐 Frontend (React + Vite)

1. Navigate to the `frontend` directory:

```bash
cd frontend
```

2. Install the npm dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend application will typically open in your browser at `http://localhost:5173` (or another port).

### 🔥 Firebase Setup
Follow these steps to set up your Firebase project.\

- Create a Project: Go to the Firebase Console, create a new project, and add a web app.

- Enable Authentication: In the "Authentication" section, enable the Email/Password and Anonymous sign-in providers.

- Set up Firestore: In the "Firestore Database" section, create a database in production mode.

- Update Security Rules: Set up security rules to allow read/write access for authenticated users to the /users/{userId}/predictions/{predictionId} path.


---

## 📜 License

This project is for educational purposes only.\
Feel free to fork, modify, and build on it as you wish! 🙌

---

## 🙋‍♂️ Author

Made with ❤️ by Kanish Kainth

- 🔗 GitHub: kannishhh
- 📧 Email: knshkainth2002@gmail.com
- 💼 Open to internships and freelance opportunities!
