const {app, BrowserWindow, Menu} = require('electron');
const {autoUpdater} = require("electron-updater");
const isDev = require('electron-is-dev');

let win;

function createWindow () {

  win = new BrowserWindow({
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

  win.webContents.once('dom-ready', () => {
    autoUpdater.checkForUpdates();
  })
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

function sendStatusToWindow(text) {
  console.log(text);
  win.webContents.send('AutoUpdateMessage', text);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for updates...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available. Update will be downloaded automaticly');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater.');
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded. Changes will turn to a power after program reboot.');
});

// Menu setup
function createMenu(){
  var menu = Menu.buildFromTemplate([
      {
          label: 'Menu',
              submenu: [
              {
                label:'About',
                click() {

                    let about_win = new BrowserWindow({
                      width: 700,
                      height: 620,
                      parent:win,
                      modal:true,
                      show:false,
                      title: "About",
                      resizable:false,
                      webPreferences: {
                        nodeIntegration: true
                      }
                    })

                    about_win.setMenuBarVisibility(false);

                    about_win.webContents.openDevTools();

                    about_win.loadFile('./html/about.html');

                    about_win.show();
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
