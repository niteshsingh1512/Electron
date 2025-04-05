import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Database, HardDrive, Wifi, ChevronRight } from 'lucide-react';

// Import layout components
import Header from '../component/layout/Header';
import Sidebar from '../component/layout/Sidebar';

const DigitalWellbeing = () => {
  const [activeTab, setActiveTab] = useState('cpu');
  const [cpuData, setCpuData] = useState([]);
  const [memoryData, setMemoryData] = useState([]);
  const [diskData, setDiskData] = useState([]);
  const [wifiData, setWifiData] = useState([]);
  
  // Sample system data
  const systemInfo = {
    cpu: {
      model: '12th Gen Intel(R) Core(TM) i5-1235U',
      speed: '2.20 GHz',
      utilization: 11,
      baseSpeed: '1.30 GHz',
      sockets: 1,
      cores: 10,
      logicalProcessors: 12,
      virtualization: 'Enabled',
      l1Cache: '928 KB',
      l2Cache: '6.5 MB',
      l3Cache: '12.0 MB',
      processes: 341,
      threads: 4920,
      handles: 155761,
      uptime: '07:35:19'
    },
    memory: {
      total: '8.0 GB',
      inUse: '6.8 GB',
      available: '889 MB',
      committed: '18.8/22.2 GB',
      cached: '764 MB',
      pagedPool: '657 MB',
      nonPagedPool: '657 MB',
      speed: '4267 MT/s',
      slotsUsed: '8 of 8',
      formFactor: 'Row of chips',
      hardwareReserved: '301 MB',
      compression: 'Compressed'
    },
    disk: {
      model: 'SAMSUNG MZVLQ512HBLU-00B',
      activeTime: '4%',
      responseTime: '0.4 ms',
      capacity: '477 GB',
      formatted: '477 GB',
      systemDisk: 'Yes',
      pageFile: 'Yes',
      type: 'SSD (NVMe)',
      readSpeed: '6.5 MB/s',
      writeSpeed: '131 KB/s'
    },
    wifi: {
      adapter: 'Intel(R) Wi-Fi 6 AX201 160MHz',
      send: '8.0 Kbps',
      receive: '0 Kbps',
      ssid: 'Mera Ielo 5g h',
      connectionType: '802.11ac',
      ipv4: '192.168.211.96',
      ipv6: '240:940:c2:1008:7a1b:3396:d3dfc:69b:e3df',
      signalStrength: '3/5'
    }
  };

  // Function to generate random data for the charts
  const generateRandomData = (min, max, count) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const value = Math.floor(Math.random() * (max - min + 1)) + min;
      data.push({
        time: i,
        value
      });
    }
    return data;
  };

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Add a new data point and remove the oldest one to create a scrolling effect
      setCpuData(prev => {
        const newData = [...prev];
        newData.push({ time: prev.length, value: Math.floor(Math.random() * 30) + 5 });
        if (newData.length > 60) newData.shift();
        return newData;
      });
      
      setMemoryData(prev => {
        const newData = [...prev];
        newData.push({ time: prev.length, value: Math.floor(Math.random() * 15) + 75 });
        if (newData.length > 60) newData.shift();
        return newData;
      });
      
      setDiskData(prev => {
        const newData = [...prev];
        newData.push({ time: prev.length, value: Math.floor(Math.random() * 25) + 1 });
        if (newData.length > 60) newData.shift();
        return newData;
      });
      
      setWifiData(prev => {
        const newData = [...prev];
        newData.push({ time: prev.length, value: Math.floor(Math.random() * 800) });
        if (newData.length > 60) newData.shift();
        return newData;
      });
    }, 1000);
    
    // Initialize with some data
    setCpuData(generateRandomData(5, 35, 60));
    setMemoryData(generateRandomData(75, 90, 60));
    setDiskData(generateRandomData(1, 25, 60));
    setWifiData(generateRandomData(0, 800, 60));
    
    return () => clearInterval(interval);
  }, []);

  // Render the sidebar items
  const renderSidebarItem = (id, icon, label, value, subvalue) => {
    return (
      <div 
        className={`flex items-center p-4 cursor-pointer ${activeTab === id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
        onClick={() => setActiveTab(id)}
      >
        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded mr-4">
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">{label}</div>
          <div className="text-sm text-gray-700">{value}</div>
          <div className="text-xs text-gray-500">{subvalue}</div>
        </div>
        <ChevronRight className="text-gray-400" size={16} />
      </div>
    );
  };

  // Render the detail section based on the active tab
  const renderDetailSection = () => {
    switch (activeTab) {
      case 'cpu':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">CPU</h2>
            <div className="mb-4">
              <div className="text-right text-sm text-gray-500">{systemInfo.cpu.model}</div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cpuData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tick={false} 
                      label={{ value: '60 seconds', position: 'insideBottomLeft' }} 
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      label={{ value: '% Utilization', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      dot={false} 
                      isAnimationActive={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Utilization</div>
                <div className="text-xl">{systemInfo.cpu.utilization}%</div>
              </div>
              <div>
                <div className="text-sm font-medium">Speed</div>
                <div className="text-xl">{systemInfo.cpu.speed}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium">Processes</div>
                <div className="text-xl">{systemInfo.cpu.processes}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Threads</div>
                <div className="text-xl">{systemInfo.cpu.threads}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Handles</div>
                <div className="text-xl">{systemInfo.cpu.handles}</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium">Up time</div>
              <div className="text-xl">{systemInfo.cpu.uptime}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Base speed:</div>
                <div className="text-sm">{systemInfo.cpu.baseSpeed}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Sockets:</div>
                <div className="text-sm">{systemInfo.cpu.sockets}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Cores:</div>
                <div className="text-sm">{systemInfo.cpu.cores}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Logical processors:</div>
                <div className="text-sm">{systemInfo.cpu.logicalProcessors}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Virtualization:</div>
                <div className="text-sm">{systemInfo.cpu.virtualization}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">L1 cache:</div>
                <div className="text-sm">{systemInfo.cpu.l1Cache}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">L2 cache:</div>
                <div className="text-sm">{systemInfo.cpu.l2Cache}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">L3 cache:</div>
                <div className="text-sm">{systemInfo.cpu.l3Cache}</div>
              </div>
            </div>
          </div>
        );
        
      case 'memory':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Memory</h2>
            <div className="mb-4">
              <div className="text-right text-sm text-gray-500">{systemInfo.memory.total}</div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={memoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tick={false} 
                      label={{ value: '60 seconds', position: 'insideBottomLeft' }} 
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      label={{ value: 'Memory usage', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#0369a1" 
                      fill="#0369a1" 
                      dot={false} 
                      isAnimationActive={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">In use (Compressed)</div>
                <div className="text-xl">{systemInfo.memory.inUse}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Available</div>
                <div className="text-xl">{systemInfo.memory.available}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Committed</div>
                <div className="text-xl">{systemInfo.memory.committed}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Cached</div>
                <div className="text-xl">{systemInfo.memory.cached}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Paged pool</div>
                <div className="text-xl">{systemInfo.memory.pagedPool}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Non-paged pool</div>
                <div className="text-xl">{systemInfo.memory.nonPagedPool}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Speed:</div>
                <div className="text-sm">{systemInfo.memory.speed}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Slots used:</div>
                <div className="text-sm">{systemInfo.memory.slotsUsed}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Form factor:</div>
                <div className="text-sm">{systemInfo.memory.formFactor}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Hardware reserved:</div>
                <div className="text-sm">{systemInfo.memory.hardwareReserved}</div>
              </div>
            </div>
          </div>
        );
        
      case 'disk':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Disk 0 (C: D:)</h2>
            <div className="mb-4">
              <div className="text-right text-sm text-gray-500">{systemInfo.disk.model}</div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={diskData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tick={false} 
                      label={{ value: '60 seconds', position: 'insideBottomLeft' }} 
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      label={{ value: 'Active time', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip formatter={(value) => [`${value}%`, 'Activity']} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#16a34a" 
                      fill="#16a34a" 
                      dot={false} 
                      isAnimationActive={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="border-t border-b border-gray-200 py-4">
              <div className="text-sm font-medium mb-2">Disk transfer rate</div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={diskData.map(item => ({ ...item, value: item.value * 2 }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tick={false} 
                      label={{ value: '60 seconds', position: 'insideBottomLeft' }} 
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      label={{ value: '100 MB/s', position: 'insideTopLeft' }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#16a34a" 
                      fill="#16a34a" 
                      dot={false} 
                      isAnimationActive={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Active time</div>
                <div className="text-xl">{systemInfo.disk.activeTime}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Average response time</div>
                <div className="text-xl">{systemInfo.disk.responseTime}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Capacity:</div>
                <div className="text-sm">{systemInfo.disk.capacity}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Formatted:</div>
                <div className="text-sm">{systemInfo.disk.formatted}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">System disk:</div>
                <div className="text-sm">{systemInfo.disk.systemDisk}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Page file:</div>
                <div className="text-sm">{systemInfo.disk.pageFile}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Type:</div>
                <div className="text-sm">{systemInfo.disk.type}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Read speed</div>
                <div className="text-xl">{systemInfo.disk.readSpeed}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Write speed</div>
                <div className="text-xl">{systemInfo.disk.writeSpeed}</div>
              </div>
            </div>
          </div>
        );
        
      case 'wifi':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Wi-Fi</h2>
            <div className="mb-4">
              <div className="text-right text-sm text-gray-500">{systemInfo.wifi.adapter}</div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={wifiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tick={false} 
                      label={{ value: '60 seconds', position: 'insideBottomLeft' }} 
                    />
                    <YAxis 
                      domain={[0, 1000]} 
                      label={{ value: 'Throughput (1 Mbps)', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip formatter={(value) => [`${value} Kbps`, 'Throughput']} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#db2777" 
                      fill="#db2777" 
                      dot={false} 
                      isAnimationActive={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Send</div>
                <div className="text-xl">{systemInfo.wifi.send}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Receive</div>
                <div className="text-xl">{systemInfo.wifi.receive}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Adapter name:</div>
                <div className="text-sm">Wi-Fi</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">SSID:</div>
                <div className="text-sm">{systemInfo.wifi.ssid}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Connection type:</div>
                <div className="text-sm">{systemInfo.wifi.connectionType}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">IPv4 address:</div>
                <div className="text-sm">{systemInfo.wifi.ipv4}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">IPv6 address:</div>
                <div className="text-sm truncate">{systemInfo.wifi.ipv6}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Signal strength:</div>
                <div className="text-sm flex items-center">
                  {Array(5).fill(0).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-${i+1} mx-px rounded-sm ${i < 3 ? 'bg-green-500' : 'bg-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={true} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header /> {/* Header component */}
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6">Digital Wellbeing</h1> {/* Updated title */}
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-4">
                {/* Sidebar */}
                <div className="border-r border-gray-200">
                  {renderSidebarItem('cpu', <Activity size={24} className="text-blue-500" />, 'CPU', `${systemInfo.cpu.utilization}% ${systemInfo.cpu.speed}`, '')}
                  {renderSidebarItem('memory', <Database size={24} className="text-blue-800" />, 'Memory', `${systemInfo.memory.inUse} (${84}%)`, '')}
                  {renderSidebarItem('disk', <HardDrive size={24} className="text-green-600" />, 'Disk 0 (C: D:)', 'SSD (NVMe)', '4%')}
                  {renderSidebarItem('wifi', <Wifi size={24} className="text-pink-600" />, 'Wi-Fi', 'Wi-Fi', 'S: 0 R: 0 Kbps')}
                </div>
                
                {/* Main content */}
                <div className="col-span-1 md:col-span-3 p-6">
                  {renderDetailSection()}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DigitalWellbeing;