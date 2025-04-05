import React from 'react';
import { Shield, Zap, HardDrive, RefreshCw, Cpu } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    { name: 'Quick System Scan', icon: <Shield className="h-5 w-5" />, color: 'text-blue-600 bg-blue-100' },
    { name: 'Optimize Performance', icon: <Zap className="h-5 w-5" />, color: 'text-amber-600 bg-amber-100' },
    { name: 'Clear Temp Files', icon: <HardDrive className="h-5 w-5" />, color: 'text-green-600 bg-green-100' },
    { name: 'Update Drivers', icon: <RefreshCw className="h-5 w-5" />, color: 'text-purple-600 bg-purple-100' },
    { name: 'CPU Diagnostic', icon: <Cpu className="h-5 w-5" />, color: 'text-rose-600 bg-rose-100' }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="font-medium text-gray-800">Quick Actions</h2>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {actions.map((action, index) => (
            <button 
              key={index}
              className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className={`p-2 rounded-full mr-3 ${action.color}`}>
                {action.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">{action.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;