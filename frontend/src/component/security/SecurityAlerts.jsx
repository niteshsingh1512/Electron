import React, { useState } from 'react';
import { Bell, ExternalLink, Shield, AlertTriangle, Info, Check, X, Filter, RefreshCw, MoreHorizontal, Clock } from 'lucide-react';

const SecurityAlerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Outdated browser version detected',
      description: 'Update your browser to the latest version to patch critical vulnerabilities.',
      time: '2 hours ago',
      dismissed: false,
      priority: 'medium'
    },
    {
      id: 2,
      type: 'info',
      title: 'Database backup completed',
      description: 'Weekly database backup was successfully completed.',
      time: '5 hours ago',
      dismissed: false,
      priority: 'low'
    },
    {
      id: 3,
      type: 'critical',
      title: 'Multiple login attempts',
      description: 'Multiple failed login attempts from IP 192.168.1.45.',
      time: '1 day ago',
      dismissed: false,
      priority: 'high'
    },
    {
      id: 4,
      type: 'warning',
      title: 'SSL certificate expiring soon',
      description: 'Your SSL certificate will expire in 14 days. Renew to avoid security warnings.',
      time: '2 days ago',
      dismissed: false,
      priority: 'medium'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);

  const dismissAlert = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? {...alert, dismissed: true} : alert
    ));
  };

  const restoreAllAlerts = () => {
    setAlerts(alerts.map(alert => ({...alert, dismissed: false})));
  };

  const dismissAllAlerts = () => {
    setAlerts(alerts.map(alert => ({...alert, dismissed: true})));
  };

  const refreshAlerts = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return !alert.dismissed;
    if (filter === 'dismissed') return alert.dismissed;
    if (filter === 'critical') return alert.type === 'critical' && !alert.dismissed;
    if (filter === 'warning') return alert.type === 'warning' && !alert.dismissed;
    if (filter === 'info') return alert.type === 'info' && !alert.dismissed;
    return !alert.dismissed;
  });

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

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">High</span>;
      case 'medium':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">Medium</span>;
      case 'low':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Low</span>;
      default:
        return null;
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
          <div className="flex items-center space-x-2">
            {activeAlerts.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {activeAlerts.length}
              </span>
            )}
            <button 
              onClick={refreshAlerts} 
              className="text-gray-400 hover:text-gray-600"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select 
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Alerts</option>
              <option value="critical">Critical Only</option>
              <option value="warning">Warnings Only</option>
              <option value="info">Info Only</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)} 
              className="text-gray-400 hover:text-gray-600"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <button 
                  onClick={() => { dismissAllAlerts(); setShowDropdown(false); }}
                  className="w-full block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Dismiss All Alerts
                </button>
                <button 
                  onClick={() => { restoreAllAlerts(); setShowDropdown(false); }}
                  className="w-full block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Restore All Alerts
                </button>
              </div>
            )}
          </div>
        </div>
        
        {filteredAlerts.length > 0 ? (
          <div className="space-y-3 overflow-y-auto max-h-[420px] pb-1">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className={`bg-white rounded-lg shadow-sm border ${getAlertBorderColor(alert.type)} p-3`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-medium text-gray-800">{alert.title}</h3>
                      <div className="flex space-x-2 items-center">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {alert.time}
                        </span>
                        <button 
                          onClick={() => dismissAlert(alert.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">{alert.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      {getPriorityBadge(alert.priority)}
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
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-green-100 p-3 rounded-full mb-3">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-800 mb-1">All Clear</h3>
            <p className="text-xs text-gray-500">No security alerts at this time</p>
            {filter === 'dismissed' && alerts.some(a => a.dismissed) && (
              <button 
                onClick={restoreAllAlerts}
                className="mt-3 text-xs text-blue-600 hover:text-blue-800"
              >
                Restore dismissed alerts
              </button>
            )}
          </div>
        )}
        
        <div className="mt-4 border-t border-gray-100 pt-3">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                <span className="text-xs text-gray-500">Critical: {alerts.filter(a => a.type === 'critical' && !a.dismissed).length}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-amber-500 mr-1"></div>
                <span className="text-xs text-gray-500">Warning: {alerts.filter(a => a.type === 'warning' && !a.dismissed).length}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                <span className="text-xs text-gray-500">Info: {alerts.filter(a => a.type === 'info' && !a.dismissed).length}</span>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View history
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAlerts;