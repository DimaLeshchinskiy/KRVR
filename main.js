const electron = require('electron');
const {app, BrowserWindow, Menu} = electron;
const {autoUpdater} = require("electron-updater");
const isDev = require('electron-is-dev');

function createWindow () {

  let win = new BrowserWindow({
    width: 1700,
    height: 1300,
    webPreferences: {
      nodeIntegration: true
    }
  })

  createMenu();

  win.loadFile('./html/index.html');

  if (isDev)
    win.webContents.openDevTools();

  autoUpdater.checkForUpdates();
}

function sendStatusToWindow(text) {
  console.log(text);
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


// Autoupdate definition

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});

// Menu setup
function createMenu(){
  var menu = Menu.buildFromTemplate([
      {
          label: 'Menu',
              submenu: [
              {
                label:'Visit our web',
                click() {
                    console.log("Web");
                }
              },
              {
                label:'Visit our shop',
                click() {
                    console.log("Shop");
                }
              },
              {
                label:'About',
                click() {
                    console.log("About");
                }
              },
              {type:'separator'},
              {
                  label:'Exit',
                  click() {
                      app.quit()
                  },
                  accelerator: 'CmdOrCtrl+Q'
              }
          ]
      }
    ]);

    Menu.setApplicationMenu(menu);
}
