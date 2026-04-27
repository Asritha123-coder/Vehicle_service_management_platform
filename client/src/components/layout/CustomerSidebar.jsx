import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  History, 
  FileText, 
  Activity,
  LogOut,
  Wrench,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CustomerSidebar = ({ collapsed }) => {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/customer' },
    { name: 'My Vehicles', icon: Car, path: '/customer/vehicles' },
    { name: 'Book Service', icon: Calendar, path: '/customer/appointments' },
    { name: 'Track Service', icon: Activity, path: '/customer/track' },
    { name: 'Service History', icon: History, path: '/customer/history' },
    { name: 'Invoices', icon: FileText, path: '/customer/invoices' },
  ];

  return (
    <div className={`flex flex-col h-full bg-white border-r border-slate-100 shadow-sm transition-all duration-300 overflow-hidden ${collapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Logo */}
      <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`} style={{ padding: collapsed ? '24px 0' : '24px' }}>
        <div className="w-10 h-10 min-w-10 min-h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
          <Wrench className="text-white" size={28} />
        </div>
        {!collapsed && (
          <span className="text-xl font-black text-slate-900 tracking-tighter whitespace-nowrap">
            ServiceHub
          </span>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1 mt-4">
        {!collapsed && (
          <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">
            Main Menu
          </p>
        )}

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/customer'}
            className={({ isActive }) => `
              group flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-300
              ${isActive 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon size={24} />
              {!collapsed && (
                <span className="font-bold text-sm whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </div>

            {!collapsed && (
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-blue-600" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button 
          onClick={logout}
          className={`flex items-center gap-3 text-rose-500 hover:text-rose-600 w-full px-3 py-3 rounded-xl hover:bg-rose-50 transition-all font-bold text-sm ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={24} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

    </div>
  );
};

export default CustomerSidebar;