import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  ShieldCheck, AlertTriangle, XCircle, Wifi,
  ArrowDownToLine, ArrowUpFromLine, Cpu, MemoryStick
} from 'lucide-react';
import { Slider } from '@mui/material';

// --- Default Threshold Config ---
const DEFAULT_THRESHOLDS = {
  cpu: { warning: 70, critical: 90 },
  memory: { warning: 75, critical: 90 },
  network: { warning: 2, critical: 5 }, // MB/s
};

// --- Threshold Slider Component ---
const ThresholdSlider = ({ metric, thresholds, setThresholds }) => {
  const [value, setValue] = useState([
    thresholds[metric]?.warning || DEFAULT_THRESHOLDS[metric].warning,
    thresholds[metric]?.critical || DEFAULT_THRESHOLDS[metric].critical,
  ]);

  // Sync slider with threshold changes from other sources
  useEffect(() => {
    setValue([
      thresholds[metric]?.warning || DEFAULT_THRESHOLDS[metric].warning,
      thresholds[metric]?.critical || DEFAULT_THRESHOLDS[metric].critical,
    ]);
  }, [thresholds, metric]);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const handleChangeCommitted = () => {
    const updated = {
      ...thresholds,
      [metric]: {
        warning: value[0],
        critical: value[1],
      },
    };
    localStorage.setItem('system_thresholds', JSON.stringify(updated));
    setThresholds(updated);
  };

  return (
    <div className="mb-4">
      <label className="text-sm font-semibold mb-1 block capitalize">
        {metric} Thresholds {metric === 'network' ? '(MB/s)' : '(%)'}
      </label>
      <Slider
        value={value}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        valueLabelDisplay="auto"
        min={0}
        max={metric === 'network' ? 10 : 100}
        step={metric === 'network' ? 0.1 : 1}
        marks={[
          { value: value[0], label: `W: ${value[0]}${metric === 'network' ? 'MB/s' : '%'}` },
          { value: value[1], label: `C: ${value[1]}${metric === 'network' ? 'MB/s' : '%'}` },
        ]}
      />
    </div>
  );
};

// --- Health Calculation ---
const getComponentHealth = (name, value, thresholds) => {
  const t = thresholds[name.toLowerCase()] || DEFAULT_THRESHOLDS[name.toLowerCase()];
  let status = 'Healthy';
  let score = 85;

  if (typeof value !== 'number' || isNaN(value)) {
    return { status: 'Critical', score: 10 };
  }

  if (name.toLowerCase() === 'network') {
    // Network: higher values are worse (MB/s)
    if (value >= t.critical) {
      status = 'Critical';
      score = Math.max(0, 100 - (value - t.critical) * 20);
    } else if (value >= t.warning) {
      status = 'Warning';
      score = Math.max(30, 100 - (value - t.warning) * 10);
    } else {
      status = 'Healthy';
      score = Math.min(100, 90 + (t.warning - value) * 2);
    }
  } else {
    // CPU and Memory: higher values are worse (%)
    if (value >= t.critical) {
      status = 'Critical';
      score = Math.max(0, 100 - (value - t.critical) * 5);
    } else if (value >= t.warning) {
      status = 'Warning';
      score = Math.max(30, 100 - (value - t.warning) * 2);
    } else {
      status = 'Healthy';
      score = Math.min(100, 90 + (t.warning - value));
    }
  }

  return { status, score: Math.round(score) };
};

// --- Detail Card ---
const DetailCard = ({ icon: Icon, color, label, value }) => (
  <div className="bg-white p-3 rounded shadow-sm">
    <div className="flex items-center">
      <Icon className={`h-4 w-4 mr-2 text-${color}-500`} />
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
    </div>
  </div>
);

