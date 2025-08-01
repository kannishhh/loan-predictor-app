import { useState, useRef, useContext } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  ChartPieIcon,
  ArrowLeftStartOnRectangleIcon,
  RocketLaunchIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

// Importing our shared context
import { PredictionContext } from "../App";

// Importing sub-components
import PredictionResult from "../components/predictor/PredictionResult";
import PredictorSelector from "../components/predictor/PredictorSelector";
import PredictorInputs from "../components/predictor/PredictorInputs";

// Importing constants
import {
  initialForm,
  purposeOptions,
  labelMap,
  getIconForField,
  creditPolicyOptions,
} from "../constants/predictorConstants";

const Predictor = ({ onLogout }) => {
  // Use the useContext hook to get the function for adding new predictions
  const { handleNewPrediction } = useContext(PredictionContext);

  // State for form data, prediction result, loading indicators
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Ref for the PDF generation
  const pdfRef = useRef();

  // Handles changes in form input fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    if (Object.keys(initialForm).includes(name) && name !== "purpose") {
      processedValue = value === "" ? "" : parseFloat(value);
    } else if (name === "purpose") {
      processedValue = value.toLowerCase().replace(" ", "_");
    }

    setForm({
      ...form,
      [name]: processedValue,
    });
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Frontend validation
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

    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("You must be logged in to make a prediction.");
      setLoading(false);
      return;
    }

    const userEmail = localStorage.getItem("userEmail") || "guest";
    const userId = crypto.randomUUID();

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
          userId: userId,
          id: Date.now().toString(), // Unique ID for this prediction entry
        };

        // Call the context function to add the new prediction
        handleNewPrediction(entry);
        toast.success("Prediction saved to session memory!");

        // Save to Local Storage (for individual user history)
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
            IconComponent={getIconForField("purpose")}
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
