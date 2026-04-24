import React from "react";
import { Menu, Bell, Settings, RefreshCw } from "lucide-react";
interface HeaderProps {
  onMenuClick: () => void;
  onRefresh: () => void;
  hasError?: boolean;
}
export const Header = ({ onMenuClick, onRefresh, hasError }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center">
        <button className="mr-4 md:hidden text-gray-600" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">FarmSense</h1>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onRefresh}
          className={`text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors ${hasError ? "text-red-500 hover:text-red-600" : ""}`}>
          
          <RefreshCw size={20} />
        </button>
        <button className="text-gray-600 hover:text-gray-800">
          <Bell size={20} />
        </button>
        <button className="text-gray-600 hover:text-gray-800">
          <Settings size={20} />
        </button>
        <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
            alt="User profile"
            className="w-full h-full object-cover" />
          
        </div>
      </div>
    </header>);

};