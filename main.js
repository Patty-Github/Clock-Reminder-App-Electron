const { app, BrowserWindow, ipcMain, screen, Tray, Menu } = require('electron')
const path = require('path') // fix  UnhandledPromiseRejectionWarning: ReferenceError: path is not defined.

let mainDisplay = null;
let win;
let remindersWin;

const createWindow = () => {
    win = new BrowserWindow({
      width: 1000,
      height: 80,
      //width: 800,
      //height: 800,
      skipTaskbar: true,
      transparent: true,
      frame: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      }
    })

    mainDisplay = screen.getPrimaryDisplay();
    let mainDisplayDimensions = mainDisplay.workAreaSize;
    let mainDisplayWidth = mainDisplayDimensions.width;
    console.log(mainDisplayWidth);

    win.setAlwaysOnTop(true, 'screen-saver');

    win.setPosition(mainDisplayWidth - 1000, 0);

    win.setIgnoreMouseEvents(true, { forward: true });

    win.webContents.toggleDevTools(true);
  
    win.loadFile('index.html')

    ipcMain.handle('ignore-mouse-events-true', () => {
      win.setIgnoreMouseEvents(true, { forward: true });
    })

    ipcMain.handle('ignore-mouse-events-false', () => {
      win.setIgnoreMouseEvents(false, { forward: true });
    })
}

if(process.platform==='darwin') {
  app.dock.hide()
}

let tray;

app.whenReady().then(() => {

  tray = new Tray('images/begtodiffer.jpeg')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Settings', type: 'normal' },
    { label: 'Quit', type: 'normal', click: () => {app.quit()} }
  ])
  tray.setToolTip('Clock-Reminder-App')
  tray.setContextMenu(contextMenu)

  createWindow()

  //Noti
  ipcMain.on('change-div-text', (event, p) => {
    win.webContents.send('update-div', p);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

const createRemindersWindow = () => {
  remindersWin = new BrowserWindow({
    width: 600,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainDisplay = screen.getPrimaryDisplay();
  let mainDisplayDimensions = mainDisplay.workAreaSize;
  let mainDisplayWidth = mainDisplayDimensions.width;
  console.log(mainDisplayWidth);

  remindersWin.setPosition(mainDisplayWidth - 600, 100);

  remindersWin.setAlwaysOnTop(true);

  win.webContents.send('remove-reminder-p')

  remindersWin.loadFile('reminders.html');
}

ipcMain.handle('create-reminders-window', () => {
  createRemindersWindow()
})

ipcMain.on('remove-reminder-p', (p, pId) => {
  console.log('main log');
  win.webContents.send('remove-reminder-p-main', p, pId)
})