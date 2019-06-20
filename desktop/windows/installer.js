var electronInstaller = require('electron-winstaller');

// In this case, we can use relative paths
var settings = {
    appDirectory: './PROTOTYP3-win32-x64',
    outputDirectory: './PROTOTYPE-installer',
    authors: 'IoT.nxt.',
    exe: './PROTOTYP3.exe'
};

resultPromise = electronInstaller.createWindowsInstaller(settings);

resultPromise.then(() => {
    console.log("The installers of your application were succesfully created!");
}, (e) => {
    console.log(`Error: Could not create installer ${e.message}`)
});