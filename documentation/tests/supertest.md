Supertest can be used in two ways.

It can hit a URL or it can be handed an express app.

const request = require('supertest')

request(app).post()
request('http://localhost:3000').post()

If we pass supertest an app we can debug our test and our API in the same debugger.
