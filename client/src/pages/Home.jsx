import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else {
        const role = user.role?.toLowerCase();
        if (role === 'customer') {
          navigate('/customer');
        } else if (role === 'technician') {
          navigate('/technician');
        } else if (role === 'admin' || role === 'staff') {
          navigate('/admin');
        } else {
           navigate('/login');
        }
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Home;