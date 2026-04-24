import React from "react";
import { X } from "lucide-react";
import { Sidebar } from "./Sidebar";
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}
export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <>
      {/* Overlay */}
      {isOpen &&
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose} />

      }
      {/* Slide-out menu */}
      <div
        className={`fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} w-64 bg-white z-50 transition-transform duration-300 ease-in-out md:hidden`}>
        
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">FarmSense</h1>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700">
            
            <X size={24} />
          </button>
        </div>
        <Sidebar />
      </div>
    </>);

};