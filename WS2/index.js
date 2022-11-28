const express = require('express');
const cors = require('cors');
const routes = require('./routes/edgeDetect');
const port = 3001;

//initialise express
const app = express();

//Use cors middleware in the router app to allow other servers to connect.
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use('/', routes);

app.listen(port, () => { console.log('Started server on '+port+'. Check it is running by visiting http://localhost:3001 and looking for \'Hello World\'.\""'); });
