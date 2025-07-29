# 🏦 Loan Eligibility Prediction App

A full-stack Loan Prediction web application built with **React(Vite + Tailwind CSS)** for the frontend and **Flask** for the backend. It allows users to check loan approval eligibility using a machine learning, view their prediction history, and download results as a PDF.

---

## 🔧 Tech Stack

### 🌐 Frontend:

- ⚛️ React (Vite)
- 🎨 Tailwind CSS
- 🧠 React Hooks & Routing
- 📄 html2pdf.js for PDF generation
- 📊 Chart.js & react-chartjs-2 for data visualization
- ✨ Heroicons for modern UI icons
- 🔥 Firebase (Authentication, Firestore Database) for user management and centralized data storage (upcoming)

### 🔙 Backend:

- 🐍 Flask
- 🔮 Trained ML Model (Logistic Regression / Decision Tree)
- 🧪 Scikit-Learn, Pandas, NUmpy

---

## ✅ Current Features

- 🔐 **User Authentication:** Secure login/logout flow with Firebase Authentication (supports anonymous and custom token authentication).
- 📝 **Loan Prediction Form:** Intuitive form with labeled inputs and clear guidance.
- 📊 **Enhanced Prediction Display:** Visually appealing results with a Doughnut Chart showing prediction confidence.
- 📂 **Personal Prediction History:** Users can view their past predictions saved locally.
- 📄 **Export Prediction to PDF:** Download individual prediction results as a PDF report.
- 🖥️ **Admin Dashboard:** A dedicated view for administrators to see all predictions made by all users in real-time.
- ☁️ **Centralized Prediction Storage (Firestore):** All user predictions are securely stored in a Firebase Firestore database.(upcoming)
- 🌓 **Dark Mode UI** (in future)

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
│ ├── data/ # Raw or processed datasets
│ ├── models/ # Trained model files (e.g., model.pkl, scaler.pkl)
│ ├── templates/ # HTMLtemplates for Flask
│ ├── app.py # Main Flask app
│ ├── generate_pkl.py # Script to train and save model
│ └── loan_data.csv # Dataset used for training
│
├── frontend/ # Vite + React Frontend
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ │ ├── predictor/ # Components specific to the predictor page
│ │ │ │    ├── PredictionResult.jsx
│ │ │ │    ├── PredictorInputs.jsx
│ │ │ │    └── PredictorSelector.jsx
│ │ │ └── History.jsx
│ │ ├── constants/ # Global constants like form initial state, labels, icons
│ │ │ └── predictorConstants.js
│ │ ├── pages/ # Main pages (Home, Predictor, History)
│ │ └── App.jsx
│ ├── public/
│ └── index.html
│
├── .gitignore # Ignore node_modules, pycache, etc.
├── Loan_Repayment_Prediction.ipynb # Jupyter notebook used for ML training
├── Loan_Repayment_Prediction.pdf # PDF report
├── requirements.txt # Backend dependencies
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

1. Navigate to the frontend directory:

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

---

## 📜 License

This project is for educational purposes only.
Feel free to fork, modify, and build on it as you wish! 🙌

---

## 🙋‍♂️ Author

Made with ❤️ by Kanish Kainth

- 🔗 GitHub: kannishhh
- 📧 Email: knshkainth2002@gmail.com
- 💼 Open to internships and freelance opportunities!
