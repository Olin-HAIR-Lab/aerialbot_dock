import { LayoutDashboard, Map, BarChart2, Table2, Settings, HelpCircle } from "lucide-react";

const NAV = [
  { id: "Dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "Fields",    icon: Map,            label: "Fields" },
  { id: "Analytics", icon: BarChart2,      label: "Analytics" },
  { id: "Data",      icon: Table2,         label: "Data" },
];

const SECONDARY = [
  { icon: Settings,   label: "Settings" },
  { icon: HelpCircle, label: "Help" },
];

export const Sidebar = ({ active, onNavigate }) => (
  <nav className="flex flex-col h-full py-4">
    <div className="flex-1 px-3 space-y-1">
      {NAV.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            active === id
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
    </div>

    <div className="px-3 space-y-1 border-t border-gray-100 pt-4">
      {SECONDARY.map(({ icon: Icon, label }) => (
        <button
          key={label}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition"
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
    </div>
  </nav>
);
