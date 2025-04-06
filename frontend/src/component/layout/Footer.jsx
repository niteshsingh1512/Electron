import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-3 px-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Electron - System Health Monitor
        </div>
        <div className="flex space-x-4 text-sm text-gray-500">
          <a href="#" className="hover:text-gray-700">Privacy Policy</a>
          <a href="#" className="hover:text-gray-700">Terms of Service</a>
          <a href="#" className="hover:text-gray-700">Documentation</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;