Authenticate Me - Phase 1
No one has completed this Project lately, be the first!
The main purpose of this Express application is to be a REST API server. All the API routes will be served at URL's starting with /api/.

Get started by nesting an api folder in your routes folder. Add an index.js file in the api folder with the following contents:

// backend/routes/api/index.js
const router = require('express').Router();

module.exports = router;
Import this file into the routes/index.js file and connect it to the router there.

// backend/routes/index.js
// ...
const apiRouter = require('./api');

router.use('/api', apiRouter);
// ...
All the URLs of the routes in the api router will be prefixed with /api.

Test the API Router
Make sure to test this setup by creating the following test route in the api router:

// backend/routes/api/index.js
// ...

router.post('/test', function(req, res) {
  res.json({ requestBody: req.body });
});

// ...
A router is created and an API test route is added to the router. The API test route is accepting requests with the URL path of /api/test with the HTTP verb of POST. It sends a JSON response containing whatever is in the body of the request.

Test this route by navigating to http://localhost:8000/api/csrf/restore and creating a fetch request in the browser's DevTools console. Make a request to /api/test with the POST method, a body of { hello: 'world' }, a "Content-Type" header, and an XSRF-TOKEN header with the value of the XSRF-TOKEN cookie located in your DevTools.

Example fetch request:

fetch('/api/test', {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
  },
  body: JSON.stringify({ hello: 'world' })
}).then(res => res.json()).then(data => console.log(data));
Replace the <value of XSRF-TOKEN cookie> with the value of the XSRF-TOKEN cookie. If you don't have the XSRF-TOKEN cookie anymore, access the http://localhost:8000/api/csrf/restore route to add the cookie back.

After the response returns to the browser, parse the JSON response body and print it out.

If you get an error, check your backend server logs in the terminal where you ran npm start. Also, check your fetch request syntax and your API router setup.

After you finish testing, commit your code!