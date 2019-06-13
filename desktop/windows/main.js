const {
  app,
  BrowserWindow
} = require('electron')

const connection = require('dns')

let mainWindow
let onlineStatusWindow

 function createWindow  () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + './favicon.ico',
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.setMenuBarVisibility(false)
  mainWindow.loadURL('https://prototype.iotnxt.io/')
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

function createOfflineWindow  ()  {
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
  connection.lookup('www.google.com', function(err) {
    if (err) {
      createOfflineWindow()
    } else {
      createWindow()
    }
  })
 }
)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
