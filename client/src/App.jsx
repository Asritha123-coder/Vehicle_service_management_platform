import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import CustomerLayout from './components/layout/CustomerLayout';
import ServiceLayout from './components/layout/ServiceLayout';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';

// Customer Pages
import CustomerDashboard from './pages/CustomerDashboard';
import MyVehicles from './pages/MyVehicles';
import AddVehicle from './pages/AddVehicle';
import BookService from './pages/BookService';
import ServiceHistory from './pages/ServiceHistory';
import TrackService from './pages/TrackService';
import Payments from './pages/Payments';
import Checkout from './pages/Checkout';
import CustomerInvoices from './pages/CustomerInvoices';

// Technician Pages
import TechnicianDashboard from './pages/TechnicianDashboard';
import TechnicianHistory from './pages/TechnicianHistory';
import TechnicianProfile from './pages/TechnicianProfile';

// Admin / Staff Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminAppointments from './pages/AdminAppointments';
import AdminInvoices from './pages/AdminInvoices';
import ServiceCenterDashboard from './pages/ServiceCenterDashboard';
import AddUser from './pages/AddUser';

// Shared Feature Pages
import InvoiceDetails from './pages/InvoiceDetails';
import PaymentSimulation from './pages/PaymentSimulation';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/book-service" element={<ProtectedRoute allowedRoles={['customer']}><BookService /></ProtectedRoute>} />
      <Route path="/" element={<HomePage />} />

      {/* Shared Protected Routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/invoices/:invoiceId" element={<ProtectedRoute><InvoiceDetails /></ProtectedRoute>} />
          <Route path="/pay/:invoiceId" element={<ProtectedRoute><PaymentSimulation /></ProtectedRoute>} />
          
          {/* Staff/Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'service_center']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/appointments" element={<ProtectedRoute allowedRoles={['admin', 'service_center']}><AdminAppointments /></ProtectedRoute>} />
          <Route path="/admin/invoices" element={<ProtectedRoute allowedRoles={['admin', 'service_center']}><AdminInvoices /></ProtectedRoute>} />
          <Route path="/service-center" element={<ProtectedRoute allowedRoles={['service_center']}><ServiceCenterDashboard /></ProtectedRoute>} />
          <Route  path="/admin/add-user" element={<ProtectedRoute allowedRoles={['admin']}><AddUser /></ProtectedRoute> } />
      </Route>

      {/* Customer Layout Routes */}
      <Route element={<ProtectedRoute allowedRoles={['customer']}><CustomerLayout /></ProtectedRoute>}>
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/vehicles" element={<MyVehicles />} />
        <Route path="/customer/vehicles/add" element={<AddVehicle />} />
        <Route path="/customer/appointments" element={<BookService />} />
        <Route path="/customer/history" element={<ServiceHistory />} />
        <Route path="/customer/track" element={<TrackService />} />
        <Route path="/customer/invoices" element={<CustomerInvoices />} />
        <Route path="/customer/checkout/:id" element={<Checkout />} />
      </Route>

      {/* Technician/Service Layout Routes */}
      <Route element={<ProtectedRoute allowedRoles={['technician']}><ServiceLayout /></ProtectedRoute>}>
        <Route path="/technician" element={<TechnicianDashboard />} />
        <Route path="/technician/active" element={<TechnicianDashboard filter="IN_PROGRESS" />} />
        <Route path="/technician/history" element={<TechnicianHistory />} />
        <Route path="/technician/profile" element={<TechnicianProfile />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;