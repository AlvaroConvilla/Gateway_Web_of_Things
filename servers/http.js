//Requiere el marco Express, sus rutas, y el modelo
var express = require('express'),
router = express.Router(),
routesCreator = require('./../routes/routesCreator'),
resourcesGate = require('./../resources/modelGate'),
resourcesWS = require('./../resources/modelWeatherStation'),
converter = require('./../middleware/converter'),
cors = require('cors');
bodyParser = require('body-parser'),
cons = require('consolidate'),
keys = require('../resources/secure/auth'),
auth = require('./../middleware/auth'),
utils = require('./../utils/utils.js'),
modelSecure = require('./../resources/modelSecure'),
fs = require('fs');

//Crea una aplicación con el framework express; esto envuelve un servidor HTTP.
var app = express();

app.use(bodyParser.json());

//Habilitar CORS
app.use(cors());

// Enables API Auth
// Use this to generate a new API token:
var token = utils.generateApiToken();
createDefaultData(modelSecure.apiToken);
modelSecure.data = {"apiToken":token};
console.info('>Here is a new random crypto-secure API Key: ' + token);
//console.info('My API Token is: ' + token);//keys.apiToken);
app.use(auth()); // uncomment to enable the auth middleware


//Se liga sus rutas a la aplicación express;
app.use('/', routesCreator.create(resourcesWS));


// Templating engine
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/../views');
// Sets the public folder (for static content such as .css files & co)
app.use(express.static(__dirname + '/../public'));

app.use(converter());
module.exports = app;

//---------------------------------------------------------------------------------------
function createDefaultData(resources) {
  Object.keys(resources).forEach(function (resKey) {
    var resource = resources[resKey];
    resource.data = [];
  });
}