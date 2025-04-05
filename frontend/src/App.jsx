import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import the consolidated page components
import Dashboard from './pages/Dashboard';
import Diagnostics from './pages/Diagnostics';
import Security from './pages/Security';
import SystemPerformance from './pages/SystemPerformance';
import DigitalWellbeing from './pages/DigitalWellbeing'; // Matches "CPU & Memory" in Sidebar
import UpdatesPage from './pages/UpdatesPage';
import AiHelp from './pages/AiHelp';

// Dashboard sub-components for direct access routes
import QuickActions from './component/dashboard/QuickActions.jsx';
import RecentIssues from './component/dashboard/RecentIssues.jsx';
import ResourceUsages from './component/dashboard/ResourceUsages.jsx';
import SystemHealth from './component/dashboard/SystemHealth.jsx';

// Diagnostics sub-components for direct access routes
import DiagnosticTool from './component/diagnostics/DiagnosticTool.jsx';
import IssueDetails from './component/diagnostics/IssueDetails.jsx';
import SolutionSteps from './component/diagnostics/SolutionSteps.jsx';

// Security sub-components - corrected import paths
import MalwareProtection from './component/security/MalwareProtection.jsx';
import SecurityAlerts from './component/security/SecurityAlerts.jsx';
import VulnerabilityScanner from './component/security/VulnerabilityScanner.jsx';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/diagnostics" element={<Diagnostics />} />
        <Route path="/security" element={<Security />} />
        <Route path="/monitoring/system-performance" element={<SystemPerformance />} />
        <Route path="/monitoring/digital-wellbeing" element={<DigitalWellbeing />} /> {/* Matches "CPU & Memory" redirect */}
        <Route path="/monitoring/command-center" element={<UpdatesPage />} /> {/* Matches "Updates" redirect */}
        <Route path="/monitoring/process-monitor" element={<AiHelp />} /> {/* Matches "AI Help" redirect */}
        {/* <Route path="/reports" element={<Reports />} /> */}
        {/* <Route path="/settings" element={<Settings />} /> */}
        
        {/* Dashboard sub-component routes (if needed for direct access) */}
        <Route path="/dashboard/actions" element={<QuickActions />} />
        <Route path="/dashboard/issues" element={<RecentIssues />} />
        <Route path="/dashboard/resources" element={<ResourceUsages />} />
        <Route path="/dashboard/health" element={<SystemHealth />} />
        
        {/* Diagnostics sub-component routes (if needed for direct access) */}
        <Route path="/diagnostics/tool" element={<DiagnosticTool />} />
        <Route path="/diagnostics/issue/:issueId" element={<IssueDetails />} />
        <Route path="/diagnostics/solution/:issueId" element={<SolutionSteps />} />
        
        {/* Security sub-component routes (for direct access) */}
        <Route path="/security/malware" element={<MalwareProtection />} />
        <Route path="/security/alerts" element={<SecurityAlerts />} />
        <Route path="/security/vulnerabilities" element={<VulnerabilityScanner />} />
        
        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;