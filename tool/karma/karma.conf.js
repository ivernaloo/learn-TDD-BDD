module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        files: ['./test.js'],
        browsers: ["Chrome_Beta_Headless"],
        customLaunchers: {
            Chrome_Beta_Headless: {
                base: 'Chrome',
                flags: [
                    '--headless',
                    '--disable-gpu',
                    '--remote-debugging-port=9222'
                ]
            }
        },
        browserConsoleLogOptions: {
            level: 'log',
            terminal: true
        },
        reporters: ['progress'],
        autoWatch: false,
        singleRun: true
    })
}