import { defineConfig } from 'cypress'

export default defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/reports/junit/ci-test-output-[hash].xml',
    jenkinsMode: true,
    rootSuiteTitle: 'FicusJS Router Integration Tests',
    testsuitesTitle: 'Cypress Tests'
  },
  video: false,
  e2e: {
    testIsolation: false
  }
})
