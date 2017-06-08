module.exports = {
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