import { useState, useEffect } from 'react';
import { Download, RefreshCw, Shield, Clock, CheckCircle, AlertTriangle, Zap, Settings, Info, XCircle, ChevronDown, HelpCircle } from 'lucide-react';

// Import layout components
import Header from '../component/layout/Header';
import Sidebar from '../component/layout/Sidebar';

export default function UpdatesPage() {
  const [updates, setUpdates] = useState([]);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [updateProgress, setUpdateProgress] = useState({});
  const [systemInfo, setSystemInfo] = useState({
    lastChecked: new Date().toLocaleString(),
    lastUpdated: "2025-03-30 09:15 AM",
    totalSpace: "512 GB",
    availableSpace: "125 GB"
  });
  const [activeFilter, setActiveFilter] = useState("all");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [restartRequired, setRestartRequired] = useState(false); // Track if restart is needed

  // Simulate fetching updates
  useEffect(() => {
    const fetchUpdates = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUpdates = [
        {
          id: 1,
          name: "System Security Patch KB2023-45",
          type: "security",
          size: "245 MB",
          sizeInMb: 245,
          priority: "critical",
          description: "Critical security update addressing vulnerabilities in system core components. This update resolves multiple security vulnerabilities that could potentially allow remote code execution.",
          dateReleased: "2025-04-01",
          version: "1.2.45",
          publisher: "System Security Team",
          requiresRestart: true
        },
        {
          id: 2,
          name: "Graphics Driver Update v2.4.5",
          type: "driver",
          size: "325 MB",
          sizeInMb: 325,
          priority: "recommended",
          description: "Performance improvements for graphic intensive applications and games. This update enhances GPU resource management and fixes screen tearing issues in certain applications.",
          dateReleased: "2025-03-28",
          version: "2.4.5",
          publisher: "Graphics Solutions Inc.",
          requiresRestart: false
        },
        {
          id: 3,
          name: "Network Utility Enhancement",
          type: "utility",
          size: "78 MB",
          sizeInMb: 78,
          priority: "optional",
          description: "Improves Wi-Fi connection stability and overall network diagnostics. This update includes optimizations for handling high-bandwidth applications and improves connection reliability on public networks.",
          dateReleased: "2025-03-25",
          version: "3.0.2",
          publisher: "Network Technologies",
          requiresRestart: false
        },
        {
          id: 4,
          name: "System Optimization Pack",
          type: "performance",
          size: "156 MB",
          sizeInMb: 156,
          priority: "recommended",
          description: "Enhances system boot time and application responsiveness. This update introduces resource management improvements and memory optimizations for better overall system performance.",
          dateReleased: "2025-03-22",
          version: "4.1.0",
          publisher: "System Core Team",
          requiresRestart: true
        },
        {
          id: 5,
          name: "Audio Driver Update v3.1.2",
          type: "driver",
          size: "112 MB",
          sizeInMb: 112,
          priority: "optional",
          description: "Resolves audio stuttering issues in multimedia applications. This update fixes latency problems in audio processing and improves compatibility with virtual audio devices.",
          dateReleased: "2025-03-15",
          version: "3.1.2",
          publisher: "Audio Solutions",
          requiresRestart: false
        },
        {
          id: 6,
          name: "Antivirus Definitions Update",
          type: "security",
          size: "88 MB",
          sizeInMb: 88,
          priority: "critical",
          description: "Latest virus and malware definition updates to protect against emerging threats. This update adds detection patterns for recently discovered malware variants and improves threat scanning performance.",
          dateReleased: "2025-04-03",
          version: "25.4.3",
          publisher: "Security Shield Inc.",
          requiresRestart: false
        },
        {
          id: 7,
          name: "Keyboard Language Pack",
          type: "utility",
          size: "45 MB",
          sizeInMb: 45,
          priority: "optional",
          description: "Additional keyboard layouts and language support for international users. This update adds improved predictive text and autocorrection for multiple languages.",
          dateReleased: "2025-03-18",
          version: "2.3.0",
          publisher: "Input Systems",
          requiresRestart: false
        }
      ];
      
      const initialShowDetails = {};
      mockUpdates.forEach(update => {
        initialShowDetails[update.id] = false;
      });
      setShowDetails(initialShowDetails);
      
      setUpdates(mockUpdates);
      setIsLoading(false);
    };
    
    fetchUpdates();
  }, []);

  const filteredUpdates = updates.filter(update => {
    if (activeFilter === "all") return true;
    return update.priority === activeFilter || update.type === activeFilter;
  });

  const totalUpdateSize = filteredUpdates.reduce((total, update) => total + update.sizeInMb, 0);

  const handleInstallUpdate = async (updateId) => {
    setIsUpdating(true);
    setUpdateStatus(`Installing update...`);
    setUpdateProgress(prev => ({ ...prev, [updateId]: 0 }));
    
    const update = updates.find(u => u.id === updateId);
    const progressInterval = setInterval(() => {
      setUpdateProgress(prev => {
        const currentProgress = prev[updateId] || 0;
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          return prev;
        }
        return { ...prev, [updateId]: currentProgress + 10 };
      });
    }, 300);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setUpdateProgress(prev => ({ ...prev, [updateId]: 100 }));
      setUpdateStatus(`Update "${update.name}" installed successfully!`);
      
      if (update.requiresRestart) {
        setRestartRequired(true);
      }
      
      setTimeout(() => {
        setUpdates(updates.filter(u => u.id !== updateId));
        setUpdateProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[updateId];
          return newProgress;
        });
        setIsUpdating(false);
        
        setSystemInfo(prev => ({
          ...prev,
          lastUpdated: new Date().toLocaleString()
        }));
        
        setTimeout(() => setUpdateStatus(null), 2000);
      }, 1000);
    } catch (error) {
      clearInterval(progressInterval);
      setUpdateStatus(`Failed to install "${update.name}". Please try again.`);
      setUpdateProgress(prev => ({ ...prev, [updateId]: 0 }));
      setTimeout(() => setUpdateStatus(null), 3000);
    }
  };

  const handleInstallAll = async () => {
    if (filteredUpdates.length === 0) return;
    
    setIsUpdating(true);
    setUpdateStatus("Installing all updates...");
    
    const initialProgress = {};
    filteredUpdates.forEach(update => {
      initialProgress[update.id] = 0;
    });
    setUpdateProgress(initialProgress);
    
    for (const update of filteredUpdates) {
      setUpdateStatus(`Installing ${update.name}...`);
      
      const progressInterval = setInterval(() => {
        setUpdateProgress(prev => {
          const currentProgress = prev[update.id] || 0;
          if (currentProgress >= 100) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [update.id]: currentProgress + 10 };
        });
      }, 200);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        clearInterval(progressInterval);
        setUpdateProgress(prev => ({ ...prev, [update.id]: 100 }));
        
        if (update.requiresRestart) {
          setRestartRequired(true);
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        clearInterval(progressInterval);
        setUpdateStatus(`Failed to install ${update.name}.`);
        setTimeout(() => setUpdateStatus(null), 3000);
        continue;
      }
    }
    
    setUpdateStatus("All updates installed successfully!");
    setSystemInfo(prev => ({
      ...prev,
      lastUpdated: new Date().toLocaleString()
    }));
    
    setTimeout(() => {
      setUpdates(updates.filter(update => !filteredUpdates.includes(update)));
      setUpdateProgress({});
      setIsUpdating(false);
      
      setTimeout(() => setUpdateStatus(null), 2000);
    }, 1000);
  };

  const handleToggleAutoUpdate = () => {
    setAutoUpdateEnabled(!autoUpdateEnabled);
  };

  const handleToggleDetails = (updateId) => {
    setShowDetails(prev => ({
      ...prev,
      [updateId]: !prev[updateId]
    }));
  };

  const handleCheckForUpdates = async () => {
    setIsLoading(true);
    setUpdateStatus("Checking for updates...");
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSystemInfo(prev => ({
      ...prev,
      lastChecked: new Date().toLocaleString()
    }));
    
    setUpdateStatus("System is up to date");
    setIsLoading(false);
    
    setTimeout(() => setUpdateStatus(null), 3000);
  };

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'security':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'driver':
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      case 'utility':
        return <Download className="h-5 w-5 text-green-500" />;
      case 'performance':
        return <Zap className="h-5 w-5 text-purple-500" />;
      default:
        return <Download className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 font-medium">Critical</span>;
      case 'recommended':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">Recommended</span>;
      case 'optional':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium">Optional</span>;
      default:
        return null;
    }
  };

  const handleRestart = () => {
    setRestartRequired(false);
    setUpdateStatus("System restarting... (Simulated)");
    setTimeout(() => {
      setUpdateStatus("System restarted successfully!");
      setTimeout(() => setUpdateStatus(null), 2000);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={true} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header /> {/* Header component */}
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Updates Available</h1>
                  <p className="text-gray-600 mt-2">Keep your system secure and performing optimally with the latest updates</p>
                </div>
                <button 
                  onClick={handleCheckForUpdates}
                  disabled={isUpdating || isLoading}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check for Updates
                </button>
              </div>
              
              {/* System info banner */}
              <div className="mt-6 bg-white rounded-lg shadow-sm p-4 flex flex-wrap justify-between text-sm text-gray-600">
                <div className="flex items-center mr-6 mb-2">
                  <Info className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Last checked: {systemInfo.lastChecked}</span>
                </div>
                <div className="flex items-center mr-6 mb-2">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Last updated: {systemInfo.lastUpdated}</span>
                </div>
                <div className="flex items-center mr-6 mb-2">
                  <Shield className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Available space: {systemInfo.availableSpace} of {systemInfo.totalSpace}</span>
                </div>
                <button 
                  onClick={() => setShowInfoModal(true)}
                  className="text-blue-600 hover:text-blue-800 flex items-center mb-2"
                >
                  <HelpCircle className="h-4 w-4 mr-1" />
                  <span>About Updates</span>
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">System Updates</h2>
                        <p className="text-gray-600 text-sm">{filteredUpdates.length} updates available ({totalUpdateSize} MB)</p>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={handleInstallAll}
                          disabled={isUpdating || filteredUpdates.length === 0 || isLoading}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Install All
                        </button>
                      </div>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex border-b border-gray-200 mb-4">
                      <button 
                        className={`px-4 py-2 text-sm font-medium ${activeFilter === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => setActiveFilter('all')}
                      >
                        All
                      </button>
                      <button 
                        className={`px-4 py-2 text-sm font-medium ${activeFilter === 'critical' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => setActiveFilter('critical')}
                      >
                        Critical
                      </button>
                      <button 
                        className={`px-4 py-2 text-sm font-medium ${activeFilter === 'recommended' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => setActiveFilter('recommended')}
                      >
                        Recommended
                      </button>
                      <button 
                        className={`px-4 py-2 text-sm font-medium ${activeFilter === 'driver' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => setActiveFilter('driver')}
                      >
                        Drivers
                      </button>
                      <button 
                        className={`px-4 py-2 text-sm font-medium ${activeFilter === 'security' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => setActiveFilter('security')}
                      >
                        Security
                      </button>
                    </div>

                    {isLoading && !updateStatus ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      <>
                        {updateStatus && (
                          <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-md flex items-center">
                            {isUpdating ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            )}
                            <span>{updateStatus}</span>
                          </div>
                        )}

                        {restartRequired && (
                          <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            <span>A restart is required to complete the update. </span>
                            <button
                              onClick={handleRestart}
                              className="ml-2 text-yellow-600 hover:text-yellow-800 font-medium"
                            >
                              Restart Now
                            </button>
                          </div>
                        )}

                        {filteredUpdates.length === 0 && !isLoading ? (
                          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                            <p className="text-xl font-medium">Your system is up to date</p>
                            <p className="text-sm mt-2">All available updates have been installed</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {filteredUpdates.map((update) => (
                              <div 
                                key={update.id} 
                                className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
                              >
                                <div className="p-4 bg-white">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start">
                                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md mr-4">
                                        {getUpdateIcon(update.type)}
                                      </div>
                                      <div>
                                        <div className="flex items-center">
                                          <h3 className="text-base font-medium text-gray-900">{update.name}</h3>
                                          <div className="ml-2">{getPriorityBadge(update.priority)}</div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{update.description.split('.')[0]}.</p>
                                        <div className="flex items-center mt-2 text-xs text-gray-500">
                                          <span className="mr-3">Version: {update.version}</span>
                                          <span className="mr-3">Size: {update.size}</span>
                                          <span>Released: {new Date(update.dateReleased).toLocaleDateString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      {updateProgress[update.id] !== undefined && updateProgress[update.id] < 100 ? (
                                        <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                                          <div 
                                            className="bg-blue-600 h-2.5 rounded-full" 
                                            style={{ width: `${updateProgress[update.id]}%` }}
                                          ></div>
                                        </div>
                                      ) : updateProgress[update.id] === 100 ? (
                                        <span className="text-green-600 text-sm flex items-center">
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Complete
                                        </span>
                                      ) : (
                                        <button
                                          onClick={() => handleInstallUpdate(update.id)}
                                          disabled={isUpdating}
                                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                          Install
                                        </button>
                                      )}
                                      
                                      <button
                                        onClick={() => handleToggleDetails(update.id)}
                                        className="text-gray-400 hover:text-gray-600"
                                      >
                                        <ChevronDown 
                                          className={`h-5 w-5 transform transition-transform ${showDetails[update.id] ? 'rotate-180' : ''}`} 
                                        />
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {showDetails[update.id] && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                                      <p className="mb-2">{update.description}</p>
                                      <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div>
                                          <span className="font-medium">Publisher: </span>
                                          {update.publisher}
                                        </div>
                                        <div>
                                          <span className="font-medium">Type: </span>
                                          {update.type.charAt(0).toUpperCase() + update.type.slice(1)} Update
                                        </div>
                                        <div>
                                          <span className="font-medium">Install Size: </span>
                                          {update.size}
                                        </div>
                                        <div>
                                          <span className="font-medium">Release Date: </span>
                                          {new Date(update.dateReleased).toLocaleDateString()}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Update Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">Automatic Updates</h3>
                        <p className="text-xs text-gray-500 mt-1">Download and install updates automatically</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={autoUpdateEnabled}
                          onChange={handleToggleAutoUpdate}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-800">Update Frequency</h3>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input id="daily" name="frequency" type="radio" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                          <label htmlFor="daily" className="ml-2 block text-sm text-gray-700">Daily</label>
                        </div>
                        <div className="flex items-center">
                          <input id="weekly" name="frequency" type="radio" className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                          <label htmlFor="weekly" className="ml-2 block text-sm text-gray-700">Weekly</label>
                        </div>
                        <div className="flex items-center">
                          <input id="monthly" name="frequency" type="radio" className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                          <label htmlFor="monthly" className="ml-2 block text-sm text-gray-700">Monthly</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="font-medium text-gray-800 mb-3">Additional Options</h3>
                      
                      <div className="space-y-3">
                        <label className="flex items-start">
                          <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500" />
                          <span className="ml-2 block text-sm text-gray-700">Download over metered connections</span>
                        </label>
                        
                        <label className="flex items-start">
                          <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500" />
                          <span className="ml-2 block text-sm text-gray-700">Update notifications</span>
                        </label>
                        
                        <label className="flex items-start">
                          <input type="checkbox" className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500" />
                          <span className="ml-2 block text-sm text-gray-700">Restart after updates</span>
                        </label>
                        
                        <label className="flex items-start">
                          <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500" />
                          <span className="ml-2 block text-sm text-gray-700">Include driver updates</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {autoUpdateEnabled && (
                    <div className="mt-6 p-3 bg-blue-50 rounded-md flex items-start">
                      <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-800">
                        Your system will automatically check for and install updates based on your preferences. Critical security updates will be prioritized.
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Update History</h2>
                  <div className="space-y-3">
                    <div className="border-l-2 border-green-500 pl-3">
                      <p className="text-sm font-medium">System Security Update</p>
                      <p className="text-xs text-gray-500">Successfully installed on Mar 30, 2025</p>
                    </div>
                    <div className="border-l-2 border-green-500 pl-3">
                      <p className="text-sm font-medium">Audio Driver v3.0.8</p>
                      <p className="text-xs text-gray-500">Successfully installed on Mar 25, 2025</p>
                    </div>
                    <div className="border-l-2 border-green-500 pl-3">
                      <p className="text-sm font-medium">Performance Optimization</p>
                      <p className="text-xs text-gray-500">Successfully installed on Mar 18, 2025</p>
                    </div>
                    <div className="border-l-2 border-red-500 pl-3">
                      <p className="text-sm font-medium">Graphics Driver v2.3.0</p>
                      <p className="text-xs text-gray-500">Installation failed on Mar 15, 2025</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm mt-2">View all history</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* About Updates Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">About System Updates</h3>
              <button onClick={() => setShowInfoModal(false)} className="text-gray-400 hover:text-gray-500">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="text-gray-600 space-y-3 text-sm mb-6">
              <p>System updates are essential for maintaining the security, performance, and reliability of your computer. They include:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-medium">Security updates:</span> Protect against vulnerabilities and threats</li>
                <li><span className="font-medium">Driver updates:</span> Improve hardware compatibility and performance</li>
                <li><span className="font-medium">Performance updates:</span> Optimize system resources and speed</li>
                <li><span className="font-medium">Utility updates:</span> Enhance various system utilities and tools</li>
              </ul>
              <p>Keeping your system updated helps prevent security breaches, fix bugs, and ensure compatibility with new applications.</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}