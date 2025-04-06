import React, { useState } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, Lock, Activity, Zap, Bell, Search, TrendingUp, Calendar, Clock, ChevronRight, ArrowRight, RefreshCw } from 'lucide-react';
import Header from '../component/layout/Header';
import Sidebar from '../component/layout/Sidebar';
import MalwareProtection from '../component/security/MalwareProtection';
import SecurityAlerts from '../component/security/SecurityAlerts';
import VulnerabilityScanner from '../component/security/VulnerabilityScanner';

const Security = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Mock data for security overview
  const securityData = {
    score: 78,
    previousScore: 72,
    lastScanDate: 'April 6, 2025',
    lastScanTime: '10:45 AM',
    threatsStopped: 24,
    vulnerabilitiesFixed: 8,
    vulnerabilitiesOpen: 7,
    systemStatus: 'protected'
  };

  // Security tips
  const securityTips = [
    "Enable multi-factor authentication for all administrator accounts",
    "Keep all software and operating systems updated regularly",
    "Use strong, unique passwords for each service"
  ];

  // Security timeline events
  const timelineEvents = [
    { time: '10:45 AM', date: 'April 6, 2025', event: 'Full system scan completed', type: 'info' },
    { time: '09:30 AM', date: 'April 6, 2025', event: 'Definition updates installed', type: 'success' },
    { time: '3:15 PM', date: 'April 5, 2025', event: 'Suspicious login attempt blocked', type: 'warning' }
  ];

  const refreshDashboard = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const renderDashboard = () => (
    <>
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Security Score</p>
              <div className="flex items-end">
                <p className="text-2xl font-bold text-green-600">{securityData.score}</p>
                <p className="text-sm text-gray-600 ml-1">/100</p>
              </div>
              <div className="flex items-center mt-1 text-xs">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500">+{securityData.score - securityData.previousScore} from last scan</span>
              </div>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${securityData.score}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">System Status</p>
              <p className="text-2xl font-bold text-green-600">Protected</p>
              <p className="text-xs text-gray-500 mt-1">Last scan: {securityData.lastScanDate}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-3 text-xs text-gray-600">
            <Activity className="h-3 w-3 mr-1" />
            <span>All security features are active</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Threats Stopped</p>
              <p className="text-2xl font-bold text-blue-600">{securityData.threatsStopped}</p>
              <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-3 text-xs text-blue-600">
            <Shield className="h-3 w-3 mr-1" />
            <span>Real-time protection active</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Vulnerabilities</p>
              <div className="flex items-center gap-2">
                <div className="flex items-end">
                  <p className="text-2xl font-bold text-amber-600">{securityData.vulnerabilitiesOpen}</p>
                  <p className="text-xs text-gray-600 ml-1">open</p>
                </div>
                <div className="bg-gray-200 w-px h-6"></div>
                <div className="flex items-end">
                  <p className="text-lg font-medium text-green-600">{securityData.vulnerabilitiesFixed}</p>
                  <p className="text-xs text-gray-600 ml-1">fixed</p>
                </div>
              </div>
            </div>
            <div className="bg-amber-100 p-2 rounded-full">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center mt-3 text-xs text-amber-600">
            <Clock className="h-3 w-3 mr-1" />
            <span>{securityData.vulnerabilitiesOpen} issues need attention</span>
          </div>
        </div>
      </div>

      {/* Timeline and Tips Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Security Timeline */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-gray-700 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">Security Timeline</h2>
              </div>
              <button 
                onClick={refreshDashboard}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="relative">
              <div className="absolute h-full left-4 w-0.5 bg-gray-200"></div>
              <div className="space-y-5 pl-10 relative">
                {timelineEvents.map((event, index) => (
                  <div key={index} className="relative">
                    <div className={`absolute -left-8 w-4 h-4 rounded-full ${
                      event.type === 'warning' ? 'bg-amber-500' : 
                      event.type === 'success' ? 'bg-green-500' : 
                      'bg-blue-500'
                    } border-2 border-white`}></div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.time}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{event.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 text-right">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center ml-auto">
                View full history
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center">
              <Lock className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Security Tips</h2>
            </div>
          </div>
          <div className="p-4">
            <ul className="space-y-4">
              {securityTips.map((tip, index) => (
                <li key={index} className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">{tip}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 bg-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Security recommendation</h3>
                  <p className="text-xs text-blue-700 mt-1">
                    Consider running a full system scan today to ensure complete protection against emerging threats.
                  </p>
                  <button className="mt-2 inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800">
                    Run full scan now
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Components Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MalwareProtection />
        <SecurityAlerts />
      </div>

      {/* Vulnerability Scanner */}
      <div className="mb-6">
        <VulnerabilityScanner />
      </div>
    </>
  );

  const renderProtection = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <MalwareProtection />
    </div>
  );

  const renderAlerts = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <SecurityAlerts />
    </div>
  );

  const renderVulnerabilities = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <VulnerabilityScanner />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={true} />
      <div className="flex flex-col flex-1 overflow-hidden">
       <Header /> 
       <div>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Security Center</h1>
            <p className="text-sm text-gray-600">Monitor and manage your system security</p>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-3 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('protection')}
                className={`py-3 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'protection'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Malware Protection
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`py-3 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'alerts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Alerts
              </button>
              <button
                onClick={() => setActiveTab('vulnerabilities')}
                className={`py-3 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'vulnerabilities'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Vulnerabilities
              </button>
            </nav>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'protection' && renderProtection()}
          {activeTab === 'alerts' && renderAlerts()}
          {activeTab === 'vulnerabilities' && renderVulnerabilities()}
        </main>
        </div>
      </div>
    </div>
  );
};

export default Security;