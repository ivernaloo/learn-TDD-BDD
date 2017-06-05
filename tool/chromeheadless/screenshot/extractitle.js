const { ChromeLauncher } = require('lighthouse/lighthouse-cli/chrome-launcher') // chrome launcher method
const chrome = require('chrome-remote-interface')

/**
 * Launches a debugging instance of Chrome on port 9222.
 * @param {boolean=} headless True (default) to launch Chrome in headless mode.
 *     Set to false to launch Chrome normally.
 * @return {Promise<ChromeLauncher>}
 */
function launchChrome(headless = true) {
    const launcher = new ChromeLauncher({
        port: 9222,
        autoSelectChrome: true, // False to manually select which Chrome install.
        additionalFlags: [
            '--window-size=412,732',
            '--disable-gpu',
            headless ? '--headless' : ''
        ]
    });

    return launcher.run().then(() => launcher)
        .catch(err => {
            return launcher.kill().then(() => { // Kill Chrome if there's an error.
                throw err;
            }, console.error);
        });
}

function onPageLoad(Runtime) {
    const js = "document.querySelector('title').textContent";

    // Evaluate the JS expression in the page.
    return Runtime.evaluate({expression: js}).then(result => {
        console.log('Title of page: ' + result.result.value);
    });
}

launchChrome().then(launcher => {

    chrome(protocol => {
        // Extract the parts of the DevTools protocol we need for the task.
        // See API docs: https://chromedevtools.github.io/devtools-protocol/
        const {Page, Runtime} = protocol;

        // First, need to enable the domains we're going to use.
        Promise.all([
            Page.enable(),
            Runtime.enable()
        ]).then(() => {
            Page.navigate({url: 'https://www.chromestatus.com/'});

            // Wait for window.onload before doing stuff.
            Page.loadEventFired(() => {
                onPageLoad(Runtime).then(() => {
                    protocol.close();
                    launcher.kill(); // Kill Chrome.
                });
            });

        });

    }).on('error', err => {
        throw Error('Cannot connect to Chrome:' + err);
    });

});