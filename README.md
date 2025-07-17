# 🏦 Loan Eligibility Prediction App

A full-stack Loan Prediction web application built with **React(Vite + Tailwind CSS)** for the frontend and **Flask** for the backend. It allows users to check loan approval eligibility using a machine learning, view their prediction history, and download results as a PDF.

---

## 🔧 Tech Stack

### 🌐 Frontend:

- ⚛️ React (Vite)
- 🎨 Tailwind CSS
- 🧠 React Hooks & Routing
- 📄 html2pdf.js for PDF generation

### 🔙 Backend:

- 🐍 Flask
- 🔮 Trained ML Model (Logistic Regression / Decision Tree)
- 🧪 Scikit-Learn, Pandas, NUmpy

---

## ✅ Current Features

- 🔐 **Users Auth UI** (frontend only, full auth coming soon)
- 📝 **Loan Prediction Form** with labeled inputs
- 📊 **Displays Prediction & Confidence**
- 📂 **History Page** with saved prediction
- 📄 **Export Prediction to PDF**
- 🌓 **Dark Mode UI**

---

## 🧠 Machine Leraning

- Model trained using public loan dataset (e.g. Kaggle Loan Prediction)
- Preprocessing and training down using Pandas & Scikit-Learn
- Prediction served via Flask API

---

## 📁 Folder Structure

````bash
root/
│
├── backend/ #Flask Backend
│ ├── data/ #Raw or processed datasets
│ ├── models/ #Trained model files (e.g., model.pkl, scaler.pkl)
│ ├── templates/ #HTMLtemplates for Flask
│ ├── app.py #Main Flask app
│ ├── generate_pkl.py #Script to train and save model
│ └── loan_data.csv #Dataset used for training
│
├── frontend/ #Vite + React Frontend
│ ├── src/
│ │ ├── components/ #Reusable UI components
│ │ ├── pages/ #Main pages (Home, Predictor, History)
│ │ └── App.jsx
│ ├── public/
│ └── index.html
│
├── .gitignore #Ignore node_modules, pycache, etc.
├── Loan_Repayment_Prediction.ipynb #Jupyter notebook used for ML training
├── Loan_Repayment_Prediction.pdf #PDF report
├── requirements.txt #Backend dependencies
└── README.md
```

---

## 🚀 How to Run Locally

### 🔙 Backend (Flask)
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 🌐 Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

📜 License
This project is for educational purposes only.
Feel free to fork, modify, and build on it as you wish! 🙌

---

🙋‍♂️ Author
Made with ❤️ by Kanish Kainth
- 🔗 GitHub: kannishhh
- 📧 Email: knshkainth2002@gmail.com
- 💼 Open to internships and freelance opportunities!

