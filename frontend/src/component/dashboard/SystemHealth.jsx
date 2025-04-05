import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldCheck, AlertTriangle, XCircle } from 'lucide-react';

const SystemHealth = () => {
  // System health metrics
  const healthStatus = {
    score: 85,
    components: [
      { name: 'CPU', status: 'Healthy', score: 90 },
      { name: 'Memory', status: 'Healthy', score: 75 },
      { name: 'Disk', status: 'Warning', score: 65 },
      { name: 'Network', status: 'Healthy', score: 95 },
      { name: 'Security', status: 'Critical', score: 45 },
      { name: 'Drivers', status: 'Healthy', score: 100 },
    ],
  };

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
                  <div>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;