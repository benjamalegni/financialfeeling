import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function StockChart({ symbol, data }: { symbol: string, data: { x: string, y: number }[] }) {
  return (
    <div className="bg-black/60 rounded-lg p-4 mb-4">
      <h4 className="text-white font-bold mb-2">{symbol}</h4>
      <Line
        data={{
          labels: data.map(point => point.x),
          datasets: [
            {
              label: symbol,
              data: data.map(point => point.y),
              borderColor: '#4facfe',
              backgroundColor: 'rgba(79,172,254,0.2)',
              tension: 0.3,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
          },
          scales: {
            x: { ticks: { color: '#fff' } },
            y: { ticks: { color: '#fff' } },
          },
        }}
      />
    </div>
  );
} 