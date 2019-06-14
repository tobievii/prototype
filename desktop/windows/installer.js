var electronInstaller = require('electron-winstaller');

// In this case, we can use relative paths
var settings = {
    // Specify the folder where the built app is located
    appDirectory: './PROTOTYP3-win32-x64',
    // Specify the existing folder where 
    outputDirectory: './PROTOTYPE-installer',
    // The name of the Author of the app (the name of your company)
    authors: 'IoT.nxt.',
    // The name of the executable of your built
    exe: './PROTOTYP3.exe'
};

resultPromise = electronInstaller.createWindowsInstaller(settings);

resultPromise.then(() => {
    console.log("The installers of your application were succesfully created!");
}, (e) => {
    console.log(`Error: Could not create installer ${e.message}`)
});