import React, { useEffect, useState } from "react";
import { getUserVehicles } from "../services/vehicleService";
import { getUserAppointments } from "../services/appointmentService";
import { getUserInvoices } from "../services/invoiceService";
import { Link } from "react-router-dom";
import { Car } from "lucide-react";

const CustomerDashboard = () => {
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
    return <div className="main-content">Loading your dashboard...</div>;
  }

  return (
    <div className="main-content">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Welcome Back!</h1>
        <p className="text-muted">Here's what's happening with your vehicles today.</p>
      </header>

      <div className="layout-grid mb-10">
        <div className="glass-card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.vehicles}</h3>
          <p className="text-muted uppercase text-xs font-semibold tracking-wider">My Vehicles</p>
        </div>

        <div className="glass-card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.appointments}</h3>
          <p className="text-muted uppercase text-xs font-semibold tracking-wider">Scheduled Services</p>
        </div>

        <div className="glass-card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.pendingInvoices}</h3>
          <p className="text-muted uppercase text-xs font-semibold tracking-wider">Pending Payments</p>
        </div>
      </div>

      <div className="layout-grid">
        <div className="glass-card p-8 col-span-2">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <Link to="/customer/appointments" className="btn-primary no-underline text-center">Book Service</Link>
            <Link to="/customer/vehicles" className="btn-secondary no-underline text-center">My Vehicles</Link>
            <Link to="/customer/history" className="btn-secondary no-underline text-center">Service History</Link>
            <Link to="/customer/invoices" className="btn-secondary no-underline text-center">Pay Invoices</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;