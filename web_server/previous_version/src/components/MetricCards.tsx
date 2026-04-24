import React from "react";
import { Thermometer, Droplet, Wind, Activity } from "lucide-react";
export const MetricCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="bg-red-100 p-3 rounded-full">
            <Thermometer className="text-red-500" size={24} />
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-gray-500">Temperature</h4>
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold text-gray-800">
                24.5°C
              </span>
              <span className="ml-2 text-sm font-medium text-green-500">
                +2.3°
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="bg-red-500 h-full rounded-full"
            style={{
              width: "65%"
            }}>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <Droplet className="text-blue-500" size={24} />
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-gray-500">Soil Moisture</h4>
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold text-gray-800">42%</span>
              <span className="ml-2 text-sm font-medium text-red-500">-5%</span>
            </div>
          </div>
        </div>
        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full rounded-full"
            style={{
              width: "42%"
            }}>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="bg-teal-100 p-3 rounded-full">
            <Wind className="text-teal-500" size={24} />
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-gray-500">Humidity</h4>
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold text-gray-800">68%</span>
              <span className="ml-2 text-sm font-medium text-green-500">
                +3%
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="bg-teal-500 h-full rounded-full"
            style={{
              width: "68%"
            }}>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="bg-purple-100 p-3 rounded-full">
            <Activity className="text-purple-500" size={24} />
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-gray-500">pH Level</h4>
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold text-gray-800">6.8</span>
              <span className="ml-2 text-sm font-medium text-gray-500">
                Optimal
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="bg-purple-500 h-full rounded-full"
            style={{
              width: "75%"
            }}>
          </div>
        </div>
      </div>
    </div>);

};