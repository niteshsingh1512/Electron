import React from 'react';
import Header from '../component/layout/Header';
import Sidebar from '../component/layout/Sidebar';
import Footer from '../component/layout/Footer';
import MalwareProtection from '../component/security/MalwareProtection';
import SecurityAlerts from '../component/security/SecurityAlerts';
import VulnerabilityScanner from '../component/security/VulnerabilityScanner';

const Security = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content with Sidebar and Page Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <div className="flex-1 p-6 max-w-full ml-64"> {/* Adjusted margin-left to account for sidebar width */}
          <h1 className="text-2xl font-bold mb-6 text-green-500">Security Dashboard</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Malware Protection Section */}
            <div className="col-span-1">
              <MalwareProtection />
            </div>
            
            {/* Security Alerts Section */}
            <div className="col-span-1">
              <SecurityAlerts />
            </div>
            
            {/* Vulnerability Scanner - Full Width */}
            <div className="col-span-1 lg:col-span-2">
              <VulnerabilityScanner />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Security;