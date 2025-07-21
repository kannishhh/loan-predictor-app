import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  ChartPieIcon,
  ArrowLeftStartOnRectangleIcon,
  RocketLaunchIcon,
  ClockIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

import PredictorInputs from "../components/predictor/PredictorInputs";
import PredictorSelector from "../components/predictor/PredictorSelector";
import PredictionResult from "../components/predictor/PredictionResult";
import {
  initialForm,
  purposeOptions,
  labelMap,
  getIconForField,
  creditPolicyOptions,
} from "../constants/predictorConstants";

const Predictor = ({ onLogout }) => {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const pdfRef = useRef();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]:
        type === "number"
          ? parseFloat(value)
          : name === "purpose"
          ? value.toLowerCase().replace(" ", "_")
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    for (const key in form) {
      const value = form[key];
      if (
        value === "" ||
        value === null ||
        (typeof value === "number" && isNaN(value))
      ) {
        toast.error(`Please enter a valid value for ${labelMap[key] || key}`);
        setLoading(false);
        return;
      }
    }

    const userEmail = localStorage.getItem("userEmail") || "guest";

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": userEmail,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        const entry = {
          ...data,
          timestamp: new Date().toLocaleString(),
          input: form,
          email: userEmail, 
        };
        const oldHistory = JSON.parse(localStorage.getItem("history") || "[]");
        const newHistory = [entry, ...oldHistory];
        localStorage.setItem("history", JSON.stringify(newHistory));
      } else {
        setResult({ error: data.error || "Prediction failed." });
        toast.error(data.error || "Prediction failed.");
      }
    } catch (error) {
      console.error("Prediction server error:", error);
      setResult({ error: "Server error. Please try again later." });
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out hover:shadow-xl">
       
        <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-extrabold text-gray-700 tracking-tight flex items-center">
            <ChartPieIcon className="h-10 w-10 text-purple-500 mr-3" />
            Loan Repayment Predictor
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("userToken"); 
              localStorage.removeItem("userEmail"); 
              onLogout();
            }}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>

        
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
        >
          <PredictorSelector
            name="credit.policy"
            label={labelMap["credit.policy"]}
            value={form["credit.policy"]}
            onChange={handleChange}
            options={creditPolicyOptions}
            IconComponent={getIconForField("credit.policy")}
            capitalizeOptions={false}
          />

          <PredictorSelector
            name="purpose"
            label={labelMap.purpose}
            value={form.purpose}
            onChange={handleChange}
            options={purposeOptions}
            IconComponent={getIconForField("pu")}
            capitalizeOptions={true}
          />

          {Object.keys(initialForm)
            .filter((key) => key !== "purpose" && key !== "credit.policy")
            .map((key) => (
              <PredictorInputs
                key={key}
                name={key}
                label={labelMap[key]}
                value={form[key]}
                onChange={handleChange}
                IconComponent={getIconForField(key)}
                type="number"
                required
                step="any"
              />
            ))}

          <div className="md:col-span-2 text-center mt-6">
            <button
              type="submit"
              className="flex items-center justify-center space-x-3 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RocketLaunchIcon className="h-6 w-6 animate-spin" />
                  <span>Predicting...</span>
                </>
              ) : (
                <>
                  <RocketLaunchIcon className="h-6 w-6" />
                  <span>Predict</span>
                </>
              )}
            </button>
          </div>
        </form>

        {result && (
          <PredictionResult
            result={result}
            pdfRef={pdfRef}
            pdfLoading={pdfLoading}
            setPdfLoading={setPdfLoading}
          />
        )}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/history"
          className="inline-flex items-center space-x-2 text-purple-500 hover:text-purple-600 font-medium px-6 py-3 rounded-lg border-2 border-purple-500 hover:border-purple-600 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
        >
          <ClockIcon className="h-5 w-5" />
          <span>View Prediction History</span>
        </Link>
      </div>
    </div>
  );
};

export default Predictor;
