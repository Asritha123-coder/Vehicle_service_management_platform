import { LogOut, Bell, User, Search, Settings, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleColor = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return 'bg-rose-500';
      case 'service_center': return 'bg-amber-500';
      case 'technician': return 'bg-indigo-500';
      default: return 'bg-blue-600';
    }
  };

  return (
    <header className="h-20 border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-30 px-8 flex items-center justify-between">
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={toggleSidebar}
          className="p-2.5 -ml-2 text-slate-500 hover:bg-slate-50 rounded-2xl transition-all flex items-center justify-center lg:flex"
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="relative max-w-md w-full group hidden sm:block">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search dashboard, services, vehicles..." 
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2">
            <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>
            <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                <Settings size={20} />
            </button>
        </div>

        <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden sm:block"></div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-black text-slate-900 leading-tight">{user?.name || 'User Profile'}</p>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${getRoleColor(user?.role)}`}></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user?.role?.replace('_', ' ') || 'Guest'}</p>
            </div>
          </div>
          
          <button className="relative group">
            <div className="w-11 h-11 rounded-2xl bg-white border-2 border-slate-100 p-0.5 transition-all group-hover:border-blue-500 group-hover:shadow-lg group-hover:shadow-blue-100">
                <div className={`w-full h-full rounded-xl ${getRoleColor(user?.role)} flex items-center justify-center text-white text-base font-black`}>
                    {user?.name?.[0].toUpperCase() || 'U'}
                </div>
            </div>
            {/* Online indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="ml-2 p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all group"
            title="Logout"
          >
            <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
