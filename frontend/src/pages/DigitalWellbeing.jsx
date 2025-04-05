import React, { useState } from 'react';

// Import layout components
import Header from '../component/layout/Header';
import Sidebar from '../component/layout/Sidebar';

const DigitalWellbeing = () => {
  // Sample data for all processes (both apps and tabs)
  const [processes, setProcesses] = useState([
    { id: 1, name: 'Google Chrome (34)', icon: 'G', type: 'browser', status: 'active', cpu: '2.4%', memory: '1,221.7 MB', disk: '1.0 MB/s' },
    { id: 2, name: 'Sidebar.jsx - Electron', icon: 'E', type: 'tab', status: 'active', cpu: '0%', memory: '322.4 MB', disk: '0.2 MB/s' },
    { id: 3, name: 'Visual Studio Code', icon: 'VS', type: 'application', status: 'active', cpu: '1.8%', memory: '842.3 MB', disk: '0.5 MB/s' },
    { id: 4, name: 'Spotify', icon: 'S', type: 'application', status: 'active', cpu: '0.7%', memory: '324.5 MB', disk: '0.1 MB/s' },
    { id: 5, name: 'Dashboard.jsx - Chrome', icon: 'C', type: 'tab', status: 'active', cpu: '0.5%', memory: '125.8 MB', disk: '0.1 MB/s' },
    { id: 6, name: 'Terminal', icon: 'T', type: 'application', status: 'active', cpu: '0.3%', memory: '156.2 MB', disk: '0.1 MB/s' },
    { id: 7, name: 'Slack', icon: 'S', type: 'application', status: 'active', cpu: '1.2%', memory: '512.8 MB', disk: '0.3 MB/s' },
    { id: 8, name: 'YouTube - Chrome', icon: 'Y', type: 'tab', status: 'active', cpu: '1.9%', memory: '287.4 MB', disk: '0.4 MB/s' }
  ]);

  // Enhanced time spent data with categories and wellness scores
  const [timeSpent, setTimeSpent] = useState([
    { 
      id: 1, 
      name: 'Google Chrome', 
      icon: 'chrome', 
      time: '2 hr, 15 mins', 
      timeMinutes: 135,
      color: 'bg-blue-500',
      category: 'Browsing',
      wellnessImpact: 'medium',
      usagePattern: 'Scattered throughout day'
    },
    { 
      id: 2, 
      name: 'Visual Studio Code', 
      icon: 'vscode', 
      time: '1 hr, 45 mins', 
      timeMinutes: 105,
      color: 'bg-blue-600', 
      category: 'Productivity',
      wellnessImpact: 'positive',
      usagePattern: 'Focused sessions'
    },
    { 
      id: 3, 
      name: 'Slack', 
      icon: 'slack', 
      time: '42 mins', 
      timeMinutes: 42,
      color: 'bg-purple-500', 
      category: 'Communication',
      wellnessImpact: 'medium',
      usagePattern: 'Frequent interruptions'
    },
    { 
      id: 4, 
      name: 'Terminal', 
      icon: 'terminal', 
      time: '28 mins', 
      timeMinutes: 28,
      color: 'bg-gray-800', 
      category: 'Development',
      wellnessImpact: 'neutral',
      usagePattern: 'Task-oriented'
    },
    { 
      id: 5, 
      name: 'Spotify', 
      icon: 'spotify', 
      time: '1 hr, 12 mins', 
      timeMinutes: 72,
      color: 'bg-green-500', 
      category: 'Entertainment',
      wellnessImpact: 'positive',
      usagePattern: 'Background usage'
    },
    { 
      id: 6, 
      name: 'YouTube - Chrome', 
      icon: 'youtube', 
      time: '45 mins', 
      timeMinutes: 45,
      color: 'bg-red-500', 
      category: 'Entertainment',
      wellnessImpact: 'negative',
      usagePattern: 'Attention-consuming'
    }
  ]);

  // Calculate system resource totals
  const systemSummary = {
    cpu: '14%',
    memory: '87%',
    disk: '5%'
  };

  // Digital wellbeing metrics
  const wellbeingMetrics = {
    totalScreenTime: '6 hrs, 47 mins',
    productiveTime: '2 hrs, 58 mins',
    entertainmentTime: '1 hr, 57 mins',
    communicationTime: '42 mins',
    focusScore: 68,
    breakReminder: 'Take a 5-minute break',
    nextBreakIn: '23 minutes'
  };

  // Filter options
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('cpu');
  const [timeView, setTimeView] = useState('app'); // 'app' or 'category'

  // Filter and sort processes
  const filteredProcesses = processes.filter(process => {
    if (activeFilter === 'all') return true;
    return process.type === activeFilter;
  }).sort((a, b) => {
    // Parse percentage or size values for comparison
    const parseValue = (value) => {
      if (value.includes('%')) {
        return parseFloat(value);
      } else if (value.includes('MB')) {
        return parseFloat(value.replace(',', ''));
      }
      return 0;
    };
    
    const valueA = parseValue(a[sortBy]);
    const valueB = parseValue(b[sortBy]);
    
    return valueB - valueA; // Descending order
  });

  // Group time spent by category
  const categoryTimeSpent = timeSpent.reduce((acc, app) => {
    if (!acc[app.category]) {
      acc[app.category] = {
        category: app.category,
        timeMinutes: 0,
        wellnessImpact: 'neutral',
        apps: []
      };
    }
    
    acc[app.category].timeMinutes += app.timeMinutes;
    acc[app.category].apps.push(app);
    
    // Determine overall wellness impact for category
    const impacts = acc[app.category].apps.map(a => a.wellnessImpact);
    if (impacts.includes('negative')) {
      acc[app.category].wellnessImpact = 'negative';
    } else if (impacts.every(i => i === 'positive')) {
      acc[app.category].wellnessImpact = 'positive';
    } else {
      acc[app.category].wellnessImpact = 'medium';
    }
    
    return acc;
  }, {});

  // Convert to array and format time
  const categoryArray = Object.values(categoryTimeSpent).map(cat => {
    const hours = Math.floor(cat.timeMinutes / 60);
    const mins = cat.timeMinutes % 60;
    return {
      ...cat,
      time: hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''}, ${mins} mins` : `${mins} mins`,
      color: cat.category === 'Productivity' ? 'bg-green-500' : 
             cat.category === 'Entertainment' ? 'bg-red-400' : 
             cat.category === 'Communication' ? 'bg-purple-500' : 
             cat.category === 'Browsing' ? 'bg-blue-500' : 'bg-gray-500'
    };
  }).sort((a, b) => b.timeMinutes - a.timeMinutes);

  // Get wellness score color
  const getWellnessColor = (impact) => {
    switch(impact) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  // Get wellness icon
  const getWellnessIcon = (impact) => {
    switch(impact) {
      case 'positive':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'negative':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={true} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header /> {/* Header component */}
        
        <div className="min-h-screen bg-gray-50 p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header and Wellbeing Summary */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Digital Wellbeing</h1>
                <p className="text-gray-600 mt-1">Track your digital habits and improve your focus</p>
              </div>
              
              <div className="mt-4 md:mt-0 bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-blue-600">{wellbeingMetrics.focusScore}</span>
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Focus Score</h2>
                    <p className="text-lg font-semibold text-gray-800">{wellbeingMetrics.breakReminder}</p>
                    <p className="text-sm text-gray-600">Next break in {wellbeingMetrics.nextBreakIn}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Wellbeing Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-gray-500 text-sm font-medium mb-2">Total Screen Time</h2>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-indigo-600 mr-2">{wellbeingMetrics.totalScreenTime}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 001.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mt-1">5% less than yesterday</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-gray-500 text-sm font-medium mb-2">Productive Time</h2>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-green-600 mr-2">{wellbeingMetrics.productiveTime}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mt-1">44% of your screen time</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-gray-500 text-sm font-medium mb-2">Entertainment Time</h2>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-orange-500 mr-2">{wellbeingMetrics.entertainmentTime}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mt-1">29% of your screen time</p>
              </div>
            </div>
            
            {/* System Resource Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-gray-500 text-sm font-medium">CPU Usage</h2>
                  <span className="text-2xl font-bold text-blue-600">{systemSummary.cpu}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: systemSummary.cpu }}></div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-gray-500 text-sm font-medium">Memory Usage</h2>
                  <span className="text-2xl font-bold text-purple-600">{systemSummary.memory}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-600 h-3 rounded-full" style={{ width: systemSummary.memory }}></div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-gray-500 text-sm font-medium">Disk I/O</h2>
                  <span className="text-2xl font-bold text-green-600">{systemSummary.disk}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full" style={{ width: systemSummary.disk }}></div>
                </div>
              </div>
            </div>
            
            {/* Process Monitor */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6 border-b">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3 md:mb-0">Active Processes</h2>
                  <div className="flex space-x-2 flex-wrap">
                    <button 
                      className={`px-3 py-1 text-sm rounded-md mb-2 md:mb-0 ${activeFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                      onClick={() => setActiveFilter('all')}
                    >
                      All
                    </button>
                    <button 
                      className={`px-3 py-1 text-sm rounded-md mb-2 md:mb-0 ${activeFilter === 'application' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                      onClick={() => setActiveFilter('application')}
                    >
                      Applications
                    </button>
                    <button 
                      className={`px-3 py-1 text-sm rounded-md mb-2 md:mb-0 ${activeFilter === 'tab' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                      onClick={() => setActiveFilter('tab')}
                    >
                      Tabs
                    </button>
                    <button 
                      className={`px-3 py-1 text-sm rounded-md ${activeFilter === 'browser' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                      onClick={() => setActiveFilter('browser')}
                    >
                      Browsers
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-500 text-sm">
                      <th className="py-3 px-6 font-medium w-1/3">Name</th>
                      <th className="py-3 px-6 font-medium">Status</th>
                      <th className="py-3 px-6 font-medium text-right cursor-pointer" onClick={() => setSortBy('cpu')}>
                        CPU {sortBy === 'cpu' && '↓'}
                      </th>
                      <th className="py-3 px-6 font-medium text-right cursor-pointer" onClick={() => setSortBy('memory')}>
                        Memory {sortBy === 'memory' && '↓'}
                      </th>
                      <th className="py-3 px-6 font-medium text-right cursor-pointer" onClick={() => setSortBy('disk')}>
                        Disk {sortBy === 'disk' && '↓'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProcesses.map(process => (
                      <tr key={process.id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-6 flex items-center">
                          <div className={`w-8 h-8 rounded-md flex items-center justify-center mr-3 ${
                            process.type === 'application' ? 'bg-blue-100 text-blue-800' : 
                            process.type === 'tab' ? 'bg-green-100 text-green-800' : 
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {process.icon}
                          </div>
                          <span className="text-gray-800 font-medium">{process.name}</span>
                        </td>
                        <td className="py-3 px-6">
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                            {process.status}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-right text-gray-800">{process.cpu}</td>
                        <td className="py-3 px-6 text-right text-gray-800">{process.memory}</td>
                        <td className="py-3 px-6 text-right text-gray-800">{process.disk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Enhanced Time Breakdown */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Time Breakdown</h2>
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-1 text-sm rounded-md ${timeView === 'app' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => setTimeView('app')}
                  >
                    By App
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm rounded-md ${timeView === 'category' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => setTimeView('category')}
                  >
                    By Category
                  </button>
                </div>
              </div>
              
              {timeView === 'app' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    {timeSpent.slice(0, 3).map(app => (
                      <div key={app.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-md flex items-center justify-center mr-3 ${app.color} text-white`}>
                              {app.icon.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800">{app.name}</h3>
                              <span className="text-sm text-gray-500">{app.category}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className={`mr-2 ${getWellnessColor(app.wellnessImpact)}`}>
                              {getWellnessIcon(app.wellnessImpact)}
                            </span>
                            <span className="font-medium">{app.time}</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${app.color}`} 
                            style={{ width: `${(app.timeMinutes / 180) * 100}%` }}
                          ></div>
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                          <span className="block">{app.usagePattern}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-5">
                    {timeSpent.slice(3, 6).map(app => (
                      <div key={app.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-md flex items-center justify-center mr-3 ${app.color} text-white`}>
                              {app.icon.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800">{app.name}</h3>
                              <span className="text-sm text-gray-500">{app.category}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className={`mr-2 ${getWellnessColor(app.wellnessImpact)}`}>
                              {getWellnessIcon(app.wellnessImpact)}
                            </span>
                            <span className="font-medium">{app.time}</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${app.color}`} 
                            style={{ width: `${(app.timeMinutes / 180) * 100}%` }}
                          ></div>
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                          <span className="block">{app.usagePattern}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {categoryArray.map((category, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">{category.category}</h3>
                          <span className="text-sm text-gray-500">{category.apps.length} applications</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`mr-2 ${getWellnessColor(category.wellnessImpact)}`}>
                            {getWellnessIcon(category.wellnessImpact)}
                          </span>
                          <span className="font-medium">{category.time}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${category.color}`} 
                          style={{ width: `${(category.timeMinutes / 407) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {category.apps.map(app => (
                          <div key={app.id} className="flex items-center">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center mr-2 ${app.color} text-white`}>
                              {app.icon.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700">{app.name}</h4>
                              <span className="text-xs text-gray-500">{app.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4">
                        {category.wellnessImpact === 'negative' && (
                          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                            <p className="font-medium">Wellbeing tip:</p>
                            <p>Try to limit your {category.category.toLowerCase()} time to improve your digital wellbeing.</p>
                          </div>
                        )}
                        {category.wellnessImpact === 'positive' && (
                          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
                            <p className="font-medium">Wellbeing insight:</p>
                            <p>Your {category.category.toLowerCase()} habits are contributing positively to your digital balance.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Digital Wellbeing Tips */}
            <div className="bg-indigo-50 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-indigo-800 mb-4">Personalized Wellbeing Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Optimize Your Day</h3>
                  <p className="text-sm text-gray-600">Your entertainment time (1 hr, 57 mins) is on the higher side. Consider scheduling focused work blocks to balance your usage.</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Take a Break</h3>
                  <p className="text-sm text-gray-600">You've been active for a while. {wellbeingMetrics.breakReminder} in {wellbeingMetrics.nextBreakIn} to recharge.</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Boost Productivity</h3>
                  <p className="text-sm text-gray-600">Your productive time (2 hrs, 58 mins) is strong! Try extending focus sessions to increase your focus score.</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Limit Distractions</h3>
                  <p className="text-sm text-gray-600">Frequent interruptions from communication apps like Slack (42 mins) may reduce focus. Set specific check-in times.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalWellbeing;