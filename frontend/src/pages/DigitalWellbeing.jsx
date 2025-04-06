import React, { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import Sidebar from '../component/layout/Sidebar';
import Header from '../component/layout/Header';
// import { 
//   ArrowPathIcon, 
//   ChartBarIcon, 
//   GlobeAltIcon, 
//   ClockIcon,
//   CalendarIcon,
//   ExclamationCircleIcon
// } from '@heroicons/react/24/outline';
// No longer valid in recent versions:
// import * as OutlineIcons from "@heroicons/react/24/outline";

// Best approach per icon:
// import { CalendarIcon } from '@heroicons/react/24/outline/CalendarIcon';
import {ArrowPathIcon, 
  ChartBarIcon, 
  GlobeAltIcon, 
  ClockIcon,
  CalendarIcon,
  ExclamationCircleIcon } from '@heroicons/react/24/outline';



// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const SystemUsageDashboard = () => {
  const [activeView, setActiveView] = useState('appUsage');
  const [appData, setAppData] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000);
    
    setRefreshInterval(interval);
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [activeView, timeRange]);

  // Generate mock historical data
  useEffect(() => {
    const generateHistoricalData = () => {
      const data = [];
      const now = new Date();
      const timePoints = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
      
      for (let i = 0; i < timePoints; i++) {
        const timestamp = new Date(now);
        
        if (timeRange === '24h') {
          timestamp.setHours(now.getHours() - (timePoints - i - 1));
        } else {
          timestamp.setDate(now.getDate() - (timePoints - i - 1));
        }
        
        data.push({
          timestamp: timestamp.toISOString(),
          appUsage: Math.floor(Math.random() * 200) + 50,
          networkDownload: Math.floor(Math.random() * 500) + 100,
          networkUpload: Math.floor(Math.random() * 300) + 50
        });
      }
      
      setHistoricalData(data);
    };
    
    generateHistoricalData();
  }, [timeRange]);

  const chromeTabs = async ()=> {
    try{
      const response = await fetch(`http://localhost:5000/chrome-tabs`);
      const data = await response.json();
      console.log('api data', data);
    } catch(error) {
      console.error('Error fetching Chrome tabs:', error);
    }
  }

  let intervalId;
  const startInterval = () => {
    intervalId = setInterval(chromeTabs, 20000)
  }
  const closeInetrval = () => {
  cleatInterval(intervalId);
  }

  startInterval();
  

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = activeView === 'appUsage' 
        ? `http://127.0.0.1:5000/app_usage?range=${timeRange}` 
        : `http://127.0.0.1:5000/network-usage?range=${timeRange}`;
      
      try {
        

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
        console.error("API error:", err);
        // Fallback to mock data for demo purposes
        generateMockData();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const generateMockData = () => {
    if (activeView === 'appUsage') {
      const mockApps = [
        { app: "Chrome", usage_minutes: 320 },
        { app: "VS Code", usage_minutes: 245 },
        { app: "Slack", usage_minutes: 180 },
        { app: "Spotify", usage_minutes: 145 },
        { app: "Zoom", usage_minutes: 110 },
        { app: "Mail", usage_minutes: 85 },
        { app: "Terminal", usage_minutes: 75 },
        { app: "Word", usage_minutes: 60 },
        { app: "Excel", usage_minutes: 45 },
        { app: "Photoshop", usage_minutes: 40 },
        { app: "Discord", usage_minutes: 35 },
        { app: "Notes", usage_minutes: 30 }
      ];
      setAppData(mockApps);
    } else {
      const mockNetworkData = [
        { app: "Chrome", download_MB: 450, upload_MB: 50 },
        { app: "Zoom", download_MB: 350, upload_MB: 320 },
        { app: "Spotify", download_MB: 280, upload_MB: 15 },
        { app: "Slack", download_MB: 120, upload_MB: 85 },
        { app: "VS Code", download_MB: 75, upload_MB: 45 },
        { app: "Mail", download_MB: 65, upload_MB: 40 },
        { app: "Discord", download_MB: 95, upload_MB: 65 },
        { app: "App Store", download_MB: 320, upload_MB: 15 },
        { app: "System Services", download_MB: 150, upload_MB: 90 },
        { app: "iCloud", download_MB: 110, upload_MB: 200 }
      ];
      setNetworkData(mockNetworkData);
    }
  };



  const processAppUsageData = () => {
    const topApps = [...appData]
      .sort((a, b) => b.usage_minutes - a.usage_minutes)
      .slice(0, 10);

    return {
      labels: topApps.map(app => app.app),
      datasets: [
        {
          label: 'Usage Time (Hours)',
          data: topApps.map(app => (app.usage_minutes / 60).toFixed(2)),
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(217, 119, 6, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(236, 72, 153, 0.7)',
            'rgba(14, 165, 233, 0.7)',
            'rgba(249, 115, 22, 0.7)',
            'rgba(168, 85, 247, 0.7)',
            'rgba(79, 70, 229, 0.7)'
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(217, 119, 6, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(14, 165, 233, 1)',
            'rgba(249, 115, 22, 1)',
            'rgba(168, 85, 247, 1)',
            'rgba(79, 70, 229, 1)'
          ],
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    };
  };

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
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: 'Upload (MB)',
          data: topApps.map(app => app.upload_MB),
          backgroundColor: 'rgba(236, 72, 153, 0.7)',
          borderColor: 'rgba(236, 72, 153, 1)',
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(226, 232, 240, 0.5)' },
        ticks: { font: { size: 11 }, color: '#64748b' },
        title: {
          display: true,
          text: activeView === 'appUsage' ? 'Hours' : 'Megabytes',
          font: { size: 12, weight: 'normal' },
          color: '#64748b',
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 11 },
          color: '#64748b',
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        usePointStyle: true,
      }
    }
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(226, 232, 240, 0.5)' },
        ticks: { font: { size: 11 }, color: '#64748b' },
        title: {
          display: true,
          text: activeView === 'appUsage' ? 'Minutes' : 'Megabytes',
          font: { size: 12, weight: 'normal' },
          color: '#64748b',
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 11 },
          color: '#64748b',
          maxRotation: 45,
          minRotation: 45,
          callback: function(value, index, values) {
            const date = new Date(historicalData[index].timestamp);
            return timeRange === '24h' 
              ? date.getHours() + ':00'
              : date.getDate() + '/' + (date.getMonth() + 1);
          }
        },
      },
    },
  };

  const processHistoricalData = () => {
    return {
      labels: historicalData.map(item => item.timestamp),
      datasets: activeView === 'appUsage' 
        ? [
            {
              label: 'App Usage (minutes)',
              data: historicalData.map(item => item.appUsage),
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              pointRadius: 3,
              pointBackgroundColor: '#fff',
              pointBorderColor: 'rgba(59, 130, 246, 1)',
              pointBorderWidth: 2,
            }
          ]
        : [
            {
              label: 'Download (MB)',
              data: historicalData.map(item => item.networkDownload),
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 2,
              tension: 0.4,
              fill: false,
              pointRadius: 3,
              pointBackgroundColor: '#fff',
              pointBorderColor: 'rgba(59, 130, 246, 1)',
              pointBorderWidth: 2,
            },
            {
              label: 'Upload (MB)',
              data: historicalData.map(item => item.networkUpload),
              backgroundColor: 'rgba(236, 72, 153, 0.1)',
              borderColor: 'rgba(236, 72, 153, 1)',
              borderWidth: 2,
              tension: 0.4,
              fill: false,
              pointRadius: 3,
              pointBackgroundColor: '#fff',
              pointBorderColor: 'rgba(236, 72, 153, 1)',
              pointBorderWidth: 2,
            }
          ]
    };
  };

  const getTimeRangeLabel = () => {
    switch(timeRange) {
      case '24h': return 'Last 24 Hours';
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      default: return 'Last 24 Hours';
    }
  };

  const processDoughnutData = () => {
    let data = [];
    let labels = [];
    
    if (activeView === 'appUsage') {
      const totalMinutes = appData.reduce((acc, app) => acc + app.usage_minutes, 0);
      const topApps = [...appData]
        .sort((a, b) => b.usage_minutes - a.usage_minutes)
        .slice(0, 5);
      
      // Calculate "Others" category
      const otherMinutes = totalMinutes - topApps.reduce((acc, app) => acc + app.usage_minutes, 0);
      
      data = [...topApps.map(app => app.usage_minutes), otherMinutes];
      labels = [...topApps.map(app => app.app), 'Others'];
    } else {
      const totalData = networkData.reduce((acc, app) => acc + app.download_MB + app.upload_MB, 0);
      const topApps = [...networkData]
        .sort((a, b) => (b.download_MB + b.upload_MB) - (a.download_MB + a.upload_MB))
        .slice(0, 5);
      
      // Calculate "Others" category
      const otherData = totalData - topApps.reduce((acc, app) => acc + app.download_MB + app.upload_MB, 0);
      
      data = [...topApps.map(app => app.download_MB + app.upload_MB), otherData];
      labels = [...topApps.map(app => app.app), 'Others'];
    }
    
    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(217, 119, 6, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(209, 213, 219, 0.7)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(217, 119, 6, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(209, 213, 219, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleTimeString('en-US', options);
  };

  const currentDate = new Date();

  return (
    <div className="flex h-screen bg-white">
      <Sidebar isOpen={true} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header username="Nitesh" />
        
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Today is {formatDate(currentDate)} • Last update: {formatTime(currentDate)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                {activeView === 'appUsage' ? (
                  <ChartBarIcon className="h-8 w-8 mr-2 text-blue-500" />
                ) : (
                  <GlobeAltIcon className="h-8 w-8 mr-2 text-blue-500" />
                )}
                {activeView === 'appUsage' ? 'Application Usage' : 'Network Usage'} Dashboard
                <span className="ml-3 text-sm font-normal text-gray-500">
                  {getTimeRangeLabel()}
                </span>
              </h1>
              <button 
                onClick={fetchData}
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={loading}
              >
                <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="inline-flex p-1 space-x-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setActiveView('appUsage')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeView === 'appUsage' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  App Usage
                </button>
                <button
                  onClick={() => setActiveView('networkUsage')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeView === 'networkUsage' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Network Usage
                </button>
              </div>
              
              <div className="inline-flex p-1 bg-gray-100 rounded-lg">
                {['24h', '7d', '30d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      timeRange === range 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {range === '24h' ? '24h' : range === '7d' ? '7d' : '30d'}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-50 text-blue-500">
                    <ClockIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      {activeView === 'appUsage' ? 'Total Usage Time' : 'Total Data Transfer'}
                    </p>
                    <p className="text-xl font-semibold text-gray-800">
                      {activeView === 'appUsage' 
                        ? `${(appData.reduce((acc, app) => acc + app.usage_minutes, 0) / 60).toFixed(1)} hours`
                        : `${(networkData.reduce((acc, app) => acc + app.download_MB + app.upload_MB, 0)).toFixed(1)} MB`
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-50 text-green-500">
                    <ChartBarIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      {activeView === 'appUsage' ? 'Most Used App' : 'Highest Data Usage'}
                    </p>
                    <p className="text-xl font-semibold text-gray-800">
                      {activeView === 'appUsage' 
                        ? (appData[0]?.app || 'N/A')
                        : (networkData[0]?.app || 'N/A')
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              {activeView === 'appUsage' ? (
                <>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-purple-50 text-purple-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Average Daily Usage</p>
                        <p className="text-xl font-semibold text-gray-800">
                          {(appData.reduce((acc, app) => acc + app.usage_minutes, 0) / (timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : 30) / 60).toFixed(1)} hours
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-amber-50 text-amber-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Apps</p>
                        <p className="text-xl font-semibold text-gray-800">{appData.length}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-cyan-50 text-cyan-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Download</p>
                        <p className="text-xl font-semibold text-gray-800">
                          {networkData.reduce((acc, app) => acc + app.download_MB, 0).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-rose-50 text-rose-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Upload</p>
                        <p className="text-xl font-semibold text-gray-800">
                        {networkData.reduce((acc, app) => acc + app.upload_MB, 0).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
              {/* Bar Chart */}
              <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800">
                    {activeView === 'appUsage' 
                      ? `Top ${Math.min(appData.length, 10)} Most Used Apps` 
                      : `Top ${Math.min(networkData.length, 10)} Network Usage`}
                  </h2>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="flex justify-center items-center h-80">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">Error: {error}</p>
                        </div>
                      </div>
                    </div>
                  ) : (activeView === 'appUsage' && appData.length > 0) || (activeView === 'networkUsage' && networkData.length > 0) ? (
                    <div className="h-80">
                      <Bar 
                        data={activeView === 'appUsage' ? processAppUsageData() : processNetworkData()} 
                        options={chartOptions} 
                      />
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {activeView === 'appUsage' ? 'No app usage data found.' : 'No network usage data found.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Doughnut Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800">
                    {activeView === 'appUsage' ? 'Usage Distribution' : 'Data Distribution'}
                  </h2>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="flex justify-center items-center h-80">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">Error: {error}</p>
                        </div>
                      </div>
                    </div>
                  ) : (activeView === 'appUsage' && appData.length > 0) || (activeView === 'networkUsage' && networkData.length > 0) ? (
                    <div className="h-80 flex items-center justify-center">
                      <Doughnut 
                        data={processDoughnutData()} 
                        options={doughnutOptions} 
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-80">
                      <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="mt-2 text-gray-500">No data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Historical Trend Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800">
                  {activeView === 'appUsage' ? 'Usage Trends' : 'Network Usage Trends'}
                </h2>
                <span className="text-sm text-gray-500">
                  {getTimeRangeLabel()}
                </span>
              </div>
              <div className="p-6">
                <div className="h-72">
                  <Line 
                    data={processHistoricalData()} 
                    options={lineOptions} 
                  />
                </div>
              </div>
            </div>

            {/* Detailed Data Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800">
                  {activeView === 'appUsage' ? 'App Usage Details' : 'Network Usage Details'}
                </h2>
                <span className="text-sm text-gray-500">
                  {activeView === 'appUsage' ? `${appData.length} applications` : `${networkData.length} applications`}
                </span>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="p-6">
                  <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">Error: {error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {activeView === 'appUsage' ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Usage Time</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {appData.length > 0 ? (
                          appData
                            .sort((a, b) => b.usage_minutes - a.usage_minutes)
                            .map((app, index) => {
                              const totalMinutes = appData.reduce((acc, a) => acc + a.usage_minutes, 0);
                              const percentage = (app.usage_minutes / totalMinutes * 100).toFixed(1);
                              return (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                                        <span className="text-blue-600 font-bold">
                                          {app.app.charAt(0)}
                                        </span>
                                      </div>
                                      <div className="text-sm font-medium text-gray-900">{app.app}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                    {(app.usage_minutes / 60).toFixed(2)} hrs
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end">
                                      <span className="text-sm text-gray-900 mr-2">{percentage}%</span>
                                      <div className="w-16 bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-blue-600 h-2 rounded-full" 
                                          style={{ width: `${percentage}%` }}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-10 text-center text-sm text-gray-500">
                              No app usage data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Download (MB)</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Upload (MB)</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total (MB)</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {networkData.length > 0 ? (
                          networkData
                            .sort((a, b) => (b.download_MB + b.upload_MB) - (a.download_MB + a.upload_MB))
                            .map((app, index) => {
                              const totalMB = (app.download_MB + app.upload_MB).toFixed(1);
                              return (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                                        <span className="text-blue-600 font-bold">
                                          {app.app.charAt(0)}
                                        </span>
                                      </div>
                                      <div className="text-sm font-medium text-gray-900">{app.app}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                    {app.download_MB.toFixed(1)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                    {app.upload_MB.toFixed(1)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                    {totalMB}
                                  </td>
                                </tr>
                              );
                            })
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                              No network usage data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
              
              {/* Pagination Controls */}
              {((activeView === 'appUsage' && appData.length > 0) || (activeView === 'networkUsage' && networkData.length > 0)) && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{activeView === 'appUsage' ? appData.length : networkData.length}</span> of{' '}
                        <span className="font-medium">{activeView === 'appUsage' ? appData.length : networkData.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <a
                          href="#"
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                        <a
                          href="#"
                          aria-current="page"
                          className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        >
                          1
                        </a>
                        <a
                          href="#"
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="mt-8 text-center text-gray-500 text-sm pb-6">
              <p>© 2025 System Monitor Dashboard • Last updated: {formatDate(currentDate)} at {formatTime(currentDate)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemUsageDashboard;