const pidusage = require('pidusage');
const si = require('systeminformation');
const AppUsage = require('../Models/AppUsage'); // Adjust path as per your project structure

// const psList = require('ps-list');

const nameMap = {
  'chrome.exe': 'Google Chrome',
  'Code.exe': 'VS Code',
  'WhatsApp.exe': 'WhatsApp',
  'Docker Desktop.exe': 'Docker',
  'explorer.exe': 'File Explorer',
  'Teams.exe': 'Microsoft Teams',
  'cmd.exe': 'Command Prompt',
  'node.exe': 'Node.js',
  'powershell.exe': 'PowerShell',
  'OneDrive.exe': 'OneDrive'
};

const filterProcesses = async () => {
    const psListFn = await import('ps-list');
    const processes = await psListFn.default();
    return processes.filter(proc =>
      proc.name &&
      proc.pid > 0 &&
      !proc.name.toLowerCase().includes('system') &&
      !proc.name.toLowerCase().includes('idle')
    );
  };
  

const getCpuUsage = async (req, res) => {
  try {
    const processes = await filterProcesses();
    const usageData = await pidusage(processes.map(p => p.pid));

    const appMap = {};

    processes.forEach(proc => {
      const name = nameMap[proc.name] || proc.name;
      const usage = usageData[proc.pid];
      if (!usage || typeof usage.cpu !== 'number') return;

      if (!appMap[name]) {
        appMap[name] = { name, cpu: 0, processes: 0 };
      }

      appMap[name].cpu += usage.cpu;
      appMap[name].processes += 1;
    });

    const totalCPU = Object.values(appMap).reduce((sum, app) => sum + app.cpu, 0);

    const result = Object.values(appMap).map(app => ({
      name: app.name,
      cpu: totalCPU > 0 ? ((app.cpu / totalCPU) * 100).toFixed(2) + '%' : '0%',
      processes: app.processes
    }));

    res.json(result.sort((a, b) => parseFloat(b.cpu) - parseFloat(a.cpu)).slice(0, 20));
  } catch (error) {
    console.error('CPU error:', error);
    res.status(500).json({ error: 'CPU usage failed' });
  }
};

const getMemoryUsage = async (req, res) => {
  try {
    const processes = await filterProcesses();
    const usageData = await pidusage(processes.map(p => p.pid));

    const appMap = {};

    processes.forEach(proc => {
      const name = nameMap[proc.name] || proc.name;
      const usage = usageData[proc.pid];
      if (!usage || typeof usage.memory !== 'number' || isNaN(usage.memory)) return;

      if (!appMap[name]) {
        appMap[name] = { name, memory: 0, processes: 0 };
      }

      appMap[name].memory += usage.memory;
      appMap[name].processes += 1;
    });

    const result = Object.values(appMap).map(app => ({
      name: app.name,
      memory: (app.memory / 1e6).toFixed(2) + ' MB',
      processes: app.processes
    }));

    res.json(result.sort((a, b) => parseFloat(b.memory) - parseFloat(a.memory)).slice(0, 20));
  } catch (error) {
    console.error('Memory error:', error);
    res.status(500).json({ error: 'Memory usage failed' });
  }
};

const getDiskUsage = async (req, res) => {
  try {
    const processes = await filterProcesses();
    const ioStats = await si.processes();

    const appMap = {};

    ioStats.list.forEach(proc => {
      const match = processes.find(p => p.pid === proc.pid);
      if (!match) return;

      const name = nameMap[match.name] || match.name;
      if (!proc.io_read || !proc.io_write) return;

      if (!appMap[name]) {
        appMap[name] = { name, disk: 0, processes: 0 };
      }

      const totalIO = proc.io_read + proc.io_write;
      appMap[name].disk += totalIO;
      appMap[name].processes += 1;
    });

    const result = Object.values(appMap).map(app => ({
      name: app.name,
      disk: (app.disk / 1e6).toFixed(2) + ' MB',
      processes: app.processes
    }));

    res.json(result.sort((a, b) => parseFloat(b.disk) - parseFloat(a.disk)).slice(0, 20));
  } catch (error) {
    console.error('Disk error:', error);
    res.status(500).json({ error: 'Disk usage failed' });
  }
};

const getNetworkUsage = async (req, res) => {
  try {
    const processes = await filterProcesses();
    const netStats = await si.networkConnections();
    const appMap = {};

    netStats.forEach(net => {
      const proc = processes.find(p => p.pid === net.pid);
      if (!proc) return;

      const name = nameMap[proc.name] || proc.name;

      if (!appMap[name]) {
        appMap[name] = { name, connections: 0, processes: 0 };
      }

      appMap[name].connections += 1;
      appMap[name].processes += 1;
    });

    const result = Object.values(appMap).map(app => ({
      name: app.name,
      network: `${app.connections} connections`,
      processes: app.processes
    }));

    res.json(result.sort((a, b) => b.processes - a.processes).slice(0, 20));
  } catch (error) {
    console.error('Network error:', error);
    res.status(500).json({ error: 'Network usage failed' });
  }
};

