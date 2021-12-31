const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = !app.isPackaged

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ show: false, icon: './favicon.ico' });
    mainWindow.maximize()
    mainWindow.loadURL(isDev ? 'http://localhost:3131' : `file://${path.join(__dirname, '../build/index.html')}`);
    mainWindow.show()
    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});