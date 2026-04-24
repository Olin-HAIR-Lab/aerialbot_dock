import { Thermometer, Droplets, Wind, FlaskConical, TrendingUp, TrendingDown } from "lucide-react";

const Card = ({ icon: Icon, label, value, unit, color, bgColor, trend, trendLabel, progress }) => {
  const trendUp = trend > 0;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${bgColor}`}>
          <Icon size={20} className={color} />
        </div>
        {trend !== null && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? "text-green-600" : "text-red-500"}`}>
            {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trendUp ? "+" : ""}{trend !== null ? trend.toFixed(1) : ""}
          </div>
        )}
        {trendLabel && (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            {trendLabel}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-800">
        {value ?? "—"}
        <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
      </p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {progress !== null && (
        <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${bgColor.replace("bg-", "bg-").replace("-100", "-400")}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

const calcTrend = (latest, prev, key) => {
  if (!latest || !prev || latest[key] == null || prev[key] == null) return null;
  return parseFloat(latest[key]) - parseFloat(prev[key]);
};

export const MetricCards = ({ sensorData }) => {
  const latest = sensorData[0] ?? null;
  const prev   = sensorData[1] ?? null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        icon={Thermometer}
        label="Temperature"
        value={latest?.temperature != null ? parseFloat(latest.temperature).toFixed(1) : null}
        unit="°C"
        color="text-orange-500"
        bgColor="bg-orange-100"
        trend={calcTrend(latest, prev, "temperature")}
        trendLabel={null}
        progress={latest?.temperature ? (parseFloat(latest.temperature) / 50) * 100 : 0}
      />
      <Card
        icon={Droplets}
        label="Soil Moisture"
        value={latest?.soil_moisture != null ? parseFloat(latest.soil_moisture).toFixed(1) : null}
        unit="%"
        color="text-blue-500"
        bgColor="bg-blue-100"
        trend={calcTrend(latest, prev, "soil_moisture")}
        trendLabel={null}
        progress={latest?.soil_moisture ? parseFloat(latest.soil_moisture) : 0}
      />
      <Card
        icon={Wind}
        label="Humidity"
        value={latest?.humidity != null ? parseFloat(latest.humidity).toFixed(1) : null}
        unit="%"
        color="text-teal-500"
        bgColor="bg-teal-100"
        trend={calcTrend(latest, prev, "humidity")}
        trendLabel={null}
        progress={latest?.humidity ? parseFloat(latest.humidity) : 0}
      />
      <Card
        icon={FlaskConical}
        label="pH Level"
        value={latest?.ph_level != null ? parseFloat(latest.ph_level).toFixed(1) : null}
        unit=""
        color="text-purple-500"
        bgColor="bg-purple-100"
        trend={null}
        trendLabel={latest?.ph_level ? (parseFloat(latest.ph_level) >= 6 && parseFloat(latest.ph_level) <= 7.5 ? "Optimal" : "Check") : null}
        progress={latest?.ph_level ? (parseFloat(latest.ph_level) / 14) * 100 : 0}
      />
    </div>
  );
};
