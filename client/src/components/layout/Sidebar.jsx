import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  History, 
  FileText, 
  Users, 
  Settings,
  Wrench,
  Activity,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const role = user?.role?.toLowerCase();

  const menuItems = {
      customer: [
          { name: 'Dashboard', icon: LayoutDashboard, path: '/customer' },
          { name: 'My Vehicles', icon: Car, path: '/customer/vehicles' },
          { name: 'Book Service', icon: Calendar, path: '/customer/appointments' },
          { name: 'Track Service', icon: Activity, path: '/customer/track' },
          { name: 'Service History', icon: History, path: '/customer/history' },
          { name: 'Invoices', icon: FileText, path: '/customer/invoices' },
      ],
      technician: [
          { name: 'Tasks', icon: Wrench, path: '/technician' },
          { name: 'History', icon: History, path: '/technician/history' },
      ],
      admin: [
          { name: 'Overview', icon: LayoutDashboard, path: '/admin' },
          { name: 'Users', icon: Users, path: '/admin/users' },
          { name: 'Appointments', icon: Calendar, path: '/admin/appointments' },
          { name: 'Invoices', icon: FileText, path: '/admin/invoices' },
      ],
  };

  const currentMenu = menuItems[role] || menuItems.customer;

  return (
    <div className="sidebar">
      <div className="mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-glow">
          <Wrench className="text-white" size={20} />
        </div>
        <span className="text-xl font-bold tracking-tight">AutoCare</span>
      </div>
      
      <nav className="flex-1 space-y-2">
        {currentMenu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 no-underline
              ${isActive 
                ? 'bg-primary text-white shadow-glow' 
                : 'text-muted hover:bg-white/5 hover:text-white'}
            `}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/10 space-y-2">
        <button className="flex items-center gap-3 text-muted hover:text-white w-full px-4 py-3 rounded-xl hover:bg-white/5 transition-all">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
        <button 
          onClick={logout}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
