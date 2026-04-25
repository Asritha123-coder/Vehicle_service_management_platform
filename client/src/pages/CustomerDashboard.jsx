import React, { useEffect, useState } from "react";
import { getUserVehicles } from "../services/vehicleService";
import { getUserAppointments } from "../services/appointmentService";
import { getUserInvoices } from "../services/invoiceService";
import { Link, useNavigate } from "react-router-dom";
import { 
  Car, 
  Calendar, 
  CreditCard, 
  Plus, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  ArrowUpRight,
  TrendingUp,
  Settings,
  Bell
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    vehicles: 0,
    appointments: 0,
    pendingInvoices: 0,
  });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [vehiclesData, appointments, invoices] = await Promise.all([
          getUserVehicles(),
          getUserAppointments(),
          getUserInvoices(),
        ]);

        const pendingInvoices = invoices.filter(inv => inv.paymentStatus === "PENDING").length;

        setStats({
          vehicles: vehiclesData.length,
          appointments: appointments.length,
          pendingInvoices: pendingInvoices,
        });
        setVehicles(vehiclesData);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Warming up your garage...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    { title: "Book Service", icon: <Calendar />, path: "/customer/appointments", color: "bg-blue-600", shadow: "shadow-blue-200" },
    { title: "Add Vehicle", icon: <Car />, path: "/customer/vehicles/add", color: "bg-indigo-600", shadow: "shadow-indigo-200" },
    { title: "Service History", icon: <Clock />, path: "/customer/history", color: "bg-slate-900", shadow: "shadow-slate-200" },
    { title: "Pay Invoices", icon: <CreditCard />, path: "/customer/invoices", color: "bg-emerald-600", shadow: "shadow-emerald-200" },
  ];

  return (
    <div className="animate-spring-up">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Hello, <span className="text-blue-600">{user?.name?.split(' ')[0] || 'Member'}</span>!
          </h1>
          <p className="text-slate-500 font-medium mt-1">Here's a quick look at your vehicle status.</p>
        </div>
        <button 
           onClick={() => navigate('/customer/appointments')}
           className="flex items-center gap-2 bg-blue-600 hover:bg-black text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-100 group"
        >
          <Plus size={18} />
          BOOK NEW SERVICE
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 text-blue-50 group-hover:text-blue-100 transition-colors">
            <Car size={80} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Car size={24} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">{stats.vehicles}</h3>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Registered Vehicles</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 text-indigo-50 group-hover:text-indigo-100 transition-colors">
            <Calendar size={80} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Calendar size={24} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">{stats.appointments}</h3>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Scheduled Services</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 text-emerald-50 group-hover:text-emerald-100 transition-colors">
            <CreditCard size={80} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <CreditCard size={24} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">{stats.pendingInvoices}</h3>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Pending Payments</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <section>
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {quickActions.map((action, i) => (
                    <Link 
                      key={i} 
                      to={action.path} 
                      className={`${action.color} ${action.shadow} p-6 rounded-[2rem] text-white flex flex-col items-center gap-4 hover:scale-105 active:scale-95 transition-all group no-underline`}
                    >
                       <div className="bg-white/20 p-3 rounded-2xl group-hover:rotate-12 transition-transform">
                          {React.cloneElement(action.icon, { size: 24 })}
                       </div>
                       <span className="text-[11px] font-black uppercase tracking-widest text-center">{action.title}</span>
                    </Link>
                 ))}
              </div>
           </section>

           <section>
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Vehicles</h2>
                 <Link to="/customer/vehicles" className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase tracking-widest no-underline">
                   View All <ChevronRight size={14} />
                 </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {vehicles.length === 0 ? (
                    <div className="col-span-2 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center text-slate-400">
                        <p className="font-bold text-sm tracking-widest uppercase mb-4">No vehicles found</p>
                        <Link to="/customer/vehicles/add" className="text-blue-600 font-black text-xs uppercase hover:underline">Register your first car</Link>
                    </div>
                ) : (
                    vehicles.slice(0, 2).map((vehicle, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 group hover:border-blue-200 transition-all">
                            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center p-2 group-hover:bg-blue-50 transition-colors">
                                <Car size={32} className="text-slate-400 group-hover:text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-lg font-black text-slate-900 leading-tight">{vehicle.model}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em] mt-1">{vehicle.licensePlate}</p>
                            </div>
                            <Link to={`/customer/vehicles`} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                <ArrowUpRight size={18} />
                            </Link>
                        </div>
                    ))
                )}
              </div>
           </section>
        </div>

        <div className="space-y-8">
           <section>
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Next Service</h2>
              </div>
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-blue-200">
                 <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                    <TrendingUp size={120} strokeWidth={1} />
                 </div>
                 <div className="relative z-10">
                    <div className="bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full w-fit mb-6 tracking-widest uppercase">Upcoming</div>
                    <p className="text-3xl font-black text-white leading-tight mb-2 tracking-tighter">Oil Change & Fluid Check</p>
                    <p className="text-slate-400 font-bold text-sm mb-8 tracking-wide italic">In 4 days - Jan 22, 2024</p>
                    
                    <button className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 active:scale-95 transition-all">
                       Track Status
                    </button>
                 </div>
              </div>
           </section>

           <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">Notifications</h2>
              <div className="space-y-6">
                 {[1, 2].map(i => (
                    <div key={i} className="flex gap-4 group cursor-pointer">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0 animate-pulse"></div>
                        <div>
                            <p className="text-sm font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">Service completed for Ford Raptor</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">2 hours ago</p>
                        </div>
                    </div>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;