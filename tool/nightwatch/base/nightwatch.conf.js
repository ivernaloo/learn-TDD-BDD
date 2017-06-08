module.exports = {
  "src_folders" : ["test/e2e/"],
  "output_folder": "coverage",

  "selenium" : {
    "start_process" : true,
    "server_path" : "./node_modules/selenium-server-standalone-jar/jar/selenium-server-standalone-2.53.1.jar",
    "host": "127.0.0.1",
    "port" : 4444,
    "cli_args" : {
      "webdriver.chrome.driver" : "./node_modules/chromedriver/bin/chromedriver"
    }
  },

  "test_settings" : {
    "default" : {
      "selenium_port": 4444,
      "selenium_host": "localhost",
      "silent": false
    },

    "chrome" : {
      "desiredCapabilities": {
        "browserName": "chrome",
        "javascriptEnabled": true,
        "acceptSslCerts": true,
        "chromeOptions" : {
          "args" : ["start-fullscreen"]
        }
      }
    }
  }
}