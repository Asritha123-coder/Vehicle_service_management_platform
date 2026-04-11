import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  UserCircle, 
  LogOut,
  Wrench
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ServiceSidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Assigned Tasks', icon: ClipboardList, path: '/technician' },
    { name: 'In Progress Tasks', icon: Clock, path: '/technician/active' },
    { name: 'Completed Tasks', icon: CheckCircle2, path: '/technician/history' },
    { name: 'Profile', icon: UserCircle, path: '/technician/profile' },
  ];

  return (
    <div className="sidebar">
      <div className="mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-glow">
          <Wrench className="text-white" size={20} />
        </div>
        <span className="text-xl font-bold tracking-tight">AutoCare Tech</span>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/technician'}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 no-underline
              ${isActive 
                ? 'bg-accent text-white shadow-glow' 
                : 'text-muted hover:bg-white/5 hover:text-white'}
            `}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/10 space-y-2">
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

export default ServiceSidebar;
