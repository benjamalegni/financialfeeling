import dynamic from 'next/dynamic';

const ApexChart: any = dynamic(() => import('react-apexcharts').then(mod => mod.default), { ssr: false });

export default function CandleChart({ symbol, data }: { symbol: string, data: { x: string, y: [number, number, number, number] }[] }) {
  return (
    <div className="bg-black/60 rounded-lg p-4 mb-4 hover:bg-black transition-colors duration-300">
      <h4 className="text-white font-bold mb-2">{symbol}</h4>
      <ApexChart
        type="candlestick"
        series={[{ data }]}
        options={{
          chart: { 
            id: 'candles', 
            background: 'transparent', 
            toolbar: { show: false },
            foreColor: '#fff'
          },
          xaxis: { 
            type: 'category', 
            labels: { style: { colors: '#fff' } },
            axisBorder: { color: '#333' },
            axisTicks: { color: '#333' }
          },
          yaxis: { 
            labels: { style: { colors: '#fff' } },
            axisBorder: { color: '#333' },
            axisTicks: { color: '#333' }
          },
          tooltip: { 
            enabled: true,
            theme: 'dark',
            style: { fontSize: '12px' }
          },
          grid: { 
            borderColor: '#333',
            strokeDashArray: 3,
            xaxis: { lines: { show: true, color: '#333' } },
            yaxis: { lines: { show: true, color: '#333' } }
          },
          plotOptions: {
            candlestick: {
              colors: {
                upward: '#10b981',
                downward: '#ef4444'
              }
            }
          }
        }}
        height={300}
      />
    </div>
  );
} 