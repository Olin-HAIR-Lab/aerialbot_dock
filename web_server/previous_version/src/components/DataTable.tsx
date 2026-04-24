import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SensorData } from "../types/sensorData";
interface DataTableProps {
  data: SensorData[];
}
export const DataTable = ({ data }: DataTableProps) => {
  return (
    <div className="-mx-4 sm:mx-0 sm:overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                
                <div className="flex items-center">
                  Location
                  <ChevronDown size={16} className="ml-1" />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                
                <div className="flex items-center">Sensor Type</div>
              </th>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                
                <div className="flex items-center">Value</div>
              </th>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                
                <div className="flex items-center">Status</div>
              </th>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                
                <div className="flex items-center">
                  Timestamp
                  <ChevronUp size={16} className="ml-1" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((sensor) =>
            <tr key={sensor.id}>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {sensor.location}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                  {sensor.type}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sensor.value}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sensor.status === "Normal" ? "bg-green-100 text-green-800" : sensor.status === "Low" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                  
                    {sensor.status}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                  {sensor.timestamp}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

};