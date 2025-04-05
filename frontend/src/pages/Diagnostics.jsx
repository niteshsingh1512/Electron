import { useState, useEffect } from 'react';
import { Activity, AlignLeft, CheckSquare, Filter, Search } from 'lucide-react';

// Import diagnostic components
import DiagnosticTool from '../component/diagnostics/DiagnosticTool';
import IssueDetails from '../component/diagnostics/IssueDetails';
import SolutionSteps from '../component/diagnostics/SolutionSteps';

// Import layout components
import Header from '../component/layout/Header';
import Sidebar from '../component/layout/Sidebar';

const Diagnostics = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeTab, setActiveTab] = useState('diagnostic-tool');
  
  // Mock issues data
  const issuesData = [
    {
      id: 'ISSUE-1234',
      title: 'High CPU Usage During System Startup',
      severity: 'Warning',
      status: 'Open',
      timestamp: '2025-04-02T14:30:00',
      category: 'System Performance'
    },
    {
      id: 'ISSUE-1235',
      title: 'Network Connectivity Dropping Intermittently',
      severity: 'Critical',
      status: 'Open',
      timestamp: '2025-04-01T09:15:00',
      category: 'Network Configuration'
    },
    {
      id: 'ISSUE-1236',
      title: 'System Memory Leak Detected',
      severity: 'Warning',
      status: 'In Progress',
      timestamp: '2025-03-30T16:45:00',
      category: 'Software Issues'
    },
    {
      id: 'ISSUE-1237',
      title: 'Graphics Driver Outdated',
      severity: 'Info',
      status: 'Open',
      timestamp: '2025-03-28T11:20:00',
      category: 'Hardware Status'
    },
    {
      id: 'ISSUE-1238',
      title: 'Disk Fragmentation Affecting Performance',
      severity: 'Warning',
      status: 'Resolved',
      timestamp: '2025-03-25T10:10:00',
      category: 'System Performance'
    }
  ];

  // Modified useEffect to only handle the case where we need to reset to diagnostic tool
  useEffect(() => {
    // Only reset to diagnostic tool if no issue is selected AND we're on a tab that requires an issue
    if (!selectedIssue && (activeTab === 'issue-details' || activeTab === 'solution-steps')) {
      setActiveTab('diagnostic-tool');
    }
  }, [selectedIssue, activeTab]);

  const filteredIssues = issuesData.filter(issue => 
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in progress': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
    setActiveTab('issue-details'); // Explicitly set the active tab when selecting an issue
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'diagnostic-tool':
        return (
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Detected Issues</h2>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search issues..."
                      className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="p-2 border rounded-md hover:bg-gray-50">
                    <Filter size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Reported</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredIssues.length > 0 ? (
                      filteredIssues.map((issue) => (
                        <tr 
                          key={issue.id} 
                          className="hover:bg-gray-50 cursor-pointer" 
                          onClick={(e) => {
                            e.preventDefault();
                            handleIssueSelect(issue);
                          }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{issue.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(issue.severity)}`}>
                              {issue.severity}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                              {issue.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(issue.timestamp)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIssueSelect(issue);
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                          No issues found matching your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <DiagnosticTool />
          </div>
        );
      case 'issue-details':
        if (!selectedIssue) {
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-500 mb-4">No issue selected.</p>
                <button 
                  onClick={() => setActiveTab('diagnostic-tool')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Go back to Diagnostic Tool
                </button>
              </div>
            </div>
          );
        }
        return (
          <IssueDetails 
            issue={selectedIssue} 
            onNavigateToSolution={() => setActiveTab('solution-steps')} 
          />
        );
      case 'solution-steps':
        if (!selectedIssue) {
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-500 mb-4">No issue selected.</p>
                <button 
                  onClick={() => setActiveTab('diagnostic-tool')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Go back to Diagnostic Tool
                </button>
              </div>
            </div>
          );
        }
        return (
          <SolutionSteps 
            issue={selectedIssue} 
            onBack={() => setActiveTab('issue-details')} 
          />
        );
      default:
        return <div>Unknown tab selected</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">System Diagnostics</h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tabs Navigation */}
            <div className="flex border-b">
              <button
                className={`px-4 py-3 text-sm font-medium flex items-center ${
                  activeTab === 'diagnostic-tool' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('diagnostic-tool')}
              >
                <Activity size={18} className="mr-2" />
                Diagnostic Tool
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium flex items-center ${
                  activeTab === 'issue-details' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => {
                  if (selectedIssue) setActiveTab('issue-details');
                }}
                disabled={!selectedIssue}
              >
                <AlignLeft size={18} className="mr-2" />
                Issue Details
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium flex items-center ${
                  activeTab === 'solution-steps' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => {
                  if (selectedIssue) setActiveTab('solution-steps');
                }}
                disabled={!selectedIssue}
              >
                <CheckSquare size={18} className="mr-2" />
                Solution Steps
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnostics;