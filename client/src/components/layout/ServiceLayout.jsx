import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ServiceSidebar from './ServiceSidebar';
import Navbar from './Navbar';

const ServiceLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <ServiceSidebar collapsed={!sidebarOpen} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ServiceLayout;
