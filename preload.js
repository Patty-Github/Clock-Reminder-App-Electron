const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('remindersWindow', {
  createRemindersWindow: () => ipcRenderer.invoke('create-reminders-window')
})

contextBridge.exposeInMainWorld('winMouseEvents', {
  ignoreMouseEventsTrue: () => ipcRenderer.invoke('ignore-mouse-events-true'),
  ignoreMouseEventsFalse: () => ipcRenderer.invoke('ignore-mouse-events-false')
});

contextBridge.exposeInMainWorld('electronAPI', {
  sendChangeDivText: (p, pId) => ipcRenderer.send('change-div-text', p, pId),
  onUpdateDiv: (callback) => ipcRenderer.on('update-div', (event, p, pId) => callback(p, pId))
});

contextBridge.exposeInMainWorld('remindersDiv', {
  removeReminderP: (pId) => ipcRenderer.send('remove-reminder-p', pId),
  onRemoveReminder: (callback) => ipcRenderer.on('remove-reminder-p-main', callback)
})

contextBridge.exposeInMainWorld('clockFontSizeChange', {
  onFontChange: (callback) => {ipcRenderer.on('update-font-size', (_event, value) => callback(value))}
})