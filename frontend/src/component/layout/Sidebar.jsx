import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  AlertCircle,
  Shield,
  MonitorSmartphone,
  Cpu,
  Activity,
  Terminal,
  HelpCircle
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Navigation items with path information
  const navItems = [
    { name: 'Dashboard', icon: <Home className="h-5 w-5" />, path: '/dashboard' },
    { name: 'Diagnostics', icon: <AlertCircle className="h-5 w-5" />, path: '/diagnostics' },
    { name: 'Security', icon: <Shield className="h-5 w-5" />, path: '/security' },
  ];

  // System monitoring items with path information
  const monitoringItems = [
    { name: 'System Performance', icon: <MonitorSmartphone className="h-5 w-5" />, path: '/monitoring/system-performance' },
    { name: 'Digital Wellbeing', icon: <Cpu className="h-5 w-5" />, path: '/monitoring/digital-wellbeing' },
    { name: 'AI Help', icon: <Activity className="h-5 w-5" />, path: '/monitoring/process-monitor' },
    { name: 'Updates', icon: <Terminal className="h-5 w-5" />, path: '/monitoring/command-center' }
  ];

  // Helper function to check if a path is active (including child routes)
  const isPathActive = (path, currentPath) => {
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    <aside className={`bg-white border-r border-gray-200 text-gray-800 shadow-sm transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'} flex flex-col h-screen`}>
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center">
          <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-white" />
          </div>
          {isOpen && <span className="ml-2 text-xl font-semibold text-gray-800">Electron</span>}
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 pb-2">
          {isOpen && <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Navigation</h2>}
        </div>
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm ${isPathActive(item.path, currentPath)
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                  } rounded-lg mx-2`}
              >
                <div className={`flex-shrink-0 ${isPathActive(item.path, currentPath) ? 'text-blue-500' : 'text-gray-500'}`}>
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
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Monitoring</h2>
            </div>
            <ul className="space-y-1">
              {monitoringItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm ${isPathActive(item.path, currentPath)
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                      } rounded-lg mx-2`}
                  >
                    <div className={`flex-shrink-0 ${isPathActive(item.path, currentPath) ? 'text-blue-500' : 'text-gray-500'}`}>
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
        <div className="p-4 border-t border-gray-200">
          <Link to="/help" className="flex items-center text-sm text-gray-600 hover:text-blue-500">
            <HelpCircle className="h-5 w-5 mr-3 text-gray-500" />
            <span>Help & Support</span>
          </Link>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;