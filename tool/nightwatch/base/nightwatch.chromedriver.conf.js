var chromedriver = require('chromedriver');
module.exports = {
    before : function(done) {
        console.info("...")
        chromedriver.start();

        done();
    },
    after : function(done) {
        chromedriver.stop();

        done();
    },
    "src_folders"  : ["e2e/"],
    "output_folder": "coverage",

    "selenium": {
        "start_process": false

    },

    "test_settings": {
        "default": {
            "selenium_port"      : 9515,
            "selenium_host"      : "localhost",
            "default_path_prefix": ""
        },

        "chrome": {
            "desiredCapabilities": {
                "browserName"      : "chrome",
                "javascriptEnabled": true,
                "acceptSslCerts"   : true,
                "chromeOptions"    : {
                    "args": ["start-fullscreen"]
                }
            }
        }
    }
}