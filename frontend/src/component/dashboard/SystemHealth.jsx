import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  ShieldCheck, AlertTriangle, XCircle, Wifi,
  ArrowDownToLine, ArrowUpFromLine, Cpu, MemoryStick
} from 'lucide-react';
import { Slider } from '@mui/material'; // MUI Slider

// --- Default Threshold Config ---
const DEFAULT_THRESHOLDS = {
  cpu: { warning: 70, critical: 90 },
  memory: { warning: 75, critical: 90 },
  network: { warning: 2, critical: 0.5 },
};

// --- Threshold Slider Component ---
const ThresholdSlider = ({ metric, thresholds, setThresholds }) => {
  const [value, setValue] = useState([
    thresholds?.[metric]?.warning || 70,
    thresholds?.[metric]?.critical || 90,
  ]);

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
      <label className="text-sm font-semibold mb-1 block capitalize">{metric} Thresholds</label>
      <Slider
        value={value}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        valueLabelDisplay="auto"
        min={0}
        max={metric === 'network' ? 10 : 100}
        step={metric === 'network' ? 0.1 : 1}
        marks={[
          { value: value[0], label: 'Warning' },
          { value: value[1], label: 'Critical' },
        ]}
      />
    </div>
  );
};

// --- Health Calculation ---
const getComponentHealth = (name, value, thresholds) => {
  const t = thresholds[name.toLowerCase()];
  if (!t) return { status: 'Healthy', score: 85 };

  let status = 'Healthy';
  let score;

  if (name.toLowerCase() === 'network') {
    if (value < t.critical) {
      status = 'Critical';
      score = 30;
    } else if (value < t.warning) {
      status = 'Warning';
      score = 65;
    } else {
      status = 'Healthy';
      score = 95;
    }
  } else {
    if (value >= t.critical) {
      status = 'Critical';
      score = Math.max(0, 100 - value * 1.5);
    } else if (value >= t.warning) {
      status = 'Warning';
      score = Math.max(20, 100 - value);
    } else {
      status = 'Healthy';
      score = Math.max(50, 100 - value * 0.5);
    }
    score = Math.round(score);
  }

  return { status, score };
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
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [networkData, setNetworkData] = useState({
    interface: "Loading...",
    rx_total: "0 MB",
    tx_total: "0 MB",
    rx_sec: "0 KB/s",
    tx_sec: "0 KB/s",
    rx_rate_kbps: 0
  });

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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    let cpuResult = null;
    let memoryResult = null;
    let networkResult = null;

    try {
      const responses = await Promise.all([
        fetch('http://localhost:3000/monitor/total/cpu'),
        fetch('http://localhost:3000/monitor/total/memory'),
        fetch('http://localhost:3000/monitor/total/network')
      ]);

      if (responses[0] && responses[0].ok) {
        const data = await responses[0].json();
        cpuResult = getComponentHealth('CPU', data.currentLoad || 0, thresholds);
        setCpuLoad(data.currentLoad || 0);
      } else {
        cpuResult = { status: 'Critical', score: 10 };
        setCpuLoad(0);
      }

      if (responses[1] && responses[1].ok) {
        const data = await responses[1].json();
        memoryResult = getComponentHealth('Memory', data.usedPercent || 0, thresholds);
        setMemoryUsage(data.usedPercent || 0);
      } else {
        memoryResult = { status: 'Critical', score: 10 };
        setMemoryUsage(0);
      }

      if (responses[2] && responses[2].ok) {
        const data = await responses[2].json();
        const rxRate = parseFloat(data.rx_sec) || 0;
        networkResult = getComponentHealth('Network', rxRate, thresholds);
        setNetworkData({ ...data, rx_rate_kbps: rxRate });
      } else {
        networkResult = { status: 'Critical', score: 10 };
        setNetworkData(prev => ({ ...prev, interface: "Error", rx_sec: "N/A", tx_sec: "N/A", rx_rate_kbps: 0 }));
      }

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

    } catch (err) {
      console.error("Fetch error:", err);
      setHealthStatus(prev => ({
        ...prev,
        score: 10,
        components: prev.components.map(c => ({ ...c, status: 'Critical', score: 10 }))
      }));
    } finally {
      setIsLoading(false);
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
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="font-medium text-gray-800">System Health</h2>
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
                          {component.name === 'CPU' && ` (${cpuLoad.toFixed(1)}%)`}
                          {component.name === 'Memory' && ` (${memoryUsage.toFixed(1)}%)`}
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
