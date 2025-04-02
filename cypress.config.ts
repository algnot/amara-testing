const { defineConfig } = require('cypress')
require('dotenv').config()

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",
  e2e: {
    env: {
      UI_ENDPOINT: process.env.UI_ENDPOINT,
      SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
      SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD
    },
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
      return config;
    },
    baseUrl: process.env.CYPRESS_UI_ENDPOINT,
  },
  defaultCommandTimeout: 20000,
  video: true,
  screenshotOnRunFailure: true,
})
