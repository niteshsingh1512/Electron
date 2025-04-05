// const { exec } = require('child_process');

// const cleanupBackgroundProcesses = async (req, res) => {
//   try {
//     const psList = (await import('ps-list')).default; // dynamically import ps-list

//     const processes = await psList();

//     const blacklist = ['notepad.exe', 'Calculator.exe']; // update as needed

//     const killed = [];

//     for (const proc of processes) {
//       if (blacklist.includes(proc.name)) {
//         exec(`taskkill /PID ${proc.pid} /F`, (err) => {
//           if (!err) {
//             console.log(`Killed ${proc.name} (PID: ${proc.pid})`);
//           }
//         });
//         killed.push({ name: proc.name, pid: proc.pid });
//       }
//     }

//     res.json({
//       message: 'Cleaned up background processes',
//       killed
//     });
//   } catch (error) {
//     console.error('Error cleaning processes:', error);
//     res.status(500).json({ error: 'Failed to clean up background processes' });
//   }
// };

// module.exports = { cleanupBackgroundProcesses };
