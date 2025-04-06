import React from 'react';
import { AlertCircle, Database, Wifi, FileWarning, Clock } from 'lucide-react';

const RecentIssues = () => {
  const issues = [
    {
      id: 1,
      title: 'High CPU Utilization',
      description: 'Chrome browser consistently using >80% CPU resources',
      type: 'Performance',
      severity: 'Medium',
      time: '10 minutes ago',
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />
    },
    {
      id: 2,
      title: 'Database Connection Failure',
      description: 'Local DB service unable to connect after system update',
      type: 'Service',
      severity: 'High',
      time: '1 hour ago',
      icon: <Database className="h-5 w-5 text-red-500" />
    },
    {
      id: 3,
      title: 'Network Connectivity Issues',
      description: 'Intermittent Wi-Fi disconnections detected',
      type: 'Network',
      severity: 'Low',
      time: '3 hours ago',
      icon: <Wifi className="h-5 w-5 text-blue-500" />
    },
   
  ];

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-amber-100 text-amber-800';
      case 'Low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="font-medium text-gray-800">Recent Issues</h2>
      </div>
      <div className="overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {issues.map((issue) => (
            <li key={issue.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">{issue.icon}</div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{issue.title}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityBadge(issue.severity)}`}>
                      {issue.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{issue.description}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <span className="inline-block px-2 py-0.5 rounded bg-gray-100 mr-2">{issue.type}</span>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{issue.time}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentIssues;