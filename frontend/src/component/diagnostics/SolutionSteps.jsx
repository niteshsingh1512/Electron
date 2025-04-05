import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const SolutionSteps = ({ issue, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  if (!issue) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No issue selected. Please select an issue first.</p>
      </div>
    );
  }

  // Mock solution steps data (would come from API in a real application)
  const solutionSteps = [
    {
      title: 'Analyze Startup Applications',
      description: 'Identify which applications are causing high CPU usage during startup.',
      instructions: [
        'Open Task Manager by pressing Ctrl+Shift+Esc',
        'Go to the Startup tab',
        'Check the "Startup impact" column to identify high-impact applications',
        'Disable non-essential applications with high impact by right-clicking and selecting "Disable"'
      ],
      additionalInfo: 'Disabling startup applications will not uninstall them. You can still run these applications manually after startup.'
    },
    {
      title: 'Update System Drivers',
      description: 'Outdated drivers can cause system performance issues, including high CPU usage.',
      instructions: [
        'Open Device Manager by pressing Win+X and selecting "Device Manager"',
        'Expand each category and look for devices with warning icons',
        'Right-click on any device with a warning icon and select "Update driver"',
        'Choose "Search automatically for updated driver software"'
      ],
      additionalInfo: 'You may need to restart your computer after updating drivers for the changes to take effect.'
    },
    {
      title: 'Run System Maintenance',
      description: 'Perform system maintenance tasks to optimize performance.',
      instructions: [
        'Open Control Panel and navigate to "System and Security"',
        'Click on "Security and Maintenance"',
        'Expand the "Maintenance" section',
        'Click "Start maintenance" under "Automatic Maintenance"'
      ],
      additionalInfo: 'The maintenance process may take some time to complete. Your computer might perform slower during this process.'
    },
    {
      title: 'Check for Malware',
      description: 'Scan your system for malware that could be causing high CPU usage.',
      instructions: [
        'Open Windows Security by clicking on the shield icon in the system tray',
        'Go to "Virus & threat protection"',
        'Click "Scan options" and select "Full scan"',
        'Click "Scan now" and wait for the scan to complete'
      ],
      additionalInfo: 'If malware is found, follow the recommended actions to remove it. You may need to restart your computer afterward.'
    }
  ];

  const handleNextStep = () => {
    if (currentStep < solutionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleStepCompletion = (stepIndex) => {
    if (completedSteps.includes(stepIndex)) {
      setCompletedSteps(completedSteps.filter((step) => step !== stepIndex));
    } else {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Issue Details
          </button>
          <h2 className="text-xl font-bold mt-3">Solution for: {issue.title}</h2>
        </div>
        <div className="text-sm">
          {completedSteps.length} of {solutionSteps.length} steps completed
        </div>
      </div>

      <div className="flex mb-6">
        <div className="w-1/4 pr-6">
          <div className="bg-white rounded-md border overflow-hidden">
            <div className="p-3 bg-gray-50 border-b">
              <h3 className="font-medium">Solution Steps</h3>
            </div>
            <ul>
              {solutionSteps.map((step, idx) => (
                <li 
                  key={idx}
                  className={`
                    border-b last:border-b-0 cursor-pointer hover:bg-gray-50
                    ${currentStep === idx ? 'bg-blue-50' : ''}
                  `}
                  onClick={() => setCurrentStep(idx)}
                >
                  <div className="p-3 flex items-center">
                    <div className={`
                      flex-shrink-0 w-6 h-6 rounded-full mr-3 flex items-center justify-center
                      ${completedSteps.includes(idx) 
                        ? 'bg-green-100 text-green-600' 
                        : currentStep > idx 
                          ? 'bg-gray-200 text-gray-600' 
                          : 'bg-blue-100 text-blue-600'
                      }
                    `}>
                      {completedSteps.includes(idx) ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <span className="text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${completedSteps.includes(idx) ? 'line-through text-gray-500' : ''}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-3/4 bg-white rounded-md border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">{`Step ${currentStep + 1}: ${solutionSteps[currentStep].title}`}</h3>
            <div className="flex items-center">
              <button
                className={`
                  flex items-center px-3 py-1 rounded-md mr-2 
                  ${completedSteps.includes(currentStep) 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }
                `}
                onClick={() => toggleStepCompletion(currentStep)}
              >
                {completedSteps.includes(currentStep) ? (
                  <>
                    <CheckCircle2 size={16} className="mr-1" />
                    Completed
                  </>
                ) : (
                  'Mark as Completed'
                )}
              </button>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{solutionSteps[currentStep].description}</p>

          <div className="mb-6">
            <h4 className="font-medium mb-2">Instructions:</h4>
            <ol className="list-decimal pl-5 space-y-2">
              {solutionSteps[currentStep].instructions.map((instruction, idx) => (
                <li key={idx}>{instruction}</li>
              ))}
            </ol>
          </div>

          {solutionSteps[currentStep].additionalInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start">
              <Info size={20} className="text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-blue-800 text-sm">{solutionSteps[currentStep].additionalInfo}</p>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePreviousStep}
              disabled={currentStep === 0}
              className={`
                px-4 py-2 rounded-md flex items-center
                ${currentStep === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <ArrowLeft size={16} className="mr-2" />
              Previous Step
            </button>
            <button
              onClick={handleNextStep}
              disabled={currentStep === solutionSteps.length - 1}
              className={`
                px-4 py-2 rounded-md flex items-center
                ${currentStep === solutionSteps.length - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              Next Step
              <ArrowLeft size={16} className="ml-2 transform rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionSteps;