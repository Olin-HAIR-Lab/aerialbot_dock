import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const Chart = ({ data, lines, title }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {lines.map(({ key, color, label }) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            name={label}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export const AnalyticsCharts = ({ stats }) => {
  const formatted = stats.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    avg_temperature:   d.avg_temperature   != null ? +parseFloat(d.avg_temperature).toFixed(1)   : null,
    avg_soil_moisture: d.avg_soil_moisture != null ? +parseFloat(d.avg_soil_moisture).toFixed(1) : null,
    avg_humidity:      d.avg_humidity      != null ? +parseFloat(d.avg_humidity).toFixed(1)      : null,
    avg_ph_level:      d.avg_ph_level      != null ? +parseFloat(d.avg_ph_level).toFixed(2)      : null,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Chart
        title="Temperature (°C)"
        data={formatted}
        lines={[
          { key: "avg_temperature", color: "#f97316", label: "Avg" },
          { key: "min_temperature", color: "#93c5fd", label: "Min" },
          { key: "max_temperature", color: "#ef4444", label: "Max" },
        ]}
      />
      <Chart
        title="Soil Moisture (%)"
        data={formatted}
        lines={[{ key: "avg_soil_moisture", color: "#3b82f6", label: "Avg Moisture" }]}
      />
      <Chart
        title="Humidity (%)"
        data={formatted}
        lines={[{ key: "avg_humidity", color: "#14b8a6", label: "Avg Humidity" }]}
      />
      <Chart
        title="pH Level"
        data={formatted}
        lines={[{ key: "avg_ph_level", color: "#a855f7", label: "Avg pH" }]}
      />
    </div>
  );
};
