const express = require('express');
const { exec } = require('child_process');
const router = express.Router();
const {
    getCpuUsage,
    getMemoryUsage,
    getDiskUsage,
    getNetworkUsage,
    getTotalCPUConsumption,
    getTotalMemoryConsumption,
    getTotalNetworkConsumption
  } = require('../Controller/TaskMonitor.js');
//   const {cleanupBackgroundProcesses} = require('../Controller/AlertController.js');
// const { getFirewallLogs } = require('../Controller/AlertController.js')
  
  router.get('/cpu', getCpuUsage)
  .get('/memory', getMemoryUsage)
  .get('/disk', getDiskUsage)
  .get('/network', getNetworkUsage)
  .get('/total/cpu', getTotalCPUConsumption)
  .get('/total/memory', getTotalMemoryConsumption)  
  .get('/total/network', getTotalNetworkConsumption)
//   .get('/clear/temp', cleanupBackgroundProcesses)
//   .get('/security/alert',getFirewallLogs)
  router.get('/diagnostics', (req, res) => {
  const command = `powershell -Command "Get-EventLog -LogName System -Newest 30 | Where-Object { $_.EntryType -eq 'Error' } | Select-Object -First 5 | ConvertTo-Json"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('PowerShell error:', stderr);
      return res.status(500).json({ error: 'Diagnostics command failed.' });
    }

    try {
      const parsedLogs = JSON.parse(stdout);
      const logs = Array.isArray(parsedLogs) ? parsedLogs : [parsedLogs];

      const issues = logs.map((log, index) => ({
        id: `SYS-${1000 + index}`,
        title: log.Message?.split('\n')[0] || 'Unknown System Error',
        severity: 'Critical',
        status: 'Open',
        timestamp: log.TimeGenerated || new Date().toISOString(),
        category: log.Source || 'System Error'
      }));

      res.json(issues);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(500).json({ error: 'Failed to parse diagnostic logs.' });
    }
  });
});


module.exports = router;
