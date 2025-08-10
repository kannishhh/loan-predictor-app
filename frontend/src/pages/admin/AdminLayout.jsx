import { NavLink, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import {
  ChartBarIcon,
  Cog6ToothIcon,
  UsersIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

// eslint-disable-next-line no-unused-vars
const SidebarItem = ({ icon: Icon, text, to, end = false }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ease-in-out
        ${
          isActive
            ? "bg-purple-600 text-white shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)] border-l-4 border-teal-400 transform translate-x-1"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      <Icon className="h-6 w-6" />
      <span className="text-sm font-medium">{text}</span>
    </NavLink>
  );
};

SidebarItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  end: PropTypes.bool,
};

const AdminLayout = ({ onAdminLogout }) => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <aside className="w-64 bg-gray-900 text-gray-200 flex flex-col p-6 shadow-[0 6px 8px rgba(0, 0, 0, 0.07), 0 12px 20px rgba(0, 0, 0, 0.05)] h-screen sticky top-0">
        <div className="flex items-center space-x-3 mb-10 mt-2">
          <Cog6ToothIcon className="h-8 w-8 text-purple-500" />
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Admin Panel
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={Squares2X2Icon} text="Dashboard" to="/admin" end />
          <SidebarItem
            icon={ClipboardDocumentListIcon}
            text="All Predictions"
            to="/admin/predictions"
          />
          <SidebarItem
            icon={ChatBubbleBottomCenterTextIcon}
            text="Feedback"
            to="/admin/feedback"
          />
          <SidebarItem icon={UsersIcon} text="Manage Users" to="/admin/users" />
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-700">
          <button
            onClick={onAdminLogout}
            className="flex items-center space-x-3 p-3 w-full text-left bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 ease-in-out font-medium"
          >
            <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

AdminLayout.propTypes = {
  onAdminLogout: PropTypes.func.isRequired,
};

export default AdminLayout;
