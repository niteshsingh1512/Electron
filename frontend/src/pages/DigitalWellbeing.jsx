import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SystemUsageDashboard = () => {
  const [activeView, setActiveView] = useState('appUsage'); // 'appUsage' or 'networkUsage'
  const [appData, setAppData] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const endpoint = activeView === 'appUsage' 
          ? 'http://127.0.0.1:5000/app_usage' 
          : 'http://127.0.0.1:5000/network-usage';
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${activeView} data`);
        }
        const data = await response.json();
        
        if (activeView === 'appUsage') {
          setAppData(data.app_usage || []);
        } else {
          setNetworkData(data.network_usage || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeView]);

  // Process data for app usage chart
  const processAppUsageData = () => {
    const topApps = [...appData]
      .sort((a, b) => b.usage_minutes - a.usage_minutes)
      .slice(0, 10);

    return {
      labels: topApps.map(app => app.app),
      datasets: [
        {
          label: 'Usage Time (Hours)',
          data: topApps.map(app => (app.usage_minutes/3600)),
          backgroundColor: 'rgba(79, 70, 229, 0.7)',
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Process data for network usage chart
  const processNetworkData = () => {
    const topApps = [...networkData]
      .sort((a, b) => (b.download_MB + b.upload_MB) - (a.download_MB + a.upload_MB))
      .slice(0, 10);

    return {
      labels: topApps.map(app => app.app),
      datasets: [
        {
          label: 'Download (MB)',
          data: topApps.map(app => app.download_MB),
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 1,
        },
        {
          label: 'Upload (MB)',
          data: topApps.map(app => app.upload_MB),
          backgroundColor: 'rgba(236, 72, 153, 0.7)',
          borderColor: 'rgba(236, 72, 153, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: activeView === 'appUsage' 
          ? 'Top 10 Most Used Apps (Last 24 Hours)' 
          : 'Top 10 Network Usage (Last 24 Hours)',
        font: {
          size: 18,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: activeView === 'appUsage' ? 'Minutes' : 'Megabytes',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">System Usage Dashboard</h1>
        
        {/* View Toggle Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveView('appUsage')}
            className={`px-4 py-2 rounded-md ${activeView === 'appUsage' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            App Usage
          </button>
          <button
            onClick={() => setActiveView('networkUsage')}
            className={`px-4 py-2 rounded-md ${activeView === 'networkUsage' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Network Usage
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">Error: {error}</p>
                </div>
              </div>
            </div>
          ) : activeView === 'appUsage' ? (
            <>
              {appData.length > 0 ? (
                <>
                  <div className="h-96">
                    <Bar data={processAppUsageData()} options={chartOptions} />
                  </div>
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">App Usage Details</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">App Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage Time (Hours)</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {appData
                            .sort((a, b) => b.usage_minutes - a.usage_minutes)
                            .map((app, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.app}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(app.usage_minutes/3600).toFixed(2)}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No app usage data</h3>
                  <p className="mt-1 text-sm text-gray-500">No app usage data was found for the last 24 hours.</p>
                </div>
              )}
            </>
          ) : (
            <>
              {networkData.length > 0 ? (
                <>
                  <div className="h-96">
                    <Bar data={processNetworkData()} options={chartOptions} />
                  </div>
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Network Usage Details</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">App Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Download (MB)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload (MB)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (MB)</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {networkData
                            .sort((a, b) => (b.download_MB + b.upload_MB) - (a.download_MB + a.upload_MB))
                            .map((app, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.app}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.download_MB.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.upload_MB.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {(app.download_MB + app.upload_MB).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No network usage data</h3>
                  <p className="mt-1 text-sm text-gray-500">No network usage data was found for the last 24 hours.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemUsageDashboard;