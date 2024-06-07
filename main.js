const { app, BrowserWindow, ipcMain, screen, Tray, Menu } = require('electron')
const path = require('path') // fix  UnhandledPromiseRejectionWarning: ReferenceError: path is not defined.

let mainDisplay = null;
let win;
let remindersWin;
let isRemindersWinMinimized = true;
let isRemindersWinClosed = false;

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

    win.setAlwaysOnTop(true, 'screen-saver');

    win.setPosition(mainDisplayWidth - 1000, 0);

    win.setIgnoreMouseEvents(true, { forward: true });

    //win.webContents.toggleDevTools(true);
  
    win.loadFile('index.html')

    ipcMain.handle('ignore-mouse-events-true', () => {
      win.setIgnoreMouseEvents(true, { forward: true });
    })

    ipcMain.handle('ignore-mouse-events-false', () => {
      win.setIgnoreMouseEvents(false, { forward: true });
    })
}

//if(process.platform==='darwin') {
//  app.dock.hide()
//}

let tray;

app.whenReady().then(() => {

  tray = new Tray('images/begtodiffer.jpeg')
  const contextMenu = Menu.buildFromTemplate([
    { label: '+1px', type: 'normal', click: () => {win.webContents.send('update-font-size', 1); tray.popUpContextMenu(contextMenu)}},
    { label: '-1px', type: 'normal', click: () => {win.webContents.send('update-font-size', -1); tray.popUpContextMenu(contextMenu)}},
    { label: 'Quit', type: 'normal', click: () => {app.quit();} }
  ])
  tray.setToolTip('Clock-Reminder-App')
  tray.setContextMenu(contextMenu)

  createWindow()

  createRemindersWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

let canQuit = false;

app.on('before-quit', (event) => {
  if(canQuit) {
    return;
  }

  event.preventDefault();
  canQuit = true;
  setTimeout(() => {win.webContents.send('remove-reminder-p-main', pId)}, 100)
  app.quit()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

const createRemindersWindow = () => {
  remindersWin = new BrowserWindow({
    width: 600,
    height: 800,
    skipTaskbar: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainDisplay = screen.getPrimaryDisplay();
  let mainDisplayDimensions = mainDisplay.workAreaSize;
  let mainDisplayWidth = mainDisplayDimensions.width;

  remindersWin.setPosition(mainDisplayWidth - 600, 100);

  remindersWin.setAlwaysOnTop(true);

  win.webContents.send('remove-reminder-p')

  remindersWin.minimize();

  remindersWin.loadFile('reminders.html');

  remindersWin.on('closed', () => {
    isRemindersWinClosed = true;
  })
}


ipcMain.handle('create-reminders-window', () => {
  if(isRemindersWinClosed) {
    createRemindersWindow();
    remindersWin.restore();
  } else {
    if(isRemindersWinMinimized == true) {
      //remindersWin.setSkipTaskbar(false);
      remindersWin.restore();
      isRemindersWinMinimized = false;
    } else if(isRemindersWinMinimized == false) {
      //remindersWin.setSkipTaskbar(true);
      remindersWin.minimize();
      isRemindersWinMinimized = true;
    }
  }
})

ipcMain.on('change-div-text', (event, p, pId) => {
  win.webContents.send('update-div', p, pId);
});

ipcMain.on('remove-reminder-p', (event, pId) => {
  win.webContents.send('remove-reminder-p-main', pId)
})