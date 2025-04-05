const express = require('express');
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


module.exports = router;
