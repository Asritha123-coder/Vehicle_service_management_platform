import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Wrench,
  Smartphone,
  Bell,
  History,
  ChevronRight,
  Star,
  ArrowRight,
  LogIn,
  UserPlus,
  Zap,
  Clock,
  Truck,
  FileText,
  Calendar,
  CheckCircle,
  Award,
  Users
} from 'lucide-react';
import HeroImage from '../assets/hero_illustration.png';

// Custom hook for sophisticated scroll reveal
const useScrollReveal = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    const { current } = domRef;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [delay]);

  return [domRef, isVisible];
};

const FadeUpSection = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useScrollReveal(delay);
  return (
    <div
      ref={ref}
      className={`${isVisible ? "animate-spring-up" : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    { title: "Rapid Booking", desc: "Service scheduled in seconds, direct from your phone.", icon: <Zap /> },
    { title: "Live Tracking", desc: "Watch our progress as we take care of your vehicle.", icon: <Smartphone /> },
    { title: "Smart Alerts", desc: "Instant updates on your service milestones.", icon: <Bell /> },
    { title: "Service History", desc: "Complete digital records for all maintenance.", icon: <History /> },
    { title: "Expert Care", desc: "Certified technicians for every make and model.", icon: <Award /> },
    { title: "Fast Turnaround", desc: "Optimized workflows to get you moving again.", icon: <Clock /> },
  ];

  const steps = [
    { id: '01', title: "Register", desc: "Create your digital profile", icon: <UserPlus /> },
    { id: '02', title: "Add Vehicle", desc: "Populate your virtual garage", icon: <Truck /> },
    { id: '03', title: "Book Service", desc: "Choose date and service type", icon: <Calendar /> },
    { id: '04', title: "Track Progress", desc: "Real-time ServiceHub updates", icon: <Smartphone /> },
    { id: '05', title: "Get Invoice", desc: "Digital billing and payments", icon: <FileText /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faff] to-[#f4f7ff] flex flex-col font-sans selection:bg-blue-200 overflow-x-hidden text-gray-800">

      {/* Background Blobs for Depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[100px] animate-blob delay-500"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="bg-blue-600 p-2.5 rounded-2xl group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-blue-200">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">Service<span className="text-blue-600">Hub</span></span>
            </div>

            <div className="hidden md:flex items-center space-x-12 text-gray-600 font-bold text-sm tracking-wide">
              <Link to="/" className="text-blue-600 nav-hover-underline uppercase">Home</Link>
              <a href="#services" className="hover:text-blue-600 transition-colors nav-hover-underline uppercase">Services</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors nav-hover-underline uppercase">Workflow</a>
              <a href="#contact" className="hover:text-blue-600 transition-colors nav-hover-underline uppercase">Contact</a>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="hidden sm:flex items-center gap-2 text-sm font-black text-slate-700 hover:text-blue-600 transition-colors px-4 py-2">
                LOGIN
              </Link>
              <Link to="/register" className="flex items-center gap-2 bg-blue-600 hover:bg-black text-white px-8 py-3 rounded-2xl text-sm font-black transition-all shadow-xl shadow-blue-200 active:scale-95">
                JOIN NOW
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-24 lg:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div className="space-y-12 animate-spring-up">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-gray-100 text-blue-600 text-xs font-black tracking-widest uppercase">
                  <CheckCircle className="w-4 h-4" /> Next-Gen ServiceHub Tech
                </div>
                <h1 className="text-6xl md:text-7xl xl:text-8xl font-black text-slate-900 leading-[0.95] tracking-[ -0.05em]">
                  Total Control. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Total Care.</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-xl font-medium leading-relaxed">
                  The most powerful digital platform for modern ServiceHub centers.
                  Booking, real-time tracking, and billing—reimagined.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <button
                  onClick={() => navigate('/book-service')}
                  className="shimmer-btn flex items-center justify-center gap-3 bg-blue-600 hover:bg-black text-white px-12 py-6 rounded-[2rem] font-black text-xl transition-all shadow-2xl shadow-blue-200 active:scale-95 group"
                >
                  Book Service
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-slate-900 border-2 border-gray-100 px-12 py-6 rounded-[2rem] font-black text-xl transition-all shadow-xl active:scale-95"
                >
                  Learn More
                </button>
              </div>

              <div className="flex items-center gap-12 pt-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-slate-900 leading-none">5k+</span>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-2">Active Users</span>
                </div>
                <div className="w-[1px] h-12 bg-gray-200"></div>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <img key={i} className="w-10 h-10 rounded-full border-2 border-white" src={`https://i.pravatar.cc/100?img=${i + 40}`} alt="" />
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex text-yellow-500">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-1">4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative animate-spring-in delay-200">
              <div className="absolute -inset-10 bg-blue-400/20 rounded-full blur-[100px] z-0 opacity-50"></div>
              <div className="relative z-10 animate-float-deep">
                <div className="bg-white p-3 rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 cursor-pointer overflow-hidden border border-gray-100">
                  <img src={HeroImage} alt="Vehicle Care" className="w-full rounded-[2.5rem] transform hover:scale-110 transition-transform duration-1000" />
                </div>

                {/* Floating Micro-UI element */}
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-50 flex items-center gap-4 animate-spring-up delay-700">
                  <div className="bg-green-100 p-3 rounded-2xl text-green-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-900">200+</p>
                    <p className="text-xs font-bold text-slate-600 uppercase">Shops Live</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-white relative z-10 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeUpSection className="text-center space-y-4 mb-20">
            <h2 className="text-blue-600 font-black uppercase tracking-[0.3em] text-sm">Professional Edge</h2>
            <h3 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">Core Capabilities</h3>
          </FadeUpSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <FadeUpSection key={i} delay={i * 100} className="group">
                <div className="p-10 bg-[#f8faff] rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:bg-white hover:-translate-y-4 transition-all duration-500 cursor-pointer">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-md group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 transform group-hover:rotate-6">
                    {React.cloneElement(f.icon, { className: "w-8 h-8" })}
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{f.title}</h4>
                  <p className="text-gray-500 font-medium leading-relaxed">{f.desc}</p>
                </div>
              </FadeUpSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-[#f4f7ff] border-y border-gray-100 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeUpSection className="text-center space-y-4 mb-24">
            <h2 className="text-blue-600 font-black uppercase tracking-[0.3em] text-sm">Operation Flow</h2>
            <h3 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">How It Works</h3>
          </FadeUpSection>

          <div className="grid lg:grid-cols-5 gap-12 relative">
            <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-1 bg-blue-200/50 rounded-full"></div>

            {steps.map((s, i) => (
              <FadeUpSection key={i} delay={i * 150} className="relative flex flex-col items-center text-center group">
                <div className="relative z-10 w-20 h-20 bg-white border-4 border-[#f4f7ff] rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 group-hover:shadow-blue-200">
                  <div className="text-blue-600">
                    {React.cloneElement(s.icon, { className: "w-8 h-8" })}
                  </div>
                </div>
                <div className="mt-8 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full mb-4">
                  STEP {s.id}
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tighter">{s.title}</h4>
                <p className="text-sm font-bold text-slate-600 leading-tight px-2">{s.desc}</p>
              </FadeUpSection>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified Modern Footer */}
      <footer id="contact" className="bg-white pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16 mb-24">
            <div className="space-y-6 max-w-sm">
              <div className="flex items-center gap-2.5">
                <div className="bg-slate-900 p-2 rounded-xl">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-black text-slate-900">VehicleService</span>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                Elevating the ServiceHub experience through precision technology and user-centric design.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 font-black text-sm uppercase tracking-[0.1em]">
              <div className="space-y-6">
                <p className="text-slate-900">Platform</p>
                <div className="flex flex-col gap-4 text-slate-600">
                  <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
                  <a href="#how-it-works" className="hover:text-blue-600 transition-colors">Workflow</a>
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-slate-900">Support</p>
                <div className="flex flex-col gap-4 text-slate-600">
                  <Link to="/login" className="hover:text-blue-600 transition-colors">Login</Link>
                  <Link to="/register" className="hover:text-blue-600 transition-colors">Register</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-600 font-bold text-[10px] tracking-[0.3em] uppercase">
              &copy; {new Date().getFullYear()} VehicleService Platform | All Rights Reserved
            </p>
            <div className="flex gap-10 text-[10px] font-black text-slate-600 uppercase tracking-widest">
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Status</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
