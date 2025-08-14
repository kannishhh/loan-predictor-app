import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const generateChartData = (currentFico) => {
  const scores = [600, 650, 700, 750, 800, 850];
  const chartData = scores.map((score) => {
    let probability;
    if (score < 660) {
      probability = Math.min(
        Math.round(Math.random() * (score - 600) * 0.5 + 50),
        75
      );
    } else {
      probability = Math.min(
        Math.round(Math.random() * (score - 660) * 0.8 + 75),
        99
      );
    }

    return {
      name: `FICO ${score}`,
      probability,
      fill: score === parseInt(currentFico) ? "#8b5cf6" : "#c4b5fd",
      isCurrent: score === parseInt(currentFico),
    };
  });

  return chartData;
};

const PredictionChart = ({ ficoScore }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (ficoScore) {
      setData(generateChartData(ficoScore));
    }
  }, [ficoScore]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-white shadow-lg rounded-xl border border-gray-200">
          <p className="text-sm font-semibold text-gray-900">
            {payload[0].payload.name}
          </p>
          <p className="text-xs text-gray-500">
            Repayment Probability: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = (props) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill="#666"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={12}
      >
        {`${value}%`}
      </text>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Probability by FICO Score
      </h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 0, left: -20, bottom: 5 }}
          >
            <XAxis dataKey="name" stroke="#cbd5e1" />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              stroke="#cbd5e1"
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(203, 213, 225, 0.5)" }}
            />
            <Bar dataKey="probability" radius={[8, 8, 0, 0]}>
              <LabelList
                dataKey="probability"
                position="top"
                content={<CustomLabel />}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 text-lg">
          Enter a FICO score to see the chart.
        </div>
      )}
    </div>
  );
};

export default PredictionChart;
