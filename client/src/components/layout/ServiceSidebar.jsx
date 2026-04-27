import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  UserCircle, 
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ServiceSidebar = ({ collapsed }) => {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Assigned Tasks', icon: ClipboardList, path: '/technician' },
    { name: 'In Progress', icon: Clock, path: '/technician/active' },
    { name: 'Completed Tasks', icon: CheckCircle2, path: '/technician/history' },
  ];

  return (
    <div className={`flex flex-col h-full bg-white border-r border-slate-100 shadow-sm transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className={`p-8 pb-10 flex items-center gap-3 ${collapsed ? 'justify-center p-6' : ''}`}>
        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-indigo-200 ring-4 ring-indigo-50">
          <ShieldCheck className="text-white" size={20} />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden whitespace-nowrap transition-all">
            <span className="text-xl font-black text-slate-900 tracking-tighter">Service</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 -mt-1">Technician</span>
          </div>
        )}
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-hidden">
        {!collapsed && <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 whitespace-nowrap">Operations</p>}
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/technician'}
            className={({ isActive }) => `
              group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 no-underline
              ${isActive 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className="flex-shrink-0 transition-colors" />
              {!collapsed && <span className="font-bold text-sm tracking-tight whitespace-nowrap">{item.name}</span>}
            </div>
            {!collapsed && <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ${item.path === '/technician' ? 'text-white' : 'text-indigo-500'}`} />}
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

export default ServiceSidebar;
