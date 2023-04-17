let express = require('express');
let app = express();

const {
    geoCoding,
    getSuggestion,
    geolocation,
    getWeather
} = require('./location.js');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.set('port', 3001);

app.listen(app.get('port'), function () {
    console.log(`Listening for requests on port ${app.get('port')}.`);
});

app.use(express.static('public'));

app.get('/location/:lat=:latitude/:long=:longitude', async (req, res) => {
    try {
      const cityName = await geolocation(req.params.latitude, req.params.longitude);
      res.json(`${cityName}`);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
});

app.get('/:address=:address', async (req, res) => {
    try {
      const {latitude, longitude, cityName} = await geoCoding(req.params.address);
      res.json({cityName, longitude, latitude});
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
});

app.get('/weather/:lat=:latitude/:long=:longitude', async (req, res) => {
    try {
      const data = await getWeather(req.params.latitude, req.params.longitude);
      res.json({data});
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
});

app.get('/suggestion/:query=:query', async (req, res) => {
  try {
    const data = await getSuggestion(req.params.query);
    res.json({data});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});