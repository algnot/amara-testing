const { defineConfig } = require('cypress')
require('dotenv').config()

module.exports = defineConfig({
  e2e: {
    env: {
      UI_ENDPOINT: process.env.UI_ENDPOINT,
      SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
      SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
    }
  },
  defaultCommandTimeout: 20000,
  video: true,
  screenshotOnRunFailure: true,
})
