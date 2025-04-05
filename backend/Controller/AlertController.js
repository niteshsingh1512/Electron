// const fs = require('fs');
// const path = require('path');

// const FIREWALL_LOG_PATH = 'C:\\Windows\\System32\\LogFiles\\Firewall\\pfirewall.log'; // or your custom path

// exports.getFirewallLogs = async (req, res) => {
//   try {
//     if (!fs.existsSync(FIREWALL_LOG_PATH)) {
//       return res.status(404).json({ success: false, message: 'Firewall log not found. Is logging enabled?' });
//     }

//     const logData = fs.readFileSync(FIREWALL_LOG_PATH, 'utf8');
//     res.json({ success: true, log: logData });
//   } catch (err) {
//     console.error('Error reading firewall log:', err);
//     res.status(500).json({ success: false, message: 'Error reading firewall log', error: err.message });
//   }
// };
