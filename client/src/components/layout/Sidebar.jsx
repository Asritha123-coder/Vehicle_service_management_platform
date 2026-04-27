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
  LogOut,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ collapsed }) => {
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
          { name: 'System Overview', icon: LayoutDashboard, path: '/admin' },
          { name: 'User Management', icon: Users, path: '/admin/users' },
          { name: 'All Appointments', icon: Calendar, path: '/admin/appointments' },
          { name: 'Financials', icon: FileText, path: '/admin/invoices' },
      ],
      service_center: [
          { name: 'Center Dashboard', icon: LayoutDashboard, path: '/service-center' },
          { name: 'Manage Bookings', icon: Calendar, path: '/admin/appointments' },
          { name: 'Billing', icon: FileText, path: '/admin/invoices' },
      ]
  };

  const currentMenu = menuItems[role] || menuItems.customer;

  return (
    <div className={`flex flex-col h-full bg-white border-r border-slate-100 shadow-sm transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className={`p-8 flex items-center gap-3 ${collapsed ? 'justify-center p-6' : ''}`}>
        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-blue-200 ring-4 ring-blue-50">
          <ShieldAlert className="text-white" size={20} />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden whitespace-nowrap transition-all">
            <span className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Service<span className="text-blue-600">Hub</span></span>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] -mt-1">{role?.replace('_', ' ')}</span>
          </div>
        )}
      </div>
      
      <nav className="flex-1 px-4 mt-6 space-y-1 overflow-hidden">
        {!collapsed && <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 whitespace-nowrap">Operations</p>}
        {currentMenu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => `
              group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 no-underline
              ${isActive 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className="flex-shrink-0 transition-colors" />
              {!collapsed && <span className="font-bold text-sm tracking-tight whitespace-nowrap">{item.name}</span>}
            </div>
            {!collapsed && <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 ${item.path === '/admin' ? 'text-white' : 'text-blue-600'}`} />}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-slate-50 space-y-2">
  
        <button 
          onClick={logout}
          className={`flex items-center gap-3 text-rose-500 hover:text-rose-600 w-full px-4 py-3 rounded-xl hover:bg-rose-50 transition-all font-bold text-sm tracking-tight ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
