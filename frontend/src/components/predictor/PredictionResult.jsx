import toast from "react-hot-toast";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon, 
} from "@heroicons/react/24/outline";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const PredictionResult = ({ result, pdfRef, pdfLoading, setPdfLoading }) => {
  const { width, height } = useWindowSize();

  const handleDownloadPDF = async () => {
    if (!pdfRef.current || !result) {
      toast.error("Prediction result not available for PDF download.");
      return;
    }

    setPdfLoading(true);

    try {
      const element = pdfRef.current;

      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, { scale: 2, useCORS: true });

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

  return (
    <div className="mt-12 pt-8 border-t border-gray-500">
      {result.error ? (
        <div className="p-6 rounded-lg shadow-md bg-red-600 text-white text-center flex flex-col items-center">
          <ExclamationTriangleIcon className="h-16 w-16 mb-4" />
          <h2 className="text-2xl font-semibold">Error: {result.error}</h2>
          <p className="text-sm mt-2 opacity-90">
            Please check your inputs and try again.
          </p>
        </div>
      ) : (
        <>
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
            className={`p-8 rounded-lg shadow-lg text-white transition duration-300 ${
              result.result?.includes("Repaid") ? "bg-green-600" : "bg-red-600"
            } text-center flex flex-col items-center`}
          >
            <div className="text-5xl mb-4">
              {result.result.includes("Repaid") ? (
                <CheckCircleIcon />
              ) : (
                <ExclamationTriangleIcon />
              )}
            </div>
            <h2 className="text-3xl font-extrabold mb-2">{result.result}</h2>
            <p className="text-lg opacity-90">
              Confidence: {result.confidence}
            </p>
            <div className="w-full max-w-sm bg-white/30 h-4 mt-6 rounded-full overflow-hidden">
              {(() => {
                const percentage = parseFloat(
                  result.confidence?.replace(/[^\d.]/g, "")
                );
                const barColor = result.result.includes("Repaid")
                  ? "bg-white"
                  : "bg-yellow-600"; 
                return (
                  <div
                    className={`h-full ${barColor} rounded-full`}
                    style={{
                      width: `${percentage || 0}%`,
                      transition: "width 0.8s ease-in-out",
                    }}
                  ></div>
                );
              })()}
            </div>
            <p className="text-xs opacity-80 mt-2">
              (Based on the provided data)
            </p>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleDownloadPDF} 
              disabled={pdfLoading}
              className={`inline-flex items-center justify-center space-x-2 px-6 py-2 rounded-lg shadow-md transition-colors duration-200 ease-in-out font-medium
                ${
                  pdfLoading
                    ? "bg-gray-600 text-gray-800 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-gray-900 text-white cursor-pointer"
                }`}
            >
              {pdfLoading ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  <span>Download as PDF</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PredictionResult;
