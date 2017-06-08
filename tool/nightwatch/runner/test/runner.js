var path = require('path');
var spawn = require('cross-spawn');
var chromedriver = require('chromedriver');

chromedriver.start();

var args = process.argv.slice(2)
if (args.indexOf('--config') === -1) {
    args = args.concat(['--config', 'nightwatch.conf.js'])
}
if (args.indexOf('--env') === -1) {
    args = args.concat(['--env', 'chrome'])
}

var runner = spawn('nightwatch', args, {
    stdio: 'inherit'
})

runner.on('exit', function (code) {
    chromedriver.stop();
    process.exit(code)
})

runner.on('error', function (err) {
    chromedriver.stop();
    throw err
})
