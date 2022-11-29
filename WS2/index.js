const express = require('express');
const cors = require('cors');
const routes = require('./routes/edgeDetect');
const port = 3001;
const path = require('path');

//initialise express
const app = express();

//Use cors middleware in the router app so other servers can connect.
app.use(cors({
  origin: true,
  credentials: true,
}));
//Json parser middlerware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/uploads')));
//Get our route/controller logic
app.use('/', routes);

app.listen(port, () => { console.log('Started server on '+port+'. Check it is running by visiting http://localhost:3001 and looking for \'Hello World\'.\""'); });
