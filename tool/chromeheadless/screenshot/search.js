const { ChromeLauncher } = require('lighthouse/lighthouse-cli/chrome-launcher') // chrome launcher method
const chrome = require('chrome-remote-interface')
const fs = require('fs')
const deviceMetrics = {
    width: 1200,
    height: 800,
    deviceScaleFactor: 0,
    mobile: false,
    fitWindow: false
}
const screenshotMetrics = {
    width: deviceMetrics.width,
    height: deviceMetrics.height
}
let protocol
let launcher

/*
 * launch chrome method
 * */
function launchChrome () {
    const launcher = new ChromeLauncher({ // chrome launcher is a wraper promise instance
        port: 9222,
        autoSelectChrome: true,
        additionalFlags: ['--window-size=412,732', '--disable-gpu', '--headless']
    }) // lauch chrome
    return launcher.run().then(() => launcher) // return chrome instance
}
function getScreenShot () {
    const { Page, Emulation } = protocol
    return Page.enable()
        .then(() => {
            Emulation.setDeviceMetricsOverride(deviceMetrics) // 配置浏览器尺寸
            Emulation.setVisibleSize(screenshotMetrics) // 配置截图尺寸
            Page.navigate({ url: 'https://baidu.com/' })
            return new Promise((resolve, reject) => {
                Page.loadEventFired(() => {
                    resolve(Page.captureScreenshot({ format: 'jpeg', fromSurface: true }))
                })
            })
        })
        .then(image => {
            const buffer = new Buffer(image.data, 'base64')
            return new Promise((resolve, reject) => {
                fs.writeFile('output.jpeg', buffer, 'base64', err => {
                    if (err) return reject(err)
                    resolve()
                })
            })
        })
}
launchChrome( )
    .then(Launcher => {
        launcher = Launcher
        return new Promise((resolve, reject) =>{
            chrome(Protocol => {
                protocol = Protocol
                resolve()
            }).on('error', err => { reject(err) })
        })
    })
    .then(search)
    .then(() => {
        protocol.close()
        launcher.kill()
    })
    .catch(console.error);



function getStyle () {
    const { Page, CSS, DOM } = protocol
    return Promise.all([
        DOM.enable(),
        CSS.enable(),
        Page.enable()
    ])
        .then(() => {
            Page.navigate({ url: 'https://github.com/' })
            return new Promise((resolve, _) => {
                Page.loadEventFired(() => { resolve(DOM.getDocument()) })
            })
        })
        .then(res => res.root.nodeId)
        .then(nodeId => DOM.querySelector({ selector: '.btn-primary', nodeId }))
        .then(({ nodeId }) => CSS.getComputedStyleForNode({ nodeId }))
        .then(style => { console.log(style) })
}


function search () {
    const { Page, Runtime } = protocol
    return Promise.all([
        Page.enable()
    ])
        .then(() => {
            Page.navigate({ url: 'https://www.baidu.com/' })
            return new Promise((resolve, _) => {
                Page.loadEventFired(() => { resolve() })
            })
        })
        .then(() => {
            const code = [
                'var input = document.querySelector(\'.s_ipt\')',
                'var btn = document.querySelector(\'#su\')',
                'input.value=\'123\''
            ].join(';')
            return Runtime.evaluate({ expression: code })
        })
        .then(() => {
            return new Promise((resolve, _) => {
                setTimeout(() => {
                    resolve(Page.captureScreenshot({ format: 'jpeg', fromSurface: true }))
                }, 3000)
            })
        })
        .then(image => {
            const buffer = new Buffer(image.data, 'base64')
            return new Promise((resolve, reject) => {
                fs.writeFile('output.jpeg', buffer, 'base64', err => {
                    if (err) return reject(err)
                    resolve()
                })
            })
        })
}


function setUAandCookie () {
    const { Page, Network } = protocol
    return Promise.all([
        Network.enable(),
        Page.enable()
    ])
        .then(() => {
            const userAgent =
                Network.setUserAgentOverride({ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.71 Safari/537.36" })
            Network.setCookie({
                url: 'https://github.com',
                name: 'test',
                value: '123',
                domain: '.github.com',
                path: '/',
                httpOnly: true
            })
            Page.navigate({ url: 'https://github.com/' })
            return new Promise((resolve, _) => {
                Page.loadEventFired(() => { resolve() })
            })
        })
        .then(() => {
            return Network.getCookies()
        })
        .then(console.log)
}