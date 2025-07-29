import toast from "react-hot-toast";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTriangleExclamation,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PredictionResult = ({ result, pdfRef, pdfLoading, setPdfLoading }) => {
  const { width, height } = useWindowSize();

  const getChartData = (predictionResult) => {
    if (!predictionResult || !predictionResult.confidence) return null;

    const confidenceValue = parseFloat(
      predictionResult.confidence.replace(/[^\d.]/g, "")
    );
    const isRepaid = predictionResult.result?.includes("Repaid");

    const mainColor = isRepaid ? "#10B981" : "#F59E0B";
    const backgroundColor = isRepaid ? "#D1FAE5" : "#FEF3C7";

    return {
      labels: [
        isRepaid ? "Confidence of Repayment" : "Confidence of Default",
        "Remaining",
      ],
      datasets: [
        {
          data: [confidenceValue, 100 - confidenceValue],
          backgroundColor: [mainColor, backgroundColor],
          borderColor: [mainColor, backgroundColor],
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += context.parsed + "%";
            }
            return label;
          },
        },
      },
    },
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) {
      toast.error("Unable to generate PDF. Please try again.");
      return;
    }

    setPdfLoading(true);
    const element = pdfRef.current;
    const originalStyle = {
      width: element.style.width,
      height: element.style.height,
    };

    try {
      element.style.width = '550px';
      element.style.height = 'auto';
      
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.9); 

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasAspectRatio = canvas.width / canvas.height;

      let imgWidth = pdfWidth - 40; 
      let imgHeight = imgWidth / canvasAspectRatio;

      if (imgHeight > pdfHeight - 40) {
        imgHeight = pdfHeight - 40;
        imgWidth = imgHeight * canvasAspectRatio;
      }

      const xOffset = (pdfWidth - imgWidth) / 2;
      const yOffset = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, "JPEG", xOffset, yOffset, imgWidth, imgHeight);
      pdf.save("loan_prediction_result.pdf");

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      element.style.width = originalStyle.width;
      element.style.height = originalStyle.height;
      setPdfLoading(false);
    }
  };

  return (
    <div className="mt-10">
      {result.error ? (
        <div className="p-8 rounded-xl shadow-lg bg-red-100 text-red-700 text-center border border-red-200">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="text-5xl mb-4 text-red-500"
          />
          <h2 className="text-2xl font-bold mb-2">Error: {result.error}</h2>
          <p className="text-lg text-red-600">
            Please review your inputs and try again.
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
            className={`p-8 rounded-xl shadow-lg transition duration-300 ease-in-out flex flex-col items-center justify-center text-center border
              ${
                result.result?.includes("Repaid")
                  ? "bg-green-100 border-green-200"
                  : "bg-yellow-100 border-yellow-200"
              }`}
          >
            <div
              className={`text-5xl mb-4 ${
                result.result.includes("Repaid")
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {result.result.includes("Repaid") ? (
                <FontAwesomeIcon icon={faCheckCircle} />
              ) : (
                <FontAwesomeIcon icon={faTriangleExclamation} />
              )}
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {result.result}
            </h2>

            <p className="text-xl text-gray-700 font-semibold mb-6">
              {result.confidence}
            </p>

            {getChartData(result) && (
              <div className="relative w-60 h-60 mx-auto mb-6">
                <Doughnut data={getChartData(result)} options={chartOptions} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-gray-800">
                    {parseFloat(result.confidence.replace(/[^\d.]/g, ""))} %
                  </span>
                </div>
              </div>
            )}

            <p className="text-base text-gray-600 mt-2 max-w-md">
              This prediction reflects the model's confidence based on the
              provided data. It is for informational purposes only.
            </p>
          </div>

          <div className="text-center mt-6">
            {" "}
            <button
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              className={`inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-lg transition-colors duration-300 ease-in-out shadow-md
                ${
                  pdfLoading
                    ? "bg-gray-400 cursor-not-allowed text-gray-700"
                    : "bg-gray-700 hover:bg-gray-800 text-white cursor-pointer"
                }
              `}
            >
              {pdfLoading ? (
                "Generating PDF..."
              ) : (
                <>
                  <FontAwesomeIcon icon={faDownload} className="h-5 w-5" />
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
