const {
  app,
  BrowserWindow
} = require('electron')

const connection = require('dns')
// const app = electron.app
if (handleSquirrelEvent(app)) {
  return
}

let mainWindow
let onlineStatusWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + './favicon.ico',
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.setMenuBarVisibility(false)
  mainWindow.loadURL('https://prototype.dev.iotnxt.io/')
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

function createOfflineWindow() {
  onlineStatusWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + './favicon.ico',
    webPreferences: {
      nodeIntegration: true
    }
  })
  onlineStatusWindow.setMenuBarVisibility(false)
  onlineStatusWindow.loadURL(`file://${__dirname}/online-status.html`)
  onlineStatusWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', funtion = () => {
  connection.lookup('www.google.com', function (err) {
    if (err) {
      createOfflineWindow()
    } else {
      createWindow()
    }
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

function handleSquirrelEvent(application) {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function (command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {
        detached: true
      });
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function (args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(application.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(application.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      application.quit();
      return true;
  }
};
