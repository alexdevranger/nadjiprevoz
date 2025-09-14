import { NavLink } from "react-router-dom";
import {
  Users,
  FileText,
  DollarSign,
  Settings,
  LayoutDashboard,
  Megaphone,
} from "lucide-react";

export default function Sidebar() {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-2 p-2 rounded ${
      isActive ? "bg-slate-700" : "hover:bg-slate-800"
    }`;

  return (
    <aside className="w-60 bg-slate-900 text-white min-h-screen p-4">
      <nav className="flex flex-col space-y-2">
        <NavLink to="/dashboard" className={linkClasses}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <NavLink to="/users" className={linkClasses}>
          <Users size={18} /> Users
        </NavLink>
        <NavLink to="/ads" className={linkClasses}>
          <FileText size={18} /> Ads
        </NavLink>
        <NavLink to="/sponsor-ads" className={linkClasses}>
          <Megaphone size={18} /> Sponsor Ads
        </NavLink>
        <NavLink to="/payments" className={linkClasses}>
          <DollarSign size={18} /> Payments
        </NavLink>
        <NavLink to="/settings" className={linkClasses}>
          <Settings size={18} /> Settings
        </NavLink>
      </nav>
    </aside>
  );
}
