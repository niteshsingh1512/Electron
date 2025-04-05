import React, { useState } from 'react';
import { Bell, ExternalLink, Shield, AlertTriangle, Info, Check, X } from 'lucide-react';

const SecurityAlerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Outdated browser version detected',
      description: 'Update your browser to the latest version to patch critical vulnerabilities.',
      time: '2 hours ago',
      dismissed: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Database backup completed',
      description: 'Weekly database backup was successfully completed.',
      time: '5 hours ago',
      dismissed: false
    },
    {
      id: 3,
      type: 'critical',
      title: 'Multiple login attempts',
      description: 'Multiple failed login attempts from IP 192.168.1.45.',
      time: '1 day ago',
      dismissed: false
    }
  ]);

  const dismissAlert = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? {...alert, dismissed: true} : alert
    ));
  };

  const activeAlerts = alerts.filter(alert => !alert.dismissed);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'critical':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertBorderColor = (type) => {
    switch (type) {
      case 'warning':
        return 'border-l-4 border-l-amber-500';
      case 'critical':
        return 'border-l-4 border-l-red-500';
      case 'info':
        return 'border-l-4 border-l-blue-500';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 h-full">
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="w-6 h-6 text-amber-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Security Alerts</h2>
          </div>
          {activeAlerts.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {activeAlerts.length}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        {activeAlerts.length > 0 ? (
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <div key={alert.id} className={`bg-white rounded-lg shadow-sm border ${getAlertBorderColor(alert.type)} p-3`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-medium text-gray-800">{alert.title}</h3>
                      <div className="flex space-x-2 items-center">
                        <span className="text-xs text-gray-500">{alert.time}</span>
                        <button 
                          onClick={() => dismissAlert(alert.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">{alert.description}</p>
                    <div className="mt-2 flex justify-end">
                      <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                        View details
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="bg-green-100 p-3 rounded-full mb-3">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-800 mb-1">All Clear</h3>
            <p className="text-xs text-gray-500">No security alerts at this time</p>
          </div>
        )}
        
        <div className="mt-4 flex justify-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View alert history
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityAlerts;