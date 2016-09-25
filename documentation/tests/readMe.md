<moduleName>-tests = Unit Tests
<moduleName>-i-tests = Integration Tests (hits mongo db, hits a 3rd party NPM package)
<moduleName>-e2e-tests = Actual end to end tests against an instance of our server using supertest

Integration tests and e2e tests require a mongodb instance and a correct connection string in config/test.json
