import { useState } from "react";
import toast from "react-hot-toast";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";
import { Link } from "react-router-dom";
import { useRef } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const initialForm = {
  "credit.policy": 1,
  purpose: "credit_card",
  "int.rate": "",
  installment: "",
  "log.annual.inc": "",
  dti: "",
  fico: "",
  "days.with.cr.line": "",
  "revol.bal": "",
  "revol.util": "",
  "inq.last.6mths": "",
  "delinq.2yrs": "",
  "pub.rec": "",
};

const purposeOptions = [
  "credit_card",
  "debt_consolidation",
  "educational",
  "home_improvement",
  "major_purchase",
  "small_business",
  "all_other",
];

const labelMap = {
  "credit.policy": "CREDIT POLICY APPROVAL",
  purpose: "LOAN PURPOSE",
  "int.rate": "INTEREST RATE (%)",
  installment: "MONTHLY INSTALLMENT (₹)",
  "log.annual.inc": "LOG OF ANNUAL INCOME",
  dti: "DEBT TO INCOME RATIO (%)",
  fico: "FICO SCORE",
  "days.with.cr.line": "DAYS WITH CREDIT LINE",
  "revol.bal": "REVOLVING BALANCE (₹)",
  "revol.util": "REVOLVING CREDIT UTILIZATION (%)",
  "inq.last.6mths": "INQUIRIES IN LAST 6 MONTHS",
  "delinq.2yrs": "DELINQUENCIES IN LAST 2 YEARS",
  "pub.rec": "PUBLIC RECORDS",
};

const Predictor = ({ onLogout }) => {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const { width, height } = useWindowSize();

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

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) {
      toast.error("Unable to generate PDF. Please try again.");
      return;
    }

    setPdfLoading(true);

    try {
      const element = pdfRef.current;

      await new Promise((resolve) => setTimeout(resolve, 100));

      const html2canvasOptions = {
        scale: 1,
        useCORS: true,
      };

      const canvas = await html2canvas(element, html2canvasOptions);

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "p",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("loan_prediction_result.pdf");

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
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
        (typeof value === "number" && isNaN(form[key]))
      ) {
        toast.error(`Please enter a valid value for ${labelMap[key] || key}`);
        setLoading(false);
        return;
      }
    }

    localStorage.setItem("userEmail", form.email);

    const email = localStorage.getItem("userEmail");

    await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Email": email || "guest",
      },
      body: JSON.stringify(form),
    });

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        const entry = {
          ...data,
          timestamp: new Date().toLocaleString(),
        };
        const oldHistory = JSON.parse(localStorage.getItem("history") || "[]");
        const newHistory = [entry, ...oldHistory];
        localStorage.setItem("history", JSON.stringify(newHistory));
      } else {
        setResult({ error: data.error || "Prediction failed." });
      }
    } catch {
      setResult({ error: "Server error. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center flex-col">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-extrabold text-blue-700 tracking-wide text-center">
            Loan Repayment Predictor
          </h1>
          <button
            onClick={() => {
              localStorage.setItem("isLoggedIn", "false");
              onLogout();
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform"
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <label className="block">
            <span className="text-gray-700">{labelMap["credit.policy"]}</span>
            <select
              name="credit.policy"
              value={form["credit.policy"]}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            >
              <option value={1}>Meets Credit Policy</option>
              <option value={0}>Does Not Meet Policy</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">{labelMap["purpose"]}</span>
            <select
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            >
              {purposeOptions.map((p) => (
                <option key={p} value={p}>
                  {p.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>
          </label>

          {Object.keys(initialForm)
            .filter((key) => key !== "purpose" && key !== "credit.policy")
            .map((key) => (
              <label key={key} className="block">
                <span className="text-gray-700">{labelMap[key]}</span>
                <input
                  type="number"
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                  required
                />
              </label>
            ))}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </form>

        {result && !result.error && (
          <div>
            {result.result?.includes("Repaid") && (
              <Confetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={300}
                gravity={0.5}
              />
            )}
            <div
              id="pdf-result"
              ref={pdfRef}
              className={`p-6 rounded-lg shadow-md text-white mt-8 transition duration-300 ${
                result.result?.includes("Repaid")
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              <div className="text-3xl mb-2">
                {result.result.includes("Repaid") ? (
                  <FontAwesomeIcon icon={faCheckCircle} />
                ) : (
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                )}
              </div>
              <h2 className="text-xl font-semibold">{result.result}</h2>
              <p className="text-sm mt-2">{result.confidence}</p>
              <div className="w-full bg-white/30 h-3 mt-4 rounded overflow-hidden">
                {(() => {
                  const percentage = parseFloat(
                    result.confidence?.replace(/[^\d.]/g, "")
                  );
                  return (
                    <div
                      className={`h-full ${
                        result.result.includes("Repaid")
                          ? "bg-white"
                          : "bg-yellow-300"
                      }`}
                      style={{
                        width: `${percentage || 0}%`,
                        transition: "width 0.8s ease-in-out",
                      }}
                    ></div>
                  );
                })()}
              </div>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              className={`mt-4 px-6 py-2 text-white rounded transition-colors ${
                pdfLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700 cursor-pointer"
              }`}
            >
              {pdfLoading ? "Generating PDF..." : "Download as PDF"}
            </button>
          </div>
        )}
      </div>
      <Link
        to="/history"
        className="text-blue-600 hover:text-blue-800 font-medium mt-4 inline-block px-4 py-2 rounded-md border border-blue-600 hover:border-blue-800 transition duration-300 ease-in-out"
      >
        View Prediction History
      </Link>
    </div>
  );
};

export default Predictor;