// --- Main Component ---
const SystemHealth = () => {
  const [cpuLoad, setCpuLoad] = useState(0);
  //const [memoryUsage, setMemoryUsage] = useState(0);
  const [networkData, setNetworkData] = useState({
    interface: "Loading...",
    rx_total: "0 MB",
    tx_total: "0 MB",
    rx_sec: "0 MB/s",
    tx_sec: "0 MB/s",
    rx_rate_mbps: 0,
    tx_rate_mbps: 0
  });
  const [refreshTime, setRefreshTime] = useState(new Date());

  const [thresholds, setThresholds] = useState(() => {
    const stored = localStorage.getItem('system_thresholds');
    return stored ? JSON.parse(stored) : DEFAULT_THRESHOLDS;
  });

  const [healthStatus, setHealthStatus] = useState({
    score: 85,
    components: [
      { name: 'CPU', status: 'Healthy', score: 90, icon: Cpu },
      { name: 'Memory', status: 'Healthy', score: 75, icon: MemoryStick },
      { name: 'Disk', status: 'Warning', score: 65, icon: AlertTriangle },
      { name: 'Network', status: 'Healthy', score: 95, icon: Wifi },
      { name: 'Security', status: 'Critical', score: 45, icon: XCircle },
      { name: 'Drivers', status: 'Healthy', score: 100, icon: ShieldCheck },
    ],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(65);
    
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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const responses = await Promise.all([
        fetch('http://localhost:3000/monitor/total/cpu'),
        fetch('http://localhost:3000/monitor/total/memory'),
        fetch('http://localhost:3000/monitor/total/network')
      ]);

      const [cpuResponse, memoryResponse, networkResponse] = responses;

      // CPU
      const cpuData = cpuResponse.ok ? await cpuResponse.json() : null;
      console.log("CPU Data:", cpuData);
      const cpuValue = cpuData?.totalUsage || 0;
      const cpuResult = getComponentHealth('CPU', cpuValue, thresholds);
      setCpuLoad(cpuValue);

      // Memory
      const memoryData = memoryResponse.ok ? await memoryResponse.json() : null;
      console.log(memoryData)
      const memoryValue = memoryData?.usagePercent || 0;
      const memoryResult = getComponentHealth('Memory', memoryValue, thresholds);
      setMemoryUsage(memoryValue);

      // Network
      const networkDataRaw = networkResponse.ok ? await networkResponse.json() : null;
      if (networkDataRaw) {
        // Convert KB/s to MB/s if necessary
        const rxRate = parseFloat(networkDataRaw.rx_sec) || 0;
        const txRate = parseFloat(networkDataRaw.tx_sec) || 0;
        const rxRateMbps = networkDataRaw.rx_sec.includes('KB') ? rxRate / 1000 : rxRate;
        const txRateMbps = networkDataRaw.tx_sec.includes('KB') ? txRate / 1000 : txRate;
        
        const networkResult = getComponentHealth('Network', Math.max(rxRateMbps, txRateMbps), thresholds);
        
        setNetworkData({
          interface: networkDataRaw.interface || "eth0",
          rx_total: networkDataRaw.rx_total || "0 MB",
          tx_total: networkDataRaw.tx_total || "0 MB",
          rx_sec: `${rxRateMbps.toFixed(2)} MB/s`,
          tx_sec: `${txRateMbps.toFixed(2)} MB/s`,
          rx_rate_mbps: rxRateMbps,
          tx_rate_mbps: txRateMbps
        });

        setHealthStatus(prev => {
          const updatedComponents = prev.components.map(component => {
            switch (component.name) {
              case 'CPU': return { ...component, ...cpuResult };
              case 'Memory': return { ...component, ...memoryResult };
              case 'Network': return { ...component, ...networkResult };
              default: return component;
            }
          });

          const newOverallScore = Math.round(
            updatedComponents.reduce((sum, c) => sum + c.score, 0) / updatedComponents.length
          );

          return { score: newOverallScore, components: updatedComponents };
        });
      } else {
        throw new Error('Network data fetch failed');
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setHealthStatus(prev => ({
        ...prev,
        score: 10,
        components: prev.components.map(c => ({ ...c, status: 'Critical', score: 10 }))
      }));
      setNetworkData({
        interface: "Error",
        rx_total: "N/A",
        tx_total: "N/A",
        rx_sec: "N/A",
        tx_sec: "N/A",
        rx_rate_mbps: 0,
        tx_rate_mbps: 0
      });
    } finally {
      setIsLoading(false);
      setRefreshTime(new Date());
    }
  }, [thresholds]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const healthDistribution = [
    { name: 'Healthy', value: healthStatus.components.filter(c => c.status === 'Healthy').length },
    { name: 'Warning', value: healthStatus.components.filter(c => c.status === 'Warning').length },
    { name: 'Critical', value: healthStatus.components.filter(c => c.status === 'Critical').length },
  ];

  const COLORS = ['#16a34a', '#f59e0b', '#dc2626'];

  const getStatusIcon = (status, Icon) => {
    const color = {
      Healthy: 'text-green-600',
      Warning: 'text-amber-600',
      Critical: 'text-red-600',
    }[status] || 'text-gray-400';
    return <Icon className={`h-5 w-5 ${color}`} />;
  };

  const getStatusColor = status => ({
    Healthy: 'text-green-600',
    Warning: 'text-amber-600',
    Critical: 'text-red-600',
  }[status] || 'text-gray-600');

  const getScoreColor = score =>
    score >= 80 ? 'text-green-600' : score >= 60 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-medium text-gray-800">System Health</h2>
        <span className="text-xs text-gray-500">
          Last updated: {refreshTime.toLocaleTimeString()}
        </span>
      </div>

      <div className="p-4">
        {/* Threshold Sliders */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Set Health Thresholds</h3>
          <ThresholdSlider metric="cpu" thresholds={thresholds} setThresholds={setThresholds} />
          <ThresholdSlider metric="memory" thresholds={thresholds} setThresholds={setThresholds} />
          <ThresholdSlider metric="network" thresholds={thresholds} setThresholds={setThresholds} />
        </div>

        {/* Chart + List */}
        {isLoading && healthStatus.score === 85 ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading initial health data...</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Pie Chart */}
            <div className="w-full md:w-1/3 flex items-center justify-center mb-4 md:mb-0">
              <div className="relative h-40 w-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthDistribution}
                      cx="50%" cy="50%" innerRadius={50} outerRadius={70}
                      paddingAngle={2} dataKey="value"
                    >
                      {healthDistribution.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
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

            {/* Component Cards */}
            <div className="w-full md:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {healthStatus.components.map(component => (
                  <div key={component.name} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="mr-3">
                      {getStatusIcon(component.status, component.icon || AlertTriangle)}
                    </div>
                    <div className="w-full">
                      <div className="text-sm font-medium">{component.name}</div>
                      <div className="flex items-center mt-1">
                        <div className="h-1.5 w-16 bg-gray-200 rounded-full mr-2 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              component.score >= 80 ? 'bg-green-500'
                              : component.score >= 60 ? 'bg-amber-500'
                              : 'bg-red-500'
                            }`}
                            style={{ width: `${component.score}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${getStatusColor(component.status)}`}>
                          {component.status}
                          {component.name === 'CPU' && ` (${cpuUsage})`}
                          {component.name === 'Memory' && ` (${memoryUsage})`}
                          {component.name === 'Network' && ` (${Math.max(networkData.rx_rate_mbps, networkData.tx_rate_mbps).toFixed(2)} MB/s)`}
                        </span>
                      </div>

                      {component.name === 'Network' && (
                        <div className="mt-2 pt-1 border-t border-gray-200 text-xs">
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
        )}
      </div>

      {/* Network Details */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-700 mb-3">Network Details ({networkData.interface})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <DetailCard icon={ArrowDownToLine} color="blue" label="Total Received" value={networkData.rx_total} />
          <DetailCard icon={ArrowUpFromLine} color="green" label="Total Sent" value={networkData.tx_total} />
          <DetailCard icon={ArrowDownToLine} color="blue" label="Down Speed" value={networkData.rx_sec} />
          <DetailCard icon={ArrowUpFromLine} color="green" label="Up Speed" value={networkData.tx_sec} />
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;