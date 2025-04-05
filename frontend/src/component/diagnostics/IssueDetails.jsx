import { ArrowRight, Calendar, Tag, AlertCircle, HelpCircle } from 'lucide-react';

const IssueDetails = ({ issue, onNavigateToSolution }) => {
  if (!issue) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No issue selected. Please select an issue from the list.</p>
      </div>
    );
  }

  // Mock issue details data (would come from API in a real application)
  const issueDetails = {
    description: `This issue occurs when the system detects abnormally high CPU usage during the startup sequence. 
                 Multiple processes are consuming excessive resources, which leads to slow boot times and potential system instability.`,
    affectedComponents: ['System Kernel', 'Background Services', 'Startup Applications'],
    diagnosticResults: [
      { component: 'CPU Usage', status: 'Warning', value: '87%' },
      { component: 'Memory Usage', status: 'Normal', value: '42%' },
      { component: 'Disk I/O', status: 'Normal', value: '23 MB/s' },
      { component: 'Network', status: 'Normal', value: '1.2 MB/s' }
    ],
    recommendations: [
      'Review startup applications and disable unnecessary ones',
      'Check for recently installed software that might be causing high CPU usage',
      'Update system drivers to the latest version',
      'Run a full system scan for malware'
    ]
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': case 'critical': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-sm font-medium text-gray-500">{issue.id}</span>
          <h2 className="text-xl font-bold mt-1">{issue.title}</h2>
          <div className="flex items-center mt-2 space-x-4">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.severity)}`}>
              {issue.severity}
            </span>
            <span className="flex items-center text-sm text-gray-600">
              <Calendar size={14} className="mr-1" />
              {new Date(issue.timestamp).toLocaleString()}
            </span>
            <span className="flex items-center text-sm text-gray-600">
              <Tag size={14} className="mr-1" />
              {issue.category}
            </span>
          </div>
        </div>
        <button
          onClick={onNavigateToSolution}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          View Solution
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="font-medium mb-2">Issue Description</h3>
        <p className="text-gray-700">{issueDetails.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-md border">
          <h3 className="font-medium mb-3 flex items-center">
            <AlertCircle size={16} className="mr-2 text-red-500" />
            Affected Components
          </h3>
          <ul className="space-y-2">
            {issueDetails.affectedComponents.map((component, idx) => (
              <li key={idx} className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                {component}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded-md border">
          <h3 className="font-medium mb-3 flex items-center">
            <HelpCircle size={16} className="mr-2 text-blue-500" />
            Diagnostic Results
          </h3>
          <ul className="space-y-2">
            {issueDetails.diagnosticResults.map((result, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span>{result.component}</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(result.status)}`}>
                  {result.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-4 rounded-md border">
        <h3 className="font-medium mb-3">Recommendations</h3>
        <ul className="space-y-2">
          {issueDetails.recommendations.map((recommendation, idx) => (
            <li key={idx} className="flex items-start">
              <span className="font-bold mr-2">{idx + 1}.</span>
              {recommendation}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default IssueDetails;