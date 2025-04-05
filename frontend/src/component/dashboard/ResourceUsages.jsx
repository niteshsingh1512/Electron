import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const ResourceUsages = ({ cpuUsage, memoryUsage }) => {
  // Generate sample historical data
  const generateData = (currentValue, historicalPoints = 12) => {
    const data = [];
    let baseValue = currentValue - (Math.random() * 15);
    
    for (let i = 0; i < historicalPoints; i++) {
      const value = baseValue + (Math.random() * 12 - 6);
      const clampedValue = Math.min(Math.max(value, 0), 100);
      data.push({
        time: i,
        value: clampedValue.toFixed(1)
      });
      baseValue = clampedValue;
    }
    
    // Add current value at the end
    data.push({
      time: historicalPoints,
      value: currentValue.toFixed(1)
    });
    
    return data;
  };

  const cpuData = generateData(cpuUsage);
  const memoryData = generateData(memoryUsage);
  const networkData = generateData(45); // Sample network usage
  const diskData = generateData(30); // Sample disk usage

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow rounded border border-gray-200 text-xs">
          <p>{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="font-medium text-gray-800">Resource Usage</h2>
      </div>
      <div className="p-4 space-y-4">
        {/* CPU Usage */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">CPU</span>
            <span className="text-sm font-bold text-blue-600">{cpuUsage.toFixed(1)}%</span>
          </div>
          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cpuData}>
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={2} 
                  dot={false} 
                  isAnimationActive={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Memory Usage */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Memory</span>
            <span className="text-sm font-bold text-purple-600">{memoryUsage.toFixed(1)}%</span>
          </div>
          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={memoryData}>
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#9333ea" 
                  strokeWidth={2} 
                  dot={false} 
                  isAnimationActive={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Network Usage */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Network</span>
            <span className="text-sm font-bold text-green-600">45.2%</span>
          </div>
          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={networkData}>
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#16a34a" 
                  strokeWidth={2} 
                  dot={false} 
                  isAnimationActive={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Disk Usage */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Disk</span>
            <span className="text-sm font-bold text-amber-600">30.8%</span>
          </div>
          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={diskData}>
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#d97706" 
                  strokeWidth={2} 
                  dot={false}
                  isAnimationActive={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceUsages;