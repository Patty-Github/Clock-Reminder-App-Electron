const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('remindersWindow', {
  createRemindersWindow: () => ipcRenderer.invoke('create-reminders-window')
})

contextBridge.exposeInMainWorld('winMouseEvents', {
  ignoreMouseEventsTrue: () => ipcRenderer.invoke('ignore-mouse-events-true'),
  ignoreMouseEventsFalse: () => ipcRenderer.invoke('ignore-mouse-events-false')
});

contextBridge.exposeInMainWorld('electronAPI', {
  sendChangeDivText: (text) => ipcRenderer.send('change-div-text', text),
  onUpdateDiv: (callback) => ipcRenderer.on('update-div', (event, text) => callback(text))
});