const getTotalCPUConsumption = async (req, res) => {
    try {
      const load = await si.currentLoad();
      console.log('Load data:', load); // See what's inside
  
      // Check if currentload exists and is a number
      if (load && typeof load.currentload === 'number') {
        const totalUsage = load.currentload.toFixed(2) + '%';
        return res.json({ totalUsage });
      }
  
      // Fallback: average of all cores
      if (Array.isArray(load.cpus)) {
        const avg = load.cpus.reduce((sum, cpu) => sum + cpu.load, 0) / load.cpus.length;
        return res.json({ totalUsage: avg.toFixed(2) + '%' });
      }
  
      res.status(500).json({ error: 'Could not determine CPU usage' });
    } catch (error) {
      console.error('Error fetching total CPU usage:', error);
      res.status(500).json({ error: 'Failed to fetch total CPU usage' });
    }
  };
  
  
  const getTotalMemoryConsumption = async (req, res) => {
    try {
      const mem = await si.mem();
      console.log("Memory Data:", mem);
  
      if (!mem || typeof mem.total !== 'number' || mem.total === 0) {
        return res.json({ totalUsage: "N/A" });
      }
  
      const usagePercent = ((mem.active / mem.total) * 100).toFixed(2) + '%';
  
      res.json({
        total: (mem.total / 1e9).toFixed(2) + ' GB',
        used: (mem.active / 1e9).toFixed(2) + ' GB',
        free: (mem.available / 1e9).toFixed(2) + ' GB',
        usagePercent
      });
    } catch (error) {
      console.error('Error fetching total memory usage:', error);
      res.status(500).json({ error: 'Failed to fetch memory usage' });
    }
  };
  
  const getTotalNetworkConsumption = async (req, res) => {
    try {
      const stats = await si.networkStats();
      console.log("Network Stats:", stats);
  
      if (!stats || stats.length === 0 || !stats[0]) {
        return res.json({ totalUsage: "N/A" });
      }
  
      const networkData = stats[0];
  
      res.json({
        interface: networkData.iface || "Unknown",
        rx_total: (networkData.rx_bytes / 1e6).toFixed(2) + ' MB',
        tx_total: (networkData.tx_bytes / 1e6).toFixed(2) + ' MB',
        rx_sec: (networkData.rx_sec / 1e3).toFixed(2) + ' KB/s',
        tx_sec: (networkData.tx_sec / 1e3).toFixed(2) + ' KB/s'
      });
    } catch (error) {
      console.error('Error fetching total network usage:', error);
      res.status(500).json({ error: 'Failed to fetch network usage' });
    }
  };

  const saveUsageToDB = async () => {
    try {
      const processes = await filterProcesses();
      const usageData = await pidusage(processes.map(p => p.pid));
      const diskStats = await si.processes();
      const networkStats = await si.networkConnections();
      const timestamp = new Date();
  
      const aggregatedData = {};
  
      for (const proc of processes) {
        const displayName = nameMap[proc.name];
        if (!displayName) continue;
  
        const usage = usageData[proc.pid];
        if (!usage) continue;
  
        const diskInfo = diskStats.list.find(d => d.pid === proc.pid);
        const netInfo = networkStats.find(n => n.pid === proc.pid);
  
        if (!aggregatedData[displayName]) {
          aggregatedData[displayName] = {
            cpu: 0,
            memory: 0,
            disk: 0,
            network: 0
          };
        }
  
        if (!isNaN(usage.cpu)) {
          aggregatedData[displayName].cpu += usage.cpu;
        }
        if (!isNaN(usage.memory)) {
          aggregatedData[displayName].memory += usage.memory / 1e6; // Convert to MB
        }
        if (diskInfo) {
          aggregatedData[displayName].disk += (diskInfo.io_read + diskInfo.io_write) / 1e6; // Convert to MB
        }
        if (netInfo) {
          aggregatedData[displayName].network += 1; // Presence of connection
        }
      }
  
      for (const [appName, usage] of Object.entries(aggregatedData)) {
        const pushPayload = {};
        if (usage.cpu > 0) pushPayload['cpu'] = { timestamp, value: usage.cpu };
        if (usage.memory > 0) pushPayload['memory'] = { timestamp, value: usage.memory };
        if (usage.disk > 0) pushPayload['disk'] = { timestamp, value: usage.disk };
        if (usage.network > 0) pushPayload['network'] = { timestamp, value: usage.network };
  
        if (Object.keys(pushPayload).length > 0) {
          // Use $push for arrays, optionally with $each and $slice to limit size
          const pushOps = Object.fromEntries(
            Object.entries(pushPayload).map(([key, val]) => [
              key,
              { $each: [val], $slice: -100 } // Keep only last 100 entries
            ])
          );
  
          await AppUsage.findOneAndUpdate(
            { name: appName },
            { $push: pushOps },
            { upsert: true, new: true }
          );
        }
      }
  
      console.log('Aggregated usage saved.');
    } catch (err) {
      console.error('Error saving usage:', err);
    }
  };
module.exports = {
  getCpuUsage,
  getMemoryUsage,
  getDiskUsage,
  getNetworkUsage,
  getTotalCPUConsumption,
  getTotalMemoryConsumption,
  getTotalNetworkConsumption,
  saveUsageToDB
};
