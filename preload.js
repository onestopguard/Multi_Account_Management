const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url) => ipcRenderer.invoke('shell.openExternal', url),
  clipboard: {
    writeText: (text) => ipcRenderer.invoke('clipboard.writeText', text)
  },
  notification: {
    show: (title, body) => ipcRenderer.invoke('notification.show', { title, body })
  }
});