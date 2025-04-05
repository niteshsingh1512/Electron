const express = require('express');
const os = require('os');
const dotenv = require('dotenv');
const connectDB = require('./Config/db');
const cors=require('cors');

dotenv.config();
connectDB();
 
// const fs = require('fs');
// const logPath = 'C:\\Windows\\System32\\LogFiles\\Firewall\\pfirewall.log';

// fs.readFile(logPath, 'utf8', (err, data) => {
//   if (err) return console.error('Error reading firewall log:', err);
//   console.log('Firewall Log Contents:\n', data);
// });

const app = express();
const PORT = 3000;

const cron = require('node-cron');
const { saveUsageToDB } = require('./Controller/TaskMonitor.js');

cron.schedule('* * * * *', async () => {
  await saveUsageToDB();
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  const osInfo = {
    platform: os.platform(),
    arch: os.arch(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    uptime: os.uptime(),
    hostname: os.hostname(),
    type: os.type(),
    release: os.release(),
  };
  res.json(osInfo);
});

const monitorRoutes = require('./Routes/Monitor.route.js');

app.use('/monitor', monitorRoutes);
  
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
