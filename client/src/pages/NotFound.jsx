import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-6xl font-extrabold text-blue-600 mb-4 animate-bounce">404</h1>
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-slate-600 mb-8 max-w-md">Sorry, we couldn't find the page you're looking for. Check the URL or return to safety.</p>
      <a href="/" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-transform">
        Back to Home
      </a>
    </div>
  );
};

export default NotFound;