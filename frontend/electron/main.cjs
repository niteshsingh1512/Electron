const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      contextIsolation: true,
    },
  });
  win.webContents.openDevTools();
  // Load from localhost in dev, or local file in production
  const startUrl = process.env.VITE_DEV_SERVER_URL ||  'http://localhost:5173'
  win.loadURL(startUrl);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
