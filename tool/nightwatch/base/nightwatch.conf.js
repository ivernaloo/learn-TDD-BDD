module.exports = {
  "src_folders" : ["test/e2e/"],
  "output_folder": "coverage",

  "selenium" : {
    "start_process" : true,
    "server_path" : require("selenium-server-standalone-jar").path,
    "host": "127.0.0.1",
    "port" : 4444,
    "cli_args" : {
      "webdriver.chrome.driver" : require("chromedriver").path
    }
  },

  "test_settings" : {
    "default" : {
      "selenium_port": 4444,
      "selenium_host": "localhost",
      "silent": true
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