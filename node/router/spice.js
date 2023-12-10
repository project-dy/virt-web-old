const express = require('express');
const app = express.Router();

// ex: http://localhost:3000/spice/spice_auto.html?host=localhost&port=5959

/*app.get('/:uuid', (req, res) => {
  // TODO: check if needed websockify proccess's pid is exists from window.websockify_pid if not, return a location to start websockify
  
});*/

app.use('/', express.static('../spice-html5'));

module.exports = app;