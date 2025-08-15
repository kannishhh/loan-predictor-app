import { useState, useRef, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  ChartPieIcon,
  ArrowLeftStartOnRectangleIcon,
  RocketLaunchIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

// Importing Firebase functions
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Import PredictionContext
import { PredictionContext } from "../context/PredictionContext";

// Import sub-components
import PredictionResult from "../components/predictor/PredictionResult";
import PredictorSelector from "../components/predictor/PredictorSelector";
import PredictorInputs from "../components/predictor/PredictorInputs";

// Import constants
import {
  initialForm,
  purposeOptions,
  labelMap,
  getIconForField,
  creditPolicyOptions,
  creditScoreOptions,
} from "../constants/predictorConstants";

const Predictor = ({ onLogout }) => {
  const { db, userId } = useContext(PredictionContext);

  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    if (db && userId) {
      setIsDbReady(true);
    }
  }, [db, userId]);

  const pdfRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (
      Object.keys(initialForm).includes(name) &&
      name !== "purpose" &&
      name !== "credit_score_type"
    ) {
      processedValue = value === "" ? "" : parseFloat(value);
    } else if (name === "purpose") {
      processedValue = value.toLowerCase().replace(" ", "_");
    }
    setForm({
      ...form,
      [name]: processedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    if (!isDbReady) {
      toast.error("Database connection is not ready. Please try again.");
      setLoading(false);
      return;
    }

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

    try {
      const backendResponse = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        throw new Error(errorData.error || "Backend prediction failed");
      }

      const backendResult = await backendResponse.json();

      const predictionText = backendResult.result;
      const confidenceValue = backendResult.confidence;

      const predictionData = {
        input: form,
        result: predictionText,
        prediction: predictionText,
        timestamp: serverTimestamp(),
        userId: userId,
        confidence: confidenceValue,
      };

      const predictionsCollectionRef = collection(
        db,
        "users",
        userId,
        "predictions"
      );
      await addDoc(predictionsCollectionRef, predictionData);

      const newResult = {
        result: predictionText,
        confidence: confidenceValue,
      };
      setResult(newResult);
      toast.success("Prediction saved successfully!");
    } catch (error) {
      console.error("Database error:", error);
      setResult({ error: "Server or database error. Please try again later." });
      toast.error("Prediction failed due to a server or database error.");
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
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <ClockIcon className="h-5 w-5" />
              <span>Dashboard </span>
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
              <span>Logout </span>
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
        >
          {/* Selectors */}
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
          <PredictorSelector
            name="credit_score_type"
            label={labelMap["credit_score_type"]}
            value={form.credit_score_type}
            onChange={handleChange}
            options={creditScoreOptions.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            IconComponent={getIconForField("credit_score_type")}
            capitalizeOptions={false}
          />

          {Object.keys(initialForm)
            .filter(
              (key) =>
                key !== "purpose" &&
                key !== "credit.policy" &&
                key !== "credit_score_type"
            )
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
              disabled={loading || !isDbReady}
            >
              {loading ? (
                <>
                  <RocketLaunchIcon className="h-6 w-6 animate-spin" />
                  <span>Predicting...</span>
                </>
              ) : (
                <>
                  <RocketLaunchIcon className="h-6 w-6" />
                  <span>Predict </span>
                </>
              )}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-12 md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PredictionResult
                result={result}
                pdfRef={pdfRef}
                setPdfLoading={() => {}}
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Predictor;
