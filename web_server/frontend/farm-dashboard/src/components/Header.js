import { Menu, RefreshCw, Bell, Settings, User } from "lucide-react";

export const Header = ({ onMenuClick, onRefresh }) => (
  <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
    <div className="flex items-center gap-3">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
      >
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">F</span>
        </div>
        <span className="font-semibold text-gray-800 text-lg">FarmSense</span>
      </div>
    </div>

    <div className="flex items-center gap-1">
      <button
        onClick={onRefresh}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
        title="Refresh data"
      >
        <RefreshCw size={18} />
      </button>
      <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition">
        <Bell size={18} />
      </button>
      <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition">
        <Settings size={18} />
      </button>
      <div className="ml-2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
        <User size={16} className="text-gray-500" />
      </div>
    </div>
  </header>
);
