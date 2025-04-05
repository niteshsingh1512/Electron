import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldCheck, AlertTriangle, XCircle, Wifi, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

const SystemHealth = () => {
  // State for network data
  const [networkData, setNetworkData] = useState({
    interface: "Loading...",
    rx_total: "0 MB",
    tx_total: "0 MB",
    rx_sec: "0 KB/s",
    tx_sec: "0 KB/s"
  });
  
  const [networkStatus, setNetworkStatus] = useState('Healthy');
  const [networkScore, setNetworkScore] = useState(95);
  const [isLoading, setIsLoading] = useState(true);

  // System health metrics
  const [healthStatus, setHealthStatus] = useState({
    score: 85,
    components: [
      { name: 'CPU', status: 'Healthy', score: 90 },
      { name: 'Memory', status: 'Healthy', score: 75 },
      { name: 'Disk', status: 'Warning', score: 65 },
      { name: 'Network', status: 'Healthy', score: 95 },
      { name: 'Security', status: 'Critical', score: 45 },
      { name: 'Drivers', status: 'Healthy', score: 100 },
    ],
  });

  // Fetch network data
  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const response = await fetch('http://localhost:3000/monitor/total/network');
        if (response.ok) {
          const data = await response.json();
          setNetworkData(data);
          
          // Analyze network status based on rx_sec
          const rxRate = parseFloat(data.rx_sec);
          let newStatus = 'Healthy';
          let newScore = 95;
          
          if (rxRate < 0.5) {
            newStatus = 'Critical';
            newScore = 45;
          } else if (rxRate < 2) {
            newStatus = 'Warning';
            newScore = 65;
          }
          
          setNetworkStatus(newStatus);
          setNetworkScore(newScore);
          
          // Update the network component in healthStatus
          setHealthStatus(prevState => {
            const updatedComponents = prevState.components.map(component => 
              component.name === 'Network' 
                ? { ...component, status: newStatus, score: newScore }
                : component
            );
            
            // Recalculate overall health score
            const newOverallScore = Math.round(
              updatedComponents.reduce((sum, component) => sum + component.score, 0) / updatedComponents.length
            );
            
            return {
              score: newOverallScore,
              components: updatedComponents
            };
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch network data:", error);
        setNetworkStatus('Critical');
        setNetworkScore(30);
        setIsLoading(false);
      }
    };
    
    fetchNetworkData();
    const intervalId = setInterval(fetchNetworkData, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Calculate the distribution for the pie chart
  const healthDistribution = [
    { name: 'Healthy', value: healthStatus.components.filter(c => c.status === 'Healthy').length },
    { name: 'Warning', value: healthStatus.components.filter(c => c.status === 'Warning').length },
    { name: 'Critical', value: healthStatus.components.filter(c => c.status === 'Critical').length },
  ];

  const COLORS = ['#16a34a', '#f59e0b', '#dc2626'];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Healthy':
        return <ShieldCheck className="h-5 w-5 text-green-600" />;
      case 'Warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'Critical':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy':
        return 'text-green-600';
      case 'Warning':
        return 'text-amber-600';
      case 'Critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="font-medium text-gray-800">System Health</h2>
      </div>
      <div className="p-4">
        <div className="flex flex-col md:flex-row">
          {/* Chart */}
          <div className="w-full md:w-1/3 flex items-center justify-center mb-4 md:mb-0">
            <div className="relative h-40 w-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {healthDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(healthStatus.score)}`}>
                    {healthStatus.score}%
                  </div>
                  <div className="text-xs text-gray-600">Overall Health</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Component List */}
          <div className="w-full md:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {healthStatus.components.map((component, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="mr-3">
                    {getStatusIcon(component.status)}
                  </div>
                  <div className="w-full">
                    <div className="text-sm font-medium">{component.name}</div>
                    <div className="flex items-center mt-1">
                      <div className="h-1.5 w-16 bg-gray-200 rounded-full mr-2">
                        <div 
                          className={`h-1.5 rounded-full ${
                            component.score >= 80 ? 'bg-green-500' :
                            component.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${component.score}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium ${getStatusColor(component.status)}`}>
                        {component.status}
                      </span>
                    </div>
                    
                    {/* Display network details when it's the Network component */}
                    {component.name === 'Network' && !isLoading && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="flex items-center text-gray-600">
                            <Wifi className="h-3 w-3 mr-1" />
                            {networkData.interface}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-blue-700">
                            <ArrowDownToLine className="h-3 w-3 mr-1" />
                            {networkData.rx_sec}
                          </span>
                          <span className="flex items-center text-green-700">
                            <ArrowUpFromLine className="h-3 w-3 mr-1" />
                            {networkData.tx_sec}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Network Details Panel */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-700">Network Details</h3>
          <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(networkStatus)}`}>
            {networkStatus}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded shadow">
            <div className="flex items-center">
              <ArrowDownToLine className="h-4 w-4 mr-2 text-blue-500" />
              <div>
                <div className="text-xs text-gray-500">Total Received</div>
                <div className="text-sm font-semibold">{networkData.rx_total}</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <div className="flex items-center">
              <ArrowUpFromLine className="h-4 w-4 mr-2 text-green-500" />
              <div>
                <div className="text-xs text-gray-500">Total Sent</div>
                <div className="text-sm font-semibold">{networkData.tx_total}</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <div className="flex items-center">
              <Wifi className="h-4 w-4 mr-2 text-purple-500" />
              <div>
                <div className="text-xs text-gray-500">Interface</div>
                <div className="text-sm font-semibold">{networkData.interface}</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <ArrowDownToLine className="h-4 w-4 mr-1 text-blue-500" />
                <div className="text-sm font-semibold">{networkData.rx_sec}</div>
              </div>
              <div className="flex items-center">
                <ArrowUpFromLine className="h-4 w-4 mr-1 text-green-500" />
                <div className="text-sm font-semibold">{networkData.tx_sec}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;