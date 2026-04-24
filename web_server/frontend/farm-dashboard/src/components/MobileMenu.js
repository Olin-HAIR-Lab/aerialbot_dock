import { X } from "lucide-react";
import { Sidebar } from "./Sidebar";

export const MobileMenu = ({ open, onClose, active, onNavigate }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-semibold text-gray-800">FarmSense</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-500 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Sidebar
            active={active}
            onNavigate={(id) => { onNavigate(id); onClose(); }}
          />
        </div>
      </div>
    </div>
  );
};
