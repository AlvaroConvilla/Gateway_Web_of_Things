//Requiere el marco Express, sus rutas, y el modelo
var express = require('express'),
//actuatorsRoutes = require('./../routes/actuators'),
routesCreator = require('./../routes/routesCreator'),
resourcesGate = require('./../resources/modelGate'),
resourcesWS = require('./../resources/modelWeatherStation'),
converter = require('./../middleware/converter'),
cors = require('cors');
bodyParser = require('body-parser'),
cons = require('consolidate'),
keys = require('../resources/auth'),
auth = require('./../middleware/auth'),
utils = require('./../utils/utils.js'),
wot = require('../wot-server.js');

//Crea una aplicación con el framework express; esto envuelve un servidor HTTP.
var app = express();

app.use(bodyParser.json());

//Habilitar CORS
app.use(cors());

// Enables API Auth
// Use this to generate a new API token:
if(false){ //wot.sec
    //console.info('>Here is a new random crypto-secure API Key: ' + utils.generateApiToken());
    //console.info('My API Token is: ' + keys.apiToken);
    app.use(auth()); // uncomment to enable the auth middleware
}

//Se liga sus rutas a la aplicación expreso; ligarlos a /WeatherStation/sensors/...
//app.use('/pi/actuators', actuatorsRoutes);
//app.use('/WeatherStation/sensors', sensorRoutes);
app.use('/', routesCreator.create(resourcesWS));

//Crea una ruta predeterminada para /WeatherStation
//app.get('/WeatherStation', function (req, res) {
//	res.send('This is the WoT-WeatherStation!')
//});

// Templating engine
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/../views');
// Sets the public folder (for static content such as .css files & co)
app.use(express.static(__dirname + '/../public'));

app.use(converter());
module.exports = app;
