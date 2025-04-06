import React, { useState } from 'react';
import { 
  Shield, Zap, Trash2, Database, Wifi, 
  Download, RotateCw, CheckCircle, Clock, Save
} from 'lucide-react';

const QuickActions = () => {
  const [actionInProgress, setActionInProgress] = useState(null);
  const [completedActions, setCompletedActions] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateAction = (actionId) => {
    if (actionInProgress) return;
    
    setActionInProgress(actionId);
    setShowProgress(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 15) + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCompletedActions(prev => [...prev, actionId]);
            setActionInProgress(null);
            setShowProgress(false);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const actions = [
    { id: 1, name: 'Quick System Scan', icon: <Shield />, color: 'blue' },
    { id: 2, name: 'Optimize Performance', icon: <Zap />, color: 'amber' },
    { id: 3, name: 'Clear Temp Files', icon: <Trash2 />, color: 'green' },
    { id: 4, name: 'Database Repair', icon: <Database />, color: 'red' },
    { id: 5, name: 'Network Diagnostics', icon: <Wifi />, color: 'purple' },
    { id: 6, name: 'Update Drivers', icon: <Download />, color: 'teal' },
    { id: 7, name: 'Check for Updates', icon: <RotateCw />, color: 'indigo' },
    { id: 8, name: 'System Backup', icon: <Save />, color: 'pink' }
  ];

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800">Quick Actions</h2>
        {completedActions.length > 0 && (
          <span className="text-xs text-gray-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {completedActions.length} completed
          </span>
        )}
      </div>
      
      {showProgress && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Processing {actions.find(a => a.id === actionInProgress)?.name}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {actions.map(action => (
          <button 
            key={action.id}
            className={`flex items-center w-full p-3 text-left rounded-lg transition-colors ${
              completedActions.includes(action.id) 
                ? 'bg-gray-50 border border-gray-100'
                : actionInProgress === action.id
                ? `bg-${action.color}-100 border border-${action.color}-200`
                : `bg-${action.color}-50 hover:bg-${action.color}-100`
            }`}
            onClick={() => simulateAction(action.id)}
            disabled={actionInProgress !== null}
          >
            <div className={`bg-${action.color}-100 p-2 rounded-full`}>
              <div className={`h-5 w-5 text-${action.color}-600 ${
                actionInProgress === action.id ? 'animate-pulse' : ''
              }`}>
                {completedActions.includes(action.id) ? <CheckCircle /> : action.icon}
              </div>
            </div>
            <span className={`ml-3 ${
              completedActions.includes(action.id) ? 'text-gray-500' : 'text-gray-700'
            }`}>
              {action.name}
              {completedActions.includes(action.id) && (
                <span className="text-xs text-green-600 ml-2">Completed</span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;










