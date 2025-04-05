import { useState, useEffect } from 'react';
import { ActivitySquare, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const DiagnosticTool = () => {
  const [runningDiagnostic, setRunningDiagnostic] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState(null);
  const [progress, setProgress] = useState(0);

  const diagnosticAreas = [
    { name: 'System Performance', icon: <ActivitySquare className="mr-2" size={20} /> },
    { name: 'Software Issues', icon: <CheckCircle className="mr-2" size={20} /> },
    { name: 'Hardware Status', icon: <AlertTriangle className="mr-2" size={20} /> },
    { name: 'Network Configuration', icon: <XCircle className="mr-2" size={20} /> }
  ];

  const runDiagnostic = () => {
    setRunningDiagnostic(true);
    setProgress(0);
    setDiagnosticResults(null);

    // Simulate diagnostic progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRunningDiagnostic(false);
          generateMockResults();
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const generateMockResults = () => {
    // Mock diagnostic results
    const results = {
      systemPerformance: {
        status: 'warning',
        issues: [
          'High CPU usage (92%)',
          'Memory usage approaching threshold (85%)'
        ],
        recommendations: [
          'Close unused applications',
          'Check for resource-intensive background processes'
        ]
      },
      softwareIssues: {
        status: 'healthy',
        issues: [],
        recommendations: [
          'All software components are running properly'
        ]
      },
      hardwareStatus: {
        status: 'healthy',
        issues: [],
        recommendations: [
          'All hardware components are functioning correctly'
        ]
      },
      networkConfiguration: {
        status: 'critical',
        issues: [
          'DNS resolution delays',
          'Packet loss detected (8%)'
        ],
        recommendations: [
          'Reset network adapter',
          'Update network drivers',
          'Check for network interference'
        ]
      }
    };
    
    setDiagnosticResults(results);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="mr-2" size={20} />;
      case 'warning': return <AlertTriangle className="mr-2" size={20} />;
      case 'critical': return <XCircle className="mr-2" size={20} />;
      default: return <ActivitySquare className="mr-2" size={20} />;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">System Diagnostic Tool</h2>
      
      <div className="mb-6">
        <p className="mb-3 text-gray-600">Run a comprehensive diagnostic scan to identify and resolve system issues.</p>
        
        <button 
          onClick={runDiagnostic} 
          disabled={runningDiagnostic}
          className={`px-4 py-2 rounded font-medium ${runningDiagnostic ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {runningDiagnostic ? 'Running Diagnostic...' : 'Start Diagnostic'}
        </button>
      </div>

      {runningDiagnostic && (
        <div className="mb-6">
          <p className="mb-2 text-sm text-gray-600">Running diagnostic scan: {progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {diagnosticAreas.map((area, index) => (
              <div key={index} className="flex items-center px-4 py-3 border rounded-md">
                {area.icon}
                <span className="text-sm">{area.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {diagnosticResults && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Diagnostic Results</h3>
          
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <div className={`flex items-center mb-2 ${getStatusColor(diagnosticResults.systemPerformance.status)}`}>
                {getStatusIcon(diagnosticResults.systemPerformance.status)}
                <span className="font-medium">System Performance</span>
              </div>
              {diagnosticResults.systemPerformance.issues.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Issues:</p>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {diagnosticResults.systemPerformance.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {diagnosticResults.systemPerformance.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <div className={`flex items-center mb-2 ${getStatusColor(diagnosticResults.softwareIssues.status)}`}>
                {getStatusIcon(diagnosticResults.softwareIssues.status)}
                <span className="font-medium">Software Issues</span>
              </div>
              {diagnosticResults.softwareIssues.issues.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Issues:</p>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {diagnosticResults.softwareIssues.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {diagnosticResults.softwareIssues.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <div className={`flex items-center mb-2 ${getStatusColor(diagnosticResults.hardwareStatus.status)}`}>
                {getStatusIcon(diagnosticResults.hardwareStatus.status)}
                <span className="font-medium">Hardware Status</span>
              </div>
              {diagnosticResults.hardwareStatus.issues.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Issues:</p>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {diagnosticResults.hardwareStatus.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {diagnosticResults.hardwareStatus.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <div className={`flex items-center mb-2 ${getStatusColor(diagnosticResults.networkConfiguration.status)}`}>
                {getStatusIcon(diagnosticResults.networkConfiguration.status)}
                <span className="font-medium">Network Configuration</span>
              </div>
              {diagnosticResults.networkConfiguration.issues.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Issues:</p>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {diagnosticResults.networkConfiguration.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {diagnosticResults.networkConfiguration.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticTool;