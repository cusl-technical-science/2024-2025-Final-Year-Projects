import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart = ({ title, count, color }) => {
    const data = {
        labels: [title],
        datasets: [
            {
                label: `${title} Count`,
                data: [count],
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: true, text: title },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
            <div className="h-40">
                <Bar data={data} options={options} />
            </div>
            <p className="text-center text-2xl font-bold mt-4 text-gray-700">{count}</p>
        </div>
    );
};

export default Chart;
