import { Battery, Wifi, Server, AlertCircle } from "lucide-react";

export const SystemStatus = ({ latest, pingData, alertCount }) => {
  const battery = latest?.battery_level ?? 0;
  const signal = latest?.signal_strength ?? 0;
  const serverOnline = !!pingData;
  const lastUpdate = latest?.timestamp
    ? new Date(latest.timestamp).toLocaleString()
    : "No data";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-5">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">System Status</h2>

      {/* Battery */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Battery size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">Battery</span>
          </div>
          <span className="text-sm font-semibold">{battery.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${battery > 20 ? "bg-green-500" : "bg-red-500"}`}
            style={{ width: `${battery}%` }}
          />
        </div>
      </div>

      {/* Signal */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Wifi size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">Signal</span>
          </div>
          <span className="text-sm font-semibold">{signal.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${signal}%` }} />
        </div>
      </div>

      {/* Server */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <Server size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600">Server</span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${serverOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {serverOnline ? "Online" : "Offline"}
        </span>
      </div>

      {/* Alerts */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <AlertCircle size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600">Alerts</span>
        </div>
        {alertCount > 0 ? (
          <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {alertCount}
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">None</span>
        )}
      </div>

      <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">Last reading: {lastUpdate}</p>
    </div>
  );
};
