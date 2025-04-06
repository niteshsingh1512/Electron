import React, { useState, useEffect } from 'react';
import QuickActions from '../component/dashboard/QuickActions';
import RecentIssues from '../component/dashboard/RecentIssues';
import ResourceUsages from '../component/dashboard/ResourceUsages';
import SystemHealth from '../component/dashboard/SystemHealth';
import Header from '../component/layout/Header';
import Sidebar from '../component/layout/Sidebar';
import Footer from '../component/layout/Footer';
import axios from 'axios';
import { PieChart, ArrowUpCircle, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [systemScore, setSystemScore] = useState(85);
  const [issueCount, setIssueCount] = useState(3);
  const [cpuUsage, setCpuUsage] = useState(42);
  const [memoryUsage, setMemoryUsage] = useState(65);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Simulate real-time data updates
  // useEffect(() => {
    
  //   const interval = setInterval(() => {
  //     setCpuUsage(prevUsage => {
  //       const newValue = prevUsage + (Math.random() * 6 - 3);
  //       return Math.min(Math.max(newValue, 20), 95);
  //     });
      
  //     setMemoryUsage(prevUsage => {
  //       const newValue = prevUsage + (Math.random() * 4 - 2);
  //       return Math.min(Math.max(newValue, 40), 90);
  //     });
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await axios.get('http://localhost:3000/monitor/total/cpu');
        setCpuUsage(res.data.totalUsage);

        const memRes = await axios.get('http://localhost:3000/monitor/total/memory');
        setMemoryUsage(memRes.data.usagePercent);

        console.log('CPU:', res.data.totalUsage);
        console.log('Memory:', memRes.data.usagePercent);
      } catch (error) {
        console.error('Error fetching usage data:', error);
      }
    };

    // Call immediately
    fetchUsage();

    // Set up interval
    const interval = setInterval(fetchUsage, 3000); // fetch every 3 seconds

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">System Dashboard</h1>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">System Health</p>
                    <p className="text-2xl font-bold text-green-600">{systemScore}%</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">CPU Usage</p>
                    <p className="text-2xl font-bold text-blue-600">{cpuUsage}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <PieChart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Memory Usage</p>
                    <p className="text-2xl font-bold text-purple-600">{memoryUsage}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <ArrowUpCircle className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Issues</p>
                    <p className="text-2xl font-bold text-amber-600">{issueCount}</p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                <SystemHealth />
                <RecentIssues />
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                <QuickActions />
                {/* <ResourceUsages cpuUsage={cpuUsage} memoryUsage={memoryUsage} /> */}
              </div>
            </div>
          </div>
        </main>
        
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default Dashboard;