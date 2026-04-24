import React from "react";
import {
  Home,
  BarChart2,
  Map,
  CloudRain,
  Settings,
  HelpCircle } from
"lucide-react";
export const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
      <nav className="flex-1 mt-6">
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-gray-800 bg-gray-100 rounded-lg font-medium">
              
              <Home className="mr-3" size={18} />
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
              
              <Map className="mr-3" size={18} />
              Fields
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
              
              <CloudRain className="mr-3" size={18} />
              Weather
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
              
              <BarChart2 className="mr-3" size={18} />
              Analytics
            </a>
          </li>
        </ul>
      </nav>
      <div className="border-t border-gray-200 pt-4 mt-6">
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
              
              <Settings className="mr-3" size={18} />
              Settings
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
              
              <HelpCircle className="mr-3" size={18} />
              Help
            </a>
          </li>
        </ul>
      </div>
    </aside>);

};