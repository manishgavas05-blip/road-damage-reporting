import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Analytics({ stats }) {
  // Pie Chart
  const pieData = {
    labels: ["Pending", "In Progress", "Resolved"],
    datasets: [
      {
        data: [
          stats.pending,
          stats.inProgress,
          stats.resolved,
        ],
        backgroundColor: [
          "#FACC15",
          "#3B82F6",
          "#22C55E",
        ],
      },
    ],
  };

  // Bar Chart
  const barData = {
    labels: ["Reports"],
    datasets: [
      {
        label: "Pending",
        data: [stats.pending],
        backgroundColor: "#FACC15",
      },
      {
        label: "In Progress",
        data: [stats.inProgress],
        backgroundColor: "#3B82F6",
      },
      {
        label: "Resolved",
        data: [stats.resolved],
        backgroundColor: "#22C55E",
      },
    ],
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 mt-10">

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">
          Report Status
        </h2>

        <Pie data={pieData} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">
          Reports Overview
        </h2>

        <Bar data={barData} />
      </div>

    </div>
  );
}

export default Analytics;