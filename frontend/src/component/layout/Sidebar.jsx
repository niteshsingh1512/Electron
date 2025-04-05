import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  AlertCircle,
  BarChart2,
  Shield,
  Settings,
  HelpCircle,
  MonitorSmartphone,
  Database,
  Cpu,
  Activity,
  Network,
  Terminal
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Navigation items with path information
  const navItems = [
    { name: 'Dashboard', icon: <Home className="h-5 w-5" />, path: '/dashboard' },
    { name: 'Diagnostics', icon: <AlertCircle className="h-5 w-5" />, path: '/diagnostics' },
    { name: 'Security', icon: <Shield className="h-5 w-5" />, path: '/security' },
    // { name: 'Reports', icon: <BarChart2 className="h-5 w-5" />, path: '/reports' },
    // { name: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/settings' }
  ];
  
  // System monitoring items with path information
  const monitoringItems = [
    { name: 'System Performance', icon: <MonitorSmartphone className="h-5 w-5" />, path: '/monitoring/system-performance' },
    { name: 'CPU & Memory', icon: <Database className="h-5 w-5" />, path: '/monitoring/database-health' },
    // { name: 'CPU & Memory', icon: <Cpu className="h-5 w-5" />, path: '/monitoring/cpu-memory' },
    { name: 'Network Traffic', icon: <Network className="h-5 w-5" />, path: '/monitoring/network-traffic' },
    { name: 'AI Help', icon: <Activity className="h-5 w-5" />, path: '/monitoring/process-monitor' },
    { name: 'Updates', icon: <Terminal className="h-5 w-5" />, path: '/monitoring/command-center' }
  ];

  return (
    <aside className={`bg-gray-800 text-white transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'} flex flex-col`}>
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <Link to="/dashboard" className="flex items-center">
          <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-white" />
          </div>
          {isOpen && <span className="ml-2 text-xl font-semibold">DiagnosticAI</span>}
        </Link>
      </div>
      
      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 pb-2">
          {isOpen && <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Main Navigation</h2>}
        </div>
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm ${
                  currentPath.startsWith(item.path) 
                    ? 'bg-gray-900 text-blue-400' 
                    : 'text-gray-300 hover:bg-gray-700'
                } rounded-lg mx-2`}
              >
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                {isOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
        
        {isOpen && (
          <>
            <div className="px-4 pt-6 pb-2">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Monitoring</h2>
            </div>
            <ul className="space-y-1">
              {monitoringItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm ${
                      currentPath === item.path 
                        ? 'bg-gray-900 text-blue-400' 
                        : 'text-gray-300 hover:bg-gray-700'
                    } rounded-lg mx-2`}
                  >
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>
      
      {/* Help and Support */}
      {isOpen && (
        <div className="p-4 border-t border-gray-700">
          <Link to="/help" className="flex items-center text-sm text-gray-300 hover:text-white">
            <HelpCircle className="h-5 w-5 mr-3" />
            <span>Help & Support</span>
          </Link>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;