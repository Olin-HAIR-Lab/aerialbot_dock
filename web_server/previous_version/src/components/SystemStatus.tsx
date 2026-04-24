import React from "react";
import { Battery, Wifi, Server, AlertCircle } from "lucide-react";
export const SystemStatus = () => {
  const batteryLevel = 78;
  const signalStrength = 92;
  const serverStatus = "Online";
  const lastUpdate = "2 minutes ago";
  const alerts = 1;
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Battery className="text-gray-600 mr-2" size={18} />
            <span className="text-sm font-medium text-gray-700">Battery</span>
          </div>
          <span className="text-sm font-semibold">{batteryLevel}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${batteryLevel > 20 ? "bg-green-500" : "bg-red-500"}`}
            style={{
              width: `${batteryLevel}%`
            }}>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Wifi className="text-gray-600 mr-2" size={18} />
            <span className="text-sm font-medium text-gray-700">Signal</span>
          </div>
          <span className="text-sm font-semibold">{signalStrength}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{
              width: `${signalStrength}%`
            }}>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center py-3 border-t border-gray-200">
        <div className="flex items-center">
          <Server className="text-gray-600 mr-2" size={18} />
          <span className="text-sm font-medium text-gray-700">
            Server Status
          </span>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {serverStatus}
        </span>
      </div>
      <div className="flex justify-between items-center py-3 border-t border-gray-200">
        <div className="flex items-center">
          <AlertCircle className="text-gray-600 mr-2" size={18} />
          <span className="text-sm font-medium text-gray-700">Alerts</span>
        </div>
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {alerts}
          </span>
        </div>
      </div>
      <div className="pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">Last update: {lastUpdate}</p>
      </div>
    </div>);

};