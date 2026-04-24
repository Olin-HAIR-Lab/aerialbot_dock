import { Thermometer, Droplets, Wind, FlaskConical } from "lucide-react";

const Card = ({ icon: Icon, label, value, unit, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-800">
        {value ?? "—"}
        <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
      </p>
    </div>
  </div>
);

export const SummaryCards = ({ latest }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card icon={Thermometer} label="Temperature" value={latest?.temperature} unit="°C" color="bg-orange-400" />
      <Card icon={Droplets}    label="Soil Moisture" value={latest?.soil_moisture} unit="%" color="bg-blue-500" />
      <Card icon={Wind}        label="Humidity" value={latest?.humidity} unit="%" color="bg-teal-500" />
      <Card icon={FlaskConical} label="pH Level" value={latest?.ph_level} unit="" color="bg-purple-500" />
    </div>
  );
};
