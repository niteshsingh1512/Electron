// controllers/ProcessController.js
const { exec } = require('child_process');

const killProcesses = async (req, res) => {
  const processesToKill = ['notepad.exe','Postman.exe','wsl.exe','Docker Desktop.exe','WhatsApp.exe']; // Add your target processes here

  processesToKill.forEach((proc) => {
    exec(`taskkill /IM ${proc} /F`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error killing ${proc}:`, stderr);
      } else {
        console.log(`Successfully killed ${proc}:`, stdout);
      }
    });
  });

  res.json({ message: 'Requested processes terminated' });
};

module.exports = { killProcesses };
