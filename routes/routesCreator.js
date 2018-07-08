var express = require('express'),
  router = express.Router(),
  uuid = require('node-uuid'),
  utils = require('./../utils/utils'),
  modelGateLD= require('./../resources/modelGateLD'),
  modelGate = require('./../resources/modelGate'),
  modelWSLD = require('./../resources/modelWeatherStationLD'),
  modelWS = require('./../resources/modelWeatherStation');
  modelDomeLD = require('./../resources/modelDomeLD'),
  modelDome = require('./../resources/modelDome');
  modelCameraLD = require('./../resources/modelCameraLD'),
  modelCamera = require('./../resources/modelCamera');
  modelMountLD = require('./../resources/modelMountLD'),
  modelMount = require('./../resources/modelMount'),
  modelCameraInsideLD = require('./../resources/modelCameraInsideLD'),
  modelCameraInside = require('./../resources/modelCameraInside'),
  modelCameraOutsideLD = require('./../resources/modelCameraOutsideLD'),
  modelCameraOutside = require('./../resources/modelCameraOutside'),
  modelLogin = require('./../resources/modelLogin'),
  //modelLoginLD = require('./../resources/modelLoginLD'),
  actionMount = require('./../resources/actionMount'),
  //sleep = require('sleep'),
  fs = require('fs');
  var request = require('request');
  //var rp = require('request-promise');
  //const sqlite3 = require('sqlite3').verbose();
  var keys = require('../resources/secure/auth'),
modelSecure = require('./../resources/modelSecure');


exports.create = function (model) { //por defecto el model que viene es el de la WeatherStation
  //Campo Data para almacenar los valores de los sensores de los Things:

    //WeatherStation -->properties,actions&events
  createDefaultData(modelWS.links.properties.resources);
  createDefaultData(modelWS.links.actions.resources);
  createDefaultData(modelWS.links.events.resources);
    //Dome
  createDefaultData(modelDome.links.properties.resources);
  createDefaultData(modelDome.links.actions.resources);
  createDefaultData(modelDome.links.events.resources);
    //Camera DMK
  createDefaultData(modelCamera.links.properties.resources);
  createDefaultData(modelCamera.links.actions.resources);
  createDefaultData(modelCamera.links.events.resources);
    //Mount
  createDefaultData(modelMount.links.properties.resources);
  createDefaultData(modelMount.links.actions.resources);
  createDefaultData(modelMount.links.events.resources);
    //Camera Inside
  createDefaultData(modelCameraInside.links.properties.resources);
  createDefaultData(modelCameraInside.links.actions.resources);
  createDefaultData(modelCameraInside.links.events.resources);
    //Camera Outside
  createDefaultData(modelCameraOutside.links.properties.resources);
  createDefaultData(modelCameraOutside.links.actions.resources);
  createDefaultData(modelCameraOutside.links.events.resources);

  // Let's create the routes
  //Raiz es el gateway
  createRootRoute(modelGateLD);	
  createModelRoutes(modelGateLD);
  createGatewayLoginRoutes(modelGate);
  //WeatherStation
  createWeatherStationRoute(modelWSLD); 	
  createWeatherStationModelRoutes(modelWSLD);
  createWeatherStationPropertiesRoutes(modelWS);
  createWeatherStationActionsRoutes(modelWS);
  createWeatherStationEventsRoutes(modelWS);
  //Dome
  createDomeRoute(modelDomeLD);
  createDomeModelRoutes(modelDomeLD);
  createDomePropertiesRoutes(modelDome);
  createDomeActionsRoutes(modelDome);
  createDomeEventsRoutes(modelDome);
  //Camera
  createCameraRoute(modelCameraLD);
  createCameraModelRoutes(modelCameraLD);
  createCameraPropertiesRoutes(modelCamera);
  createCameraActionsRoutes(modelCamera);
  createCameraEventsRoutes(modelCamera);
  //Mount
  createMountRoute(modelMountLD);
  createMountModelRoutes(modelMountLD);
  createMountPropertiesRoutes(modelMount);
  createMountActionsRoutes(modelMount);
  createMountEventsRoutes(modelMount);
    //Camera Inside
  createCameraInsideRoute(modelCameraInsideLD);
  createCameraInsideModelRoutes(modelCameraInsideLD);
  createCameraInsidePropertiesRoutes(modelCameraInside);
  createCameraInsideActionsRoutes(modelCameraInside);
  createCameraInsideEventsRoutes(modelCameraInside);
    //Camera Outside
  createCameraOutsideRoute(modelCameraOutsideLD);
  createCameraOutsideModelRoutes(modelCameraOutsideLD);
  createCameraOutsidePropertiesRoutes(modelCameraOutside);
  createCameraOutsideActionsRoutes(modelCameraOutside);
  createCameraOutsideEventsRoutes(modelCameraOutside);


  return router;
};
//-----------------------------GATEWAY----------------------------------------------------
//root resource route: 
function createRootRoute(model){
  //Manejar recurso raiz '/' 
  router.route('/WoT').get(function(req, res, next){
    req.model = model;
    req.type = 'root';
    //req.direc = 'ofs.fi.upm.es/WoT';

    var fields = ['name','description','base', 'port', 'address', 'geo', 'tags'];
    //Extrae los campos requeridos del modelo, añade el objeto a result
    req.result = utils.extractFields(fields,model);
    req.links = ['WoT/model', 'WoT/login', 'WoT/WeatherStation', 'WoT/Dome', 'WoT/Camera', 'WoT/Mount', 'WoT/Camera_inside', 'WoT/Camera_outside'];
    if (model['@context']) type = model['@context'];
    else type = 'http://ofs.fi.upm.es/WoT/model';

//Crea encabezado de enlace que direcciona a recursos
    res.links({
      model: 'model/',
      WeatherStation: '/WeatherStation/',
      Dome: '/Dome/',
      Camera: '/Camera/',
      Mount: '/Mount/',
      Camera_inside: '/Camera_inside/',
      Camera_outside: '/Camera_outside/',
      ui: '/',
      //type: type
    });
    next();//llama a la siguiente representacion middleware
});
};
function createModelRoutes(model) {
  // GET /WoT/model
  router.route('/WoT/model').get(function (req, res, next) {
    req.result = JSON.stringify(model,undefined,2);
    req.model = model;
    req.type = 'gatewayLD';
    req.entityId = "model";
    req.uri = 'WoT';
    
    if (model['@context']) type = model['@context'];
    else type = 'http://ofs.fi.upm.es/WoT/model';
    res.links({
      //type: type
    });
    next();
  });
};

//function createModelRoutes(model) {
function createGatewayLoginRoutes(model) {
var actions = model.links.actions;
  // GET /WoT/login
  router.route('/WoT/login').get(function (req, res, next) {
    req.actionModel = actions.resources['login'];
    req.type = 'action';
    req.entityId = 'login';
    req.uri = "Login";
    req.result = actions.resources['login'];

    if (model['@context']) type = model['@context'];
    else type = 'http://ofs.fi.upm.es/WoT/model';
    res.links({
      //type: type
    });
    next();
  });

// POST /WoT/login
  router.route('/WoT/login').post(function (req, res, next) {
    //El login dará acceso para un usuario que exista registrado y que además tenga reserva hecha en este momento
    //coger Json que nos llega
    var json = req.body;

    if(json.username === 'admin'){ //Si el usuario que intenta entrar es admin, siempre dar acceso
        //Realizar login sobre pasarela IoT con los datos de user y pass que han llegado
        obtenerToken(json,function(token){
            if(token != null){
                    return res.status(200).send({token: modelSecure.data.apiToken});
            }
            else {
                return res.status(403).send({success: false, message: 'Incorrect password'});
            }
        });
    }
    else{ //Cualquier otro usuario debe tener reserva
        //Realizar login sobre pasarela IoT con los datos de user y pass que han llegado
        obtenerToken(json,function(token){
           if(token != null){
               //Si ha loggeado correctamente obtenemos las reservas de dicho usuario
               obtenerReservas(token,function(reservas){
                  if(reservas != null){

                      //Con las reservas que tiene ver si tiene una para este momento darle acceso
                      var bool = comprobarReservaUser(reservas);
                      console.log(bool);
                      if(bool == true){ //Dar acceso
                       return res.status(200).send({token: modelSecure.data.apiToken});
                      }
                      else{ //Denegar acceso
                       return res.status(403).send({success: false, message: 'Unauthorized'});
                      }
                  }else{
                      return res.status(403).send({success: false, message: 'Unauthorized'});
                  }
               });
           }else{
               return res.status(403).send({success: false, message: 'Unauthorized'});
           }
        });
    }
  })
}

//-----------------------------WEATHERSTATION----------------------------------------------------
//root resource route: 
function createWeatherStationRoute(model){
  //GET'/WeatherStation' 
  router.route('/WoT/WeatherStation').get(function(req, res, next){
    req.model = model;
    req.type = 'root'; //nombre del html en la carpeta view
    req.uri = 'WeatherStation';

    //var fields = ['id','name','description','tags','customFields'];
    var fields = ['name','description','base', 'port', 'address', 'geo', 'tags'];
    //Extrae los campos requeridos del modelo, añade el objeto a result
    req.result = utils.extractFields(fields,model);
    req.links = ['/WoT/WeatherStation/model', '/WoT/WeatherStation/properties', '/WoT/WeatherStation/actions', '/WoT/WeatherStation/events'];
    
    if (model['@context']) type = model['@context'];
    else type = 'http://ofs.fi.upm.es:8484/model';

//Crea encabezado de enlace que direcciona a recursos
    res.links({
      model: '/model/',
      properties: '/properties/',
      actions: '/actions/',
      events: '/events/',
      ui: '/',
    });
    next();//llama a la siguiente representacion middleware
});
};

function createWeatherStationModelRoutes(model) {
  // GET /WeatherStation/model
  router.route('/WoT/WeatherStation/model').get(function (req, res, next) {
    req.result = JSON.stringify(model,undefined,2);
    req.type = 'weatherLD';

    req.uri = "WeatherStation";
    req.entityId = "model";
    
    if (model['@context']) type = model['@context'];
    else type = 'http://ofs.fi.upm.es/model';
    res.links({
      //type: type
    });
    next();
  });
};

function createWeatherStationPropertiesRoutes(model) {
  var properties = model.links.properties;
  // GET /WeatherStation/properties
  router.route('/WoT/WeatherStation/properties').get(function (req, res, next) {
    req.model = model;
    req.type = 'properties';
    req.entityId = 'properties';
    req.uri = 'WeatherStation';
    req.result = utils.modelToResources(properties.resources, true);
    req.links = ['WeatherStation/properties', 'WeatherStation/actions', 'WeatherStation/events'];
    // Generate the Link headers
    if (properties['@context']) type = properties['@context'];
    else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    res.links({
      state:'/state',
      temperature:'/temperature',
      humidity:'/humidity',
      pressure:'/pressure',
      rainfall:'/rainfall',
      windSpeed:'/windSpeed',
      windDirection:'/windDirection'
      //type: type
    });
    next();
  });

  // GET /WeatherStation/properties/{id}
  router.route('/WoT/WeatherStation/properties' + '/:id').get(function (req, res, next) {
    req.model = model;
    req.propertyModel = properties.resources[req.params.id];
    req.type = 'property';
    req.entityId = req.params.id;
    req.uri = 'WeatherStation';
    req.result = properties.resources[req.entityId];

    // Generate the Link headers
    if (properties.resources[req.params.id]['@context']) type = properties.resources[req.params.id]['@context'];
    else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    res.links({
      //type: type
    });
    next();
  });
};

function createWeatherStationActionsRoutes(model) {
  var actions = model.links.actions;
  // GET /weatherStation/actions
  router.route('/WoT/WeatherStation/actions').get(function (req, res, next) {
    req.model = model;
    req.type = 'actions';
    req.entityId = 'actions';
    req.uri = 'WeatherStation';
    req.result = utils.modelToResources(actions.resources, true);
    req.links = [''];

    if (actions['@context']) type = actions['@context'];
    else type = 'http://ofs.fi.upm.es/model/#actions-resource';

    res.links({
      //type: type
    });
    next();
  });

  // POST /weatherStation/actions/{actionType}
  /*router.route(actions.link + '/:actionType').post(function (req, res, next) {
    var action = req.body;
    action.id = uuid.v1();
    action.status = "pending";
    action.timestamp = utils.isoTimestamp();
    utils.cappedPush(actions.resources[req.params.actionType].data, action);
    res.location(req.originalUrl + '/' + action.id);

    next();
  });*/


  // GET /weatherStation/actions/{actionType}
/*  router.route(actions.link + '/:actionType').get(function (req, res, next) {

    req.result = reverseResults(actions.resources[req.params.actionType].data);
    req.actionModel = actions.resources[req.params.actionType];
    req.model = model;

    req.type = 'action';
    req.entityId = req.params.actionType;

    if (actions.resources[req.params.actionType]['@context']) type = actions.resources[req.params.actionType]['@context'];
    else type = 'http://ofs.fi.upm.es:8484/model/#actions-resource';

    res.links({
      type: type
    });
    next();
  });*/

  // GET /weatherStation/actions/{id}/{actionId}
/*  router.route(actions.link + '/:actionType/:actionId').get(function (req, res, next) {
    req.result = utils.findObjectInArray(actions.resources[req.params.actionType].data,
      {"id" : req.params.actionId});
    next();
  });*/
};

function createWeatherStationEventsRoutes(model) {
  var events = model.links.events;
  // GET /weatherStation/events
  router.route('/WoT/WeatherStation/events').get(function (req, res, next) {
    req.model = model;
    req.type = 'events';
    req.entityId = 'events';
    req.uri = 'WeatherStation';
    req.result = utils.modelToResources(events.resources, true);

    if (events['@context']) type = events['@context'];
    else type = 'http://ofs.fi.upm.es/model/#events-resource';

    res.links({
      HighTemperature:'/HighTemperature',
      Rain:'/Rain',
      StrongWind:'/StrongWind',
      //type: type
    });
    next();
  });
    
  // GET /weatherStation/events/{eventType}
  router.route('/WoT/WeatherStation/events' + '/:eventType').get(function (req, res, next) {
    req.model = model;
    req.eventModel = events.resources[req.params.eventType];
    req.type = 'event';
    req.entityId = req.params.eventType;
    req.uri = 'WeatherStation';
    req.result = events.resources[req.entityId];

    if (events.resources[req.params.eventType]['@context']) type = events.resources[req.params.eventType]['@context'];
    else type = 'http://ofs.fi.upm.es/model/#events-resource';

    res.links({
      //type: type
    });
    next();
  });
};

//-----------------------------DOME----------------------------------------------------
function createDomeRoute(model){
  //GET'/Dome'
  router.route('/WoT/Dome').get(function(req, res, next){
    req.model = model;
    req.type = 'root'; //nombre del html en la carpeta view
    req.uri = 'Dome';

    //var fields = ['id','name','description','tags','customFields'];
    var fields = ['name','description','base', 'port', 'address', 'geo', 'tags'];
    //Extrae los campos requeridos del modelo, añade el objeto a result
    req.result = utils.extractFields(fields,model);
    req.links = ['Dome/model', 'Dome/properties', 'Dome/actions', 'Dome/events'];

    if (model['@context']) type = model['@context'];
    else type = 'http://ofs.fi.upm.es/model';

//Crea encabezado de enlace que direcciona a recursos
    res.links({
      model: '/model/',
      properties: '/properties/',
      actions: '/actions/',
      events: '/events/',
      //things: '/things/',
      ui: '/',
      //type: type
    });
    next();//llama a la siguiente representacion middleware
});
};

function createDomeModelRoutes(model) {
  // GET /Dome/model
  router.route('/WoT/Dome/model').get(function (req, res, next) {
    req.result = JSON.stringify(model,undefined,2);
    req.model = model;
    req.uri = "Dome";
    req.entityId = "model";
    req.type = 'domeLD';

    if (model['@context']) type = model['@context'];
    else type = 'http://ofs.fi.upm.es/model';
    res.links({
      //type: type
    });
    next();
  });
};

function createDomePropertiesRoutes(model) {
  var properties = model.links.properties;
  // GET /Dome/properties
  router.route('/WoT/Dome/properties').get(function (req, res, next) {
    req.model = model;
    req.type = 'properties';
    req.entityId = 'properties';
    req.uri = 'Dome';
    req.result = utils.modelToResources(properties.resources, true);
    req.links = ['Dome/properties', 'Dome/actions', 'Dome/events'];
    // Generate the Link headers
    if (properties['@context']) type = properties['@context'];
    else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    res.links({
      state:'/state',
      temperature:'/temperature',
      humidity:'/humidity',
      pressure:'/pressure',
      rainfall:'/rainfall',
      windSpeed:'/windSpeed',
      windDirection:'/windDirection'
      //type: type
    });
    next();
  });

  // GET /Dome/properties/{id}
  router.route('/WoT/Dome/properties' + '/:id').get(function (req, res, next) {
    req.model = model;
    req.propertyModel = properties.resources[req.params.id];
    req.type = 'property';
    req.entityId = req.params.id;
    req.uri = 'Dome';
    req.result = properties.resources[req.entityId];

    // Generate the Link headers
    if (properties.resources[req.params.id]['@context']) type = properties.resources[req.params.id]['@context'];
    else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    res.links({
      //type: type
    });
    next();
  });
};

function createDomeActionsRoutes(model) {
  var actions = model.links.actions;
  // GET /Dome/actions
  router.route('/WoT/Dome/actions').get(function (req, res, next) {
    req.model = model;
    req.type = 'actions';
    req.entityId = 'actions';
    req.uri = 'Dome';
    req.result = utils.modelToResources(actions.resources, true);

    if (actions['@context']) type = actions['@context'];
    else type = 'http://ofs.fi.upm.es/model/#actions-resource';

    res.links({
      //type: type
    });
    next();
  });

  // GET /Dome/actions/{actionType}
  router.route('/WoT/Dome/actions' + '/:actionType').get(function (req, res, next) {
    req.model = model;
    req.actionModel = actions.resources[req.params.actionType];
    req.type = 'action';
    req.entityId = req.params.actionType;
    req.uri = 'Dome';
    req.result = actions.resources[req.entityId];

    if (actions.resources[req.params.actionType]['@context']) type = actions.resources[req.params.actionType]['@context'];
    else type = 'http://ofs.fi.upm.es/model/#actions-resource';

    res.links({
      //type: type
    });
    next();
  });


  // POST /Dome/actions/{actionType}
  /*router.route('/Dome/actions' + '/:actionType').post(function (req, res, next) {
    var act = req.body;
    //console.log(act.data[0].action); // acción que le llega dentro del array data. Ej: "data":[{"action":"CLOSE"}]
    //action.id = uuid.v1();
    //action.status = "pending";
    //action.timestamp = utils.isoTimestamp();
    //utils.cappedPush(actions.resources[req.params.actionType].data, action);
    //res.location(req.originalUrl + '/' + action.id);   }

    if(req.params.actionType == "OpenCloseShutter"){
        var shutter= act.data[0];//.action;
        if(shutter.action1 === "OPEN" && shutter.action2 === "CLOSE"){}//No hacer nada más abajo ya entra por ERROR
        else if(shutter.action1 === "OPEN")var shutter="OPEN";
        else if(shutter.action2 === "CLOSE")var shutter="CLOSE";
        else res.send('Error: Action not defined');

        if(shutter !== undefined && shutter !== null && shutter === "OPEN"){
          console.log("Dome Action:");
          console.log(".....Open shutter");
          //Publicar action en rabbitmq

          res.send('Action POST received');
        }
        else if(shutter !== undefined && shutter !== null && shutter === "CLOSE"){
          console.log("Dome Action:");
          console.log(".....Open shutter");
          //Publicar action en rabbitmq

          res.send('Action POST received');
        }
        else{res.send('Error: Action not defined');}
    }
    else{
        res.send('Error: Action not defined');
    }
    //next();
  });*/
};


function createDomeEventsRoutes(model) {
  var events = model.links.events;
  // GET /Dome/events
  router.route('/WoT/Dome/events').get(function (req, res, next) {
    req.model = model;
    req.type = 'events';
    req.entityId = 'events';
    req.uri = 'Dome';
    req.result = utils.modelToResources(events.resources, true);

    if (events['@context']) type = events['@context'];
    else type = 'http://ofs.fi.upm.es/model/#events-resource';

    res.links({
      //HighTemperature:'/HighTemperature',
      //Rain:'/Rain',
      //StrongWind:'/StrongWind',
      //type: type
    });
    next();
  });

  // GET /Dome/events/{eventType}
  router.route('/WoT/Dome/events' + '/:eventType').get(function (req, res, next) {
    req.model = model;
    req.eventModel = events.resources[req.params.eventType];
    req.type = 'event';
    req.entityId = req.params.eventType;
    req.uri = 'Dome';
    req.result = events.resources[req.entityId];

    if (events.resources[req.params.eventType]['@context']) type = events.resources[req.params.eventType]['@context'];
    else type = 'http://ofs.fi.upm.es/model/#events-resource';

    res.links({
      //type: type
    });
    next();
  });
};

//-----------------------------CAMERA----------------------------------------------------
function createCameraRoute(model){
  //GET'/Camera'
  router.route('/WoT/Camera').get(function(req, res, next){
    req.model = model;
    req.type = 'root'; //nombre del html en la carpeta view
    req.uri = 'Camera';

    //var fields = ['id','name','description','tags','customFields'];
    var fields = ['name','description','base', 'port', 'address', 'geo', 'tags'];
    //Extrae los campos requeridos del modelo, añade el objeto a result
    req.result = utils.extractFields(fields,model);
    req.links = ['Camera/model', 'Camera/properties', 'Camera/actions', 'Camera/events'];

    if (model['@context']) type = model['@context'];
    else type = 'http://ofs.fi.upm.es/model';

//Crea encabezado de enlace que direcciona a recursos
    res.links({
      model: '/model/',
      properties: '/properties/',
      actions: '/actions/',
      events: '/events/',
      //things: '/things/',
      ui: '/',
      //type: type
    });
    next();//llama a la siguiente representacion middleware
});
};

function createCameraModelRoutes(model) {
  // GET /Camera/model
  router.route('/WoT/Camera/model').get(function (req, res, next) {
    req.result = JSON.stringify(model,undefined,2);
    req.model = model;
    req.uri = "Camera";
    req.entityId = "model";
    req.type = 'cameraLD';

    if (model['@context']) type = model['@context'];
    else type = 'http://ofs.fi.upm.es/model';
    res.links({
      //type: type
    });
    next();
  });
};

function createCameraPropertiesRoutes(model) {
  var properties = model.links.properties;
  // GET /Camera/properties
  router.route('/WoT/Camera/properties').get(function (req, res, next) {
    req.model = model;
    req.type = 'properties';
    req.entityId = 'properties';
    req.uri = 'Camera';
    req.result = utils.modelToResources(properties.resources, true);
    req.links = ['Camera/properties', 'Camera/actions', 'Camera/events'];
    // Generate the Link headers
    if (properties['@context']) type = properties['@context'];
    else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    res.links({
     //type: type
    });
    next();
  });

  // GET /Camera/properties/Photo/id
  router.route('/WoT/Camera/properties/Photo' + '/:id').get(function (req, res, next) {
    req.model = model;
    req.type = 'properties';
    req.entityId = 'properties';
    req.uri = 'Camera';
    req.result = utils.modelToResources(properties.resources, true);
    req.links = ['Camera/properties', 'Camera/actions', 'Camera/events'];

    var indent = req.params.id;

    //Prueba de tomar fotos preparado para primero hacer una foto con valores adecuados,
    //luego 1 foto con poco brillo, mucho contraste
    //luego 1 foto con mucho brillo y poco contraste
    //Luego pedir 3 fotos con poco tiempo y valores adecuados que dará la misma foto para los 3 id
    //foto 1,4,5,6 son la misma; foto 2 es con poco brillo, mucho contraste; foto 3 mucho brillo y poco contraste
    if(indent == 1 || indent == 4 || indent == 5 || indent == 6){ //Si me piden las fotos 1,4,5,6 le doy image1.jpg
        var img  = fs.readFileSync('./image1.jpg');
        res.writeHead(200, {'Content-Type': 'image/gif' });
        res.end(img, 'binary');
    }
    else if(indent == 2){
        var img  = fs.readFileSync('./image2.jpg');
        res.writeHead(200, {'Content-Type': 'image/gif' });
        res.end(img, 'binary');
    }
    else if(indent == 3){
        var img  = fs.readFileSync('./image3.jpg');
        res.writeHead(200, {'Content-Type': 'image/gif' });
        res.end(img, 'binary');
    }
    else{
        // Generate the Link headers
        if (properties['@context']) type = properties['@context'];
        else type = 'http://ofs.fi.upm.es/model/#properties-resource';

        res.links({
          //type: type
        });
        res.send('Error: ID not defined');
        //next();
    }
  });

  // GET /Camera/properties/{id}
  router.route('/WoT/Camera/properties' + '/:id').get(function (req, res, next) {
    req.model = model;
    req.propertyModel = properties.resources[req.params.id];
    req.type = 'property';
    req.entityId = req.params.id;
    req.uri = 'Camera';
    req.result = properties.resources[req.entityId];

    // Generate the Link headers
    if (properties.resources[req.params.id]['@context']) type = properties.resources[req.params.id]['@context'];
    else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    res.links({
      //type: type
    });
    next();
  });
  //Para actualizar los properties que son "writeable"
  // PUT /Camera/properties/{actionType}
    router.route('/WoT/Camera/properties' + '/:propertyType').put(function (req, res, next) {
      //Prueba: {"name":"ExposureTime","description":"Exposure time for each of the photos.","values":{"st":{"name":"ExposureTime","description":"Exposure time for each of the photos.","unit":{"Hour":"nonNegativeInteger","Minute":"nonNegativeInteger","Second":"nonNegativeInteger"},"type":"nonNegativeInteger"}},"tags":["Exposure","Time","public"],"data":{"Hour":0,"Minute":0,"Second":30}}
      var act = req.body;
      if(req.params.propertyType == "ExposureTime"){
          var hour = act.data.Hour;
          var min = act.data.Minute;
          var sec = act.data.Second;
          if(hour !== undefined && hour !== null && min !== undefined && min !== null && sec !== undefined && sec !== null){
              console.log("Camera DMK Property PUT:");
              console.log(".....Exposure Time");
              //actualización JSON
              var modelExposureTime = utils.findProperty('ExposureTime',model);
              modelExposureTime.data = {"Hour":hour,"Minute":min,"Second":sec, "timestamp":utils.isoTimestamp()};
              //Fin actualización
              res.send('Action PUT received');
          }
          else{res.send('Error: Action not defined');}
      }
      else if(req.params.propertyType == "Gamma"){
          //Prueba: {"name":"Gamma","description":"The gamma correction, as it is called a specific non-linear operation that is used to encode and decode luminance or tristimulus values in video or image systems.","values":{"st":{"name":"Gamma","description":"The gamma correction, as it is called a specific non-linear operation that is used to encode and decode luminance or tristimulus values in video or image systems.","unit":"Gamma","type":"nonNegativeInteger"}},"tags":["Gamma","public"],"data":{"Gamma":26,"timestamp":"Tue May 15 2018 11:31:40 GMT+0200 (CEST)"}}
          var gamma = act.data.Gamma;
          if(gamma !== undefined && gamma !== null){
              console.log("Camera DMK Property PUT:");
              console.log(".....Gamma");
              //actualización JSON
              var modelGamma = utils.findProperty('Gamma',model);
              modelGamma.data = {"Gamma":gamma, "timestamp":utils.isoTimestamp()};
              //Fin actualización
              res.send('Action PUT received');
          }
          else{res.send('Error: Action not defined');}
      }
      else if(req.params.propertyType == "Brightness"){
        //Prueba:{"name":"Brightness","description":"Brightness is a setting that works mainly on halftones, maintaining the lighting of high lights.","values":{"st":{"name":"Brightness","description":"Brightness is a setting that works mainly on halftones, maintaining the lighting of high lights.","unit":"Brightness","type":"float"}},"tags":["Brightness","public"],"data":{"Brightness":120,"timestamp":"Tue May 15 2018 11:38:43 GMT+0200 (CEST)"}}
        var brightness = act.data.Brightness;
        if(brightness !== undefined && brightness !== null){
          console.log("Camera DMK Property PUT:");
          console.log(".....Brightness");
          //actualización JSON
          var modelBrightness = utils.findProperty('Brightness',model);
          modelBrightness.data = {"Brightness":brightness, "timestamp":utils.isoTimestamp()};
          //Fin actualización
          res.send('Action PUT received');
        }
        else{res.send('Error: Action not defined');}
      }
      else if(req.params.propertyType == "NumberOfShoots"){
        //Prueba:{"name":"NumberOfShoots","description":"Number of photos taken by the camera DMK","values":{"st":{"name":"NumberOfShoots","description":"Number of photos taken by the camera DMK","unit":"NumberOfShoots","type":"float"}},"tags":["NumberOfShoots","public"],"data":{"NumberOfShoots":3,"timestamp":"Tue May 15 2018 11:38:43 GMT+0200 (CEST)"}}
        var number = act.data.NumberOfShoots;
        if(number !== undefined && number !== null){
          console.log("Camera DMK Property PUT:");
          console.log(".....Number Of Shoots");
          //actualización JSON
          var modelNumberOfShoots = utils.findProperty('NumberOfShoots',model);
          modelNumberOfShoots.data = {"NumberOfShoots":number, "timestamp":utils.isoTimestamp()};
          //Fin actualización
          res.send('Action PUT received');
        }
        else{res.send('Error: Action not defined');}
      }
      else{res.send('Error: Action not defined');}
      //next();
    });
};

function createCameraActionsRoutes(model) {
  var actions = model.links.actions;
  // GET /Camera/actions
  router.route('/WoT/Camera/actions').get(function (req, res, next) {
    req.model = model;
    req.type = 'actions';
    req.entityId = 'actions';
    req.uri = 'Camera';
    req.result = utils.modelToResources(actions.resources, true);
    req.links = [''];

    if (actions['@context']) type = actions['@context'];
    else type = 'http://ofs.fi.upm.es/model/#actions-resource';

    res.links({
      //type: type
    });
    next();
  });

  // GET /Camera/actions/{actionType}
  router.route('/WoT/Camera/actions' + '/:actionType').get(function (req, res, next) {
    req.model = model;
    req.actionModel = actions.resources[req.params.actionType];
    req.type = 'action';
    req.entityId = req.params.actionType;
    req.uri = "Camera";
    req.result = actions.resources[req.entityId];

    if (actions.resources[req.params.actionType]['@context']) type = actions.resources[req.params.actionType]['@context'];
    else type = 'http://ofs.fi.upm.es/model/#actions-resource';

    res.links({
      //type: type
    });
    next();
  });

  // POST /Camera/actions/{actionType}
  router.route('/WoT/Camera/actions' + '/:actionType').post(function (req, res, next) {
    //Prueba:{"name":"TakePhoto","description":"After doing the Action, photographs are received by events.","values":{"st":{"unit":"TakePhotos","type":"string"}},"tags":["TakePhoto","public"],"data":{"unit":"TakePhotos"}}
    var act = req.body;
    if(req.params.actionType == "TakePhoto"){
        var tkph= act.data.unit;
        if(tkph !== undefined && tkph !== null && tkph == "TakePhotos"){
            console.log("Camera DMK Action:");
            console.log(".....Take Photos");
            res.send('Action POST received');
            var modelActionTakePhoto = utils.findAction('TakePhoto',model);
            console.log(modelActionTakePhoto);
            modelActionTakePhoto.data = {"unit":"TakePhotos", "timestamp":utils.isoTimestamp()};
        }
        else{res.send('Error: Action not defined');}
    }
    else{res.send('Error: Action not defined');}
    //next();
  });


  // GET /Camera/actions/{id}/{actionId}
/*  router.route('/Camera/actions' + '/:actionType/:actionId').get(function (req, res, next) {
    req.result = utils.findObjectInArray(actions.resources[req.params.actionType].data,
      {"id" : req.params.actionId});
    next();
  });*/
};


function createCameraEventsRoutes(model) {
  var events = model.links.events;
  // GET /Camera/events
  router.route('/WoT/Camera/events').get(function (req, res, next) {
    req.model = model;
    req.type = 'events';
    req.entityId = 'events';
    req.uri = 'Camera';
    req.result = utils.modelToResources(events.resources, true);

    if (events['@context']) type = events['@context'];
    else type = 'http://ofs.fi.upm.es/model/#events-resource';

    res.links({
      HighTemperature:'/HighTemperature',
      Rain:'/Rain',
      StrongWind:'/StrongWind',
      //type: type
    });
    next();
  });

  // GET /Camera/events/{eventType}
  router.route('/WoT/Camera/events' + '/:eventType').get(function (req, res, next) {
    req.model = model;
    req.eventModel = events.resources[req.params.eventType];
    req.type = 'event';
    req.entityId = req.params.eventType;
    req.uri = 'Camera';
    req.result = events.resources[req.entityId];

    if (events.resources[req.params.eventType]['@context']) type = events.resources[req.params.eventType]['@context'];
    else type = 'http://ofs.fi.upm.es/model/#events-resource';

    res.links({
      //type: type
    });
    next();
  });
};
//-----------------------------MOUNT----------------------------------------------------
function createMountRoute(model){
  //GET'/Mount'
  router.route('/WoT/Mount').get(function(req, res, next){
    req.model = model;
    req.type = 'root'; //nombre del html en la carpeta view
    req.uri = 'Mount';

    //var fields = ['id','name','description','tags','customFields'];
    var fields = ['name','description','base', 'port', 'address', 'geo', 'tags'];
    //Extrae los campos requeridos del modelo, añade el objeto a result
    req.result = utils.extractFields(fields,model);
    req.links = ['Mount/model', 'Mount/properties', 'Mount/actions', 'Mount/events'];

    if (model['@context']) type = model['@context'];
    else type = 'http://ofs.fi.upm.es/model';

//Crea encabezado de enlace que direcciona a recursos
    res.links({
      model: '/model/',
      properties: '/properties/',
      actions: '/actions/',
      events: '/events/',
      //things: '/things/',
      ui: '/',
      //type: type
    });
    next();//llama a la siguiente representacion middleware
});
};

function createMountModelRoutes(model) {
  // GET /Mount/model
  router.route('/WoT/Mount/model').get(function (req, res, next) {
    req.result = JSON.stringify(model,undefined,2);
    req.model = model;
    req.uri = "Mount";
    req.entityId = "model";
    req.type = 'mountLD';

    if (model['@context']) type = model['@context'];
    else type = 'http://ofs.fi.upm.es/model';
    res.links({
      //type: type
    });
    next();
  });
};

function createMountPropertiesRoutes(model) {
  var properties = model.links.properties;
  // GET /Mount/properties
  router.route('/WoT/Mount/properties').get(function (req, res, next) {
    req.model = model;
    req.type = 'properties';
    req.entityId = 'properties';
    req.uri = 'Mount';
    req.result = utils.modelToResources(properties.resources, true);
    req.links = ['Mount/properties', 'Mount/actions', 'Mount/events'];
    // Generate the Link headers
    if (properties['@context']) type = properties['@context'];
    else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    res.links({
/*      state:'/state',
      temperature:'/temperature',
      humidity:'/humidity',
      pressure:'/pressure',
      rainfall:'/rainfall',
      windSpeed:'/windSpeed',
      windDirection:'/windDirection'*/
      //type: type
    });
    next();
  });

  // GET /Mount/properties/{id}
  router.route('/WoT/Mount/properties' + '/:id').get(function (req, res, next) {
    req.model = model;
    req.propertyModel = properties.resources[req.params.id];
    req.type = 'property';
    req.entityId = req.params.id;
    req.uri = 'Mount';
    req.result = properties.resources[req.entityId];

    // Generate the Link headers
     if (properties['@context']) type = properties['@context'];
     else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    res.links({
      //type: type
    });
    next();
  });
};

function createMountActionsRoutes(model) {
  var actions = model.links.actions;
  // GET /Mount/actions
  router.route('/WoT/Mount/actions').get(function (req, res, next) {
    req.model = model;
    req.type = 'actions';
    req.entityId = 'actions';
    req.uri = 'Mount';
    req.result = utils.modelToResources(actions.resources, true);
    req.links = [''];

    if (actions['@context']) type = actions['@context'];
    else type = 'http://ofs.fi.upm.es/model/#actions-resource';

    res.links({
      //type: type
    });
    next();
  });

  // POST /Mount/actions/{actionType}
  router.route('/WoT/Mount/actions' + '/:actionType').post(function (req, res, next) {
    var act = req.body;
    //console.log(req.params.actionType);
//    action.id = uuid.v1();
//    action.status = "pending";
//    action.timestamp = utils.isoTimestamp();
//    utils.cappedPush(actions.resources[req.params.actionType].data, action);
//    res.location(req.originalUrl + '/' + action.id);
    if(req.params.actionType == "Goto"){   //"data":[{"RA": "6h45m8.9s","DEC": "-16°42'52.1"}]
        try{
        var ra = act.data[0].RA;
        var dec = act.data[0].DEC;
        console.log(ra);
        console.log(dec);
        if(ra !== undefined && ra !== null && dec !== undefined && dec !== null){
            console.log("Mount Action:");
            console.log(".....Goto RA: "+ra);
            console.log(".....Goto DEC: "+dec);
            //Publicar action en rabbitmq
            //Fin publicar en Rabbitmq
            res.send('Action POST received');
         }
         else{res.send('Error: Action not defined');}
         }//try
         catch(err){res.send('Error: Action not defined');}
    }
    else if(req.params.actionType == "setTracking"){
        try{
        var vel = act.data[0].speed;
        if(vel !== undefined && vel !== null){
           console.log("Mount Action:");
           console.log(".....setTracking --> Speed:"+vel);
            //Publicar action en rabbitmq
            //Fin publicar en Rabbitmq
            res.send('Action POST received');
        }
        else{res.send('Error: Action not defined');}
        }//try
        catch(err){res.send('Error: Action not defined');}
    }
    else if(req.params.actionType == "GoPark"){
        try{
        var gopark = act.data[0].action;
        if(gopark !== undefined && gopark !== null && gopark === "GoPark"){
         console.log("Mount Action:");
         console.log(".....GoPark");
         //Publicar action en rabbitmq
         //Fin publicar en Rabbitmq
        res.send('Action POST received');
        }
        else{res.send('Error: Action not defined');}
        }//try
        catch(err){res.send('Error: Action not defined');}
    }
    else if(req.params.actionType == "GoHome"){
        try{
        var gohome = act.data[0].action;
        if(gohome !== undefined && gohome !== null && gohome === "GoHome"){
         console.log("Mount Action:");
         console.log(".....GoHome");
         //Publicar action en rabbitmq
         //Fin publicar en Rabbitmq
        res.send('Action POST received');
        }
        else{res.send('Error: Action not defined');}
        }//try
        catch(err){res.send('Error: Action not defined');}
    }
    else if(req.params.actionType == "GoNorth"){
        actionMount.properties.comando = "moverNorte";
        var json_ = actionMount;

        try{
            var gonorth = act.values.st.unit.action;
            if(gonorth !== undefined && gonorth !== null && gonorth === "GoNorth"){
             console.log("Mount Action:");
             console.log(".....GoNorth");

             //Publicar action en rabbitmq
             var amqp = require('amqplib/callback_api');

             //amqp.connect('amqp://venus:venuspass@localhost', function(err, conn) {
             amqp.connect('amqp://localhost', function(err, conn) {
               conn.createChannel(function(err, ch) {
                 var ex = 'pasarela';
                 var args = process.argv.slice(2);
                 var msg = args.slice(1).join(' ') || 'Hello World!';
                 var severity = (args.length > 0) ? args[0] : 'info';

                 ch.assertExchange(ex, 'direct', {durable: false});
                 ch.publish(ex, severity, new Buffer(JSON.stringify(json_))); //msg
                 //console.log(json_);
                 //console.log(" [x] Sent %s: '%s'", severity, msg);
               });

               setTimeout(function() { conn.close(); process.exit(0) }, 500);
             });
             //Fin publicar en Rabbitmq

             res.send('Action POST received');
            }
            else{
                res.send('Error: Action not defined');}
        }//try
        catch(err){
          res.send('Error: Action not defined');
        }
    }
        else if(req.params.actionType == "Stop"){
            actionMount.properties.comando = "parar";
            var json_ = actionMount;

            try{
                var stop = act.values.st.unit.action;
                if(stop !== undefined && stop !== null && stop === "Stop"){
                 console.log("Mount Action:");
                 console.log(".....Stop");

                 //Publicar action en rabbitmq
                 var amqp = require('amqplib/callback_api');

                 amqp.connect('amqp://localhost', function(err, conn) {
                   conn.createChannel(function(err, ch) {
                     var ex = 'montura';
                     var args = process.argv.slice(2);
                     var msg = args.slice(1).join(' ') || 'Hello World!';
                     var severity = (args.length > 0) ? args[0] : 'info';

                     ch.assertExchange(ex, 'direct', {durable: false});
                     ch.publish(ex, severity, new Buffer(JSON.stringify(json_))); //msg
                     //console.log(json_);
                     //console.log(" [x] Sent %s: '%s'", severity, msg);
                   });

                   setTimeout(function() { conn.close(); process.exit(0) }, 500);
                 });
                 //Fin publicar en Rabbitmq

                 res.send('Action POST received');
                }
                else{
                    res.send('Error: Action not defined');}
            }//try
            catch(err){
              res.send('Error: Action not defined');
            }
        }
    else{
    res.send('Error: Action not defined');
    }

    //next();
  });

  // GET /Mount/actions/{actionType}
  router.route('/WoT/Mount/actions' + '/:actionType').get(function (req, res, next) {
    req.model = model;
    req.actionModel = actions.resources[req.params.actionType];
    req.type = 'action';
    req.entityId = req.params.actionType;
    req.uri = 'Mount';
    req.result = actions.resources[req.entityId];

    if (actions.resources[req.params.actionType]['@context']) type = actions.resources[req.params.actionType]['@context'];
    else type = 'http://ofs.fi.upm.es/model/#actions-resource';

    res.links({
      //type: type
    });
    next();
  });

  // GET /Mount/actions/{id}/{actionId}
/*  router.route('/Mount/actions' + '/:actionType/:actionId').get(function (req, res, next) {
    req.result = utils.findObjectInArray(actions.resources[req.params.actionType].data,
      {"id" : req.params.actionId});
    next();
  });*/
};


function createMountEventsRoutes(model) {
  var events = model.links.events;
  // GET /Mount/events
  router.route('/WoT/Mount/events').get(function (req, res, next) {
    req.model = model;
    req.type = 'events';
    req.entityId = 'events';
    req.uri = 'Mount';
    req.result = utils.modelToResources(events.resources, true);

    if (events['@context']) type = events['@context'];
    else type = 'http://ofs.fi.upm.es/model/#events-resource';

    res.links({
      HighTemperature:'/HighTemperature',
      Rain:'/Rain',
      StrongWind:'/StrongWind',
      //type: type
    });
    next();
  });

  // GET /Mount/events/{eventType}
  router.route('/WoT/Mount/events' + '/:eventType').get(function (req, res, next) {
    req.model = model;
    req.eventModel = events.resources[req.params.eventType];
    req.type = 'event';
    req.entityId = req.params.eventType;
    req.uri = 'Mount';
    req.result = events.resources[req.entityId];

    if (events.resources[req.params.eventType]['@context']) type = events.resources[req.params.eventType]['@context'];
    else type = 'http://ofs.fi.upm.es/model/#events-resource';

    res.links({
      //type: type
    });
    next();
  });
};
//-----------------------------CAMERA INSIDE 1----------------------------------------------------
function createCameraInsideRoute(model){
  //GET'/Camera_inside'
  router.route('/WoT/Camera_inside_1').get(function(req, res, next){
    req.model = model;
    req.type = 'root'; //nombre del html en la carpeta view
    req.uri = 'Camera_inside_1';

    //var fields = ['id','name','description','tags','customFields'];
    var fields = ['name','description','base', 'port', 'address', 'geo', 'tags'];
    //Extrae los campos requeridos del modelo, añade el objeto a result
    req.result = utils.extractFields(fields,model);
    req.links = ['Camera_inside/model', 'Camera_inside/properties', 'Camera_inside/actions', 'Camera_inside/events'];

    if (model['@context']) type = model['@context'];
    else type = 'http://ofs.fi.upm.es/model';

//Crea encabezado de enlace que direcciona a recursos
    res.links({
      model: '/model/',
      properties: '/properties/',
      actions: '/actions/',
      events: '/events/',
      //things: '/things/',
      ui: '/',
      //type: type
    });
    next();//llama a la siguiente representacion middleware
});
};

function createCameraInsideModelRoutes(model) {
  // GET /Camera_inside/model
  router.route('/WoT/Camera_inside_1/model').get(function (req, res, next) {
    req.result = JSON.stringify(model,undefined,2);
    req.model = model;
    req.uri = "Camera_inside_1";
    req.entityId = "model";
    req.type = 'camera_insideLD';

    if (model['@context']) type = model['@context'];
    else type = 'http://ofs.fi.upm.es/model';
    res.links({
      //type: type
    });
    next();
  });
};

function createCameraInsidePropertiesRoutes(model) {
  var properties = model.links.properties;
  // GET /Camera_inside/properties
  router.route('/WoT/Camera_inside_1/properties').get(function (req, res, next) {
    req.model = model;
    req.type = 'properties';
    req.entityId = 'properties';
    req.uri = 'Camera_inside_1';
    req.result = utils.modelToResources(properties.resources, true);
    req.links = ['Camera_inside/properties', 'Camera_inside/actions', 'Camera_inside/events'];
    // Generate the Link headers
    if (properties['@context']) type = properties['@context'];
    else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    res.links({
//      state:'/state',
//      temperature:'/temperature',
//      humidity:'/humidity',
//      pressure:'/pressure',
//      rainfall:'/rainfall',
//      windSpeed:'/windSpeed',
//      windDirection:'/windDirection'
      //type: type
    });
    next();
  });

  // GET /Camera_inside/properties/{id}
  router.route('/WoT/Camera_inside_1/properties' + '/:id').get(function (req, res, next) {
    req.model = model;
    req.propertyModel = properties.resources[req.params.id];
    req.type = 'property';
    req.entityId = req.params.id;
    req.uri = 'Camera_inside_1';
    if(req.params.id == 'NewPhoto'){
            var img  = fs.readFileSync('/home/pluton/backend/cameras/internal1.jpg');
            res.writeHead(200, {'Content-Type': 'image/gif' });
            res.end(img, 'binary');
    }else{
    req.result = properties.resources[req.entityId];

    // Generate the Link headers
     if (properties['@context']) type = properties['@context'];
     else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    //res.links({
      //type: type
    //});
    next();
    }
  });
};

function createCameraInsideActionsRoutes(model) {
  var actions = model.links.actions;
  // GET /Camera_inside/actions
  router.route('/WoT/Camera_inside_1/actions').get(function (req, res, next) {
    req.model = model;
    req.type = 'actions';
    req.entityId = 'actions';
    req.uri = 'Camera_inside_1';
    req.result = utils.modelToResources(actions.resources, true);
    req.links = [''];

    if (actions['@context']) type = actions['@context'];
    else type = 'http://ofs.fi.upm.es/model/#actions-resource';

    res.links({
      //type: type
    });
    next();
  });

  // POST /Camera_inside/actions/{actionType}
  router.route('/WoT/Camera_inside_1/actions' + '/:actionType').post(function (req, res, next) {
    var action = req.body;
    action.id = uuid.v1();
    action.status = "pending";
    action.timestamp = utils.isoTimestamp();
    utils.cappedPush(actions.resources[req.params.actionType].data, action);
    res.location(req.originalUrl + '/' + action.id);

    next();
  });


  // GET /Camera_inside/actions/{actionType}
  router.route('/WoT/Camera_inside_1/actions' + '/:actionType').get(function (req, res, next) {

    req.result = reverseResults(actions.resources[req.params.actionType].data);
    req.actionModel = actions.resources[req.params.actionType];
    req.model = model;

    req.type = 'action';
    req.entityId = req.params.actionType;

     if (properties['@context']) type = properties['@context'];
        else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    res.links({
      type: type
    });
    next();
  });

  // GET /Camera_inside/actions/{id}/{actionId}
  router.route('/WoT/Camera_inside_1/actions' + '/:actionType/:actionId').get(function (req, res, next) {
    req.result = utils.findObjectInArray(actions.resources[req.params.actionType].data,
      {"id" : req.params.actionId});
    next();
  });
};


function createCameraInsideEventsRoutes(model) {
  var events = model.links.events;
  // GET /Camera_inside/events
  router.route('/WoT/Camera_inside_1/events').get(function (req, res, next) {
    req.model = model;
    req.type = 'events';
    req.entityId = 'events';
    req.uri = 'Camera_inside_1';
    req.result = utils.modelToResources(events.resources, true);

    if (events['@context']) type = events['@context'];
    else type = 'http://ofs.fi.upm.es/model/#events-resource';

    res.links({
/*      HighTemperature:'/HighTemperature',
      Rain:'/Rain',
      StrongWind:'/StrongWind',*/
      //type: type
    });
    next();
  });

  // GET /Camera_inside/events/{eventType}
  router.route('/WoT/Camera_inside_1/events' + '/:eventType').get(function (req, res, next) {
    req.model = model;
    req.eventModel = events.resources[req.params.eventType];
    req.type = 'event';
    req.entityId = req.params.eventType;
    req.uri = 'Camera_inside_1';
    req.result = events.resources[req.entityId];

     if (events['@context']) type = events['@context'];
        else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    res.links({
      //type: type
    });
    next();
  });
};
//-----------------------------CAMERA INSIDE 2----------------------------------------------------
function createCameraInsideRoute(model){
  //GET'/Camera_inside'
  router.route('/WoT/Camera_inside_2').get(function(req, res, next){
    req.model = model;
    req.type = 'root'; //nombre del html en la carpeta view
    req.uri = 'Camera_inside_2';

    //var fields = ['id','name','description','tags','customFields'];
    var fields = ['name','description','base', 'port', 'address', 'geo', 'tags'];
    //Extrae los campos requeridos del modelo, añade el objeto a result
    req.result = utils.extractFields(fields,model);
    req.links = ['Camera_inside/model', 'Camera_inside/properties', 'Camera_inside/actions', 'Camera_inside/events'];

    if (model['@context']) type = model['@context'];
    else type = 'http://ofs.fi.upm.es/model';

//Crea encabezado de enlace que direcciona a recursos
    res.links({
      model: '/model/',
      properties: '/properties/',
      actions: '/actions/',
      events: '/events/',
      //things: '/things/',
      ui: '/',
      //type: type
    });
    next();//llama a la siguiente representacion middleware
});
};

function createCameraInsideModelRoutes(model) {
  // GET /Camera_inside/model
  router.route('/WoT/Camera_inside_2/model').get(function (req, res, next) {
    req.result = JSON.stringify(model,undefined,2);
    req.model = model;
    req.uri = "Camera_inside_2";
    req.entityId = "model";
    req.type = 'camera_insideLD';

    if (model['@context']) type = model['@context'];
    else type = 'http://ofs.fi.upm.es/model';
    res.links({
      //type: type
    });
    next();
  });
};

function createCameraInsidePropertiesRoutes(model) {
  var properties = model.links.properties;
  // GET /Camera_inside/properties
  router.route('/WoT/Camera_inside_2/properties').get(function (req, res, next) {
    req.model = model;
    req.type = 'properties';
    req.entityId = 'properties';
    req.uri = 'Camera_inside_2';
    req.result = utils.modelToResources(properties.resources, true);
    req.links = ['Camera_inside/properties', 'Camera_inside/actions', 'Camera_inside/events'];
    // Generate the Link headers
    if (properties['@context']) type = properties['@context'];
    else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    res.links({
//      state:'/state',
//      temperature:'/temperature',
//      humidity:'/humidity',
//      pressure:'/pressure',
//      rainfall:'/rainfall',
//      windSpeed:'/windSpeed',
//      windDirection:'/windDirection'
      //type: type
    });
    next();
  });

  // GET /Camera_inside/properties/{id}
  router.route('/WoT/Camera_inside_2/properties' + '/:id').get(function (req, res, next) {
    req.model = model;
    req.propertyModel = properties.resources[req.params.id];
    req.type = 'property';
    req.entityId = req.params.id;
    req.uri = 'Camera_inside_2';
    if(req.params.id == 'NewPhoto'){
            var img  = fs.readFileSync('/home/pluton/backend/cameras/internal1.jpg');
            res.writeHead(200, {'Content-Type': 'image/gif' });
            res.end(img, 'binary');
    }else{
    req.result = properties.resources[req.entityId];

    // Generate the Link headers
     if (properties['@context']) type = properties['@context'];
     else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    //res.links({
      //type: type
    //});
    next();
    }
  });
};

function createCameraInsideActionsRoutes(model) {
  var actions = model.links.actions;
  // GET /Camera_inside/actions
  router.route('/WoT/Camera_inside_2/actions').get(function (req, res, next) {
    req.model = model;
    req.type = 'actions';
    req.entityId = 'actions';
    req.uri = 'Camera_inside_2';
    req.result = utils.modelToResources(actions.resources, true);
    req.links = [''];

    if (actions['@context']) type = actions['@context'];
    else type = 'http://ofs.fi.upm.es/model/#actions-resource';

    res.links({
      //type: type
    });
    next();
  });

  // POST /Camera_inside/actions/{actionType}
  router.route('/WoT/Camera_inside_2/actions' + '/:actionType').post(function (req, res, next) {
    var action = req.body;
    action.id = uuid.v1();
    action.status = "pending";
    action.timestamp = utils.isoTimestamp();
    utils.cappedPush(actions.resources[req.params.actionType].data, action);
    res.location(req.originalUrl + '/' + action.id);

    next();
  });


  // GET /Camera_inside/actions/{actionType}
  router.route('/WoT/Camera_inside_2/actions' + '/:actionType').get(function (req, res, next) {

    req.result = reverseResults(actions.resources[req.params.actionType].data);
    req.actionModel = actions.resources[req.params.actionType];
    req.model = model;

    req.type = 'action';
    req.entityId = req.params.actionType;

     if (properties['@context']) type = properties['@context'];
        else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    res.links({
      type: type
    });
    next();
  });

  // GET /Camera_inside/actions/{id}/{actionId}
  router.route('/WoT/Camera_inside_2/actions' + '/:actionType/:actionId').get(function (req, res, next) {
    req.result = utils.findObjectInArray(actions.resources[req.params.actionType].data,
      {"id" : req.params.actionId});
    next();
  });
};


function createCameraInsideEventsRoutes(model) {
  var events = model.links.events;
  // GET /Camera_inside/events
  router.route('/WoT/Camera_inside_2/events').get(function (req, res, next) {
    req.model = model;
    req.type = 'events';
    req.entityId = 'events';
    req.uri = 'Camera_inside_2';
    req.result = utils.modelToResources(events.resources, true);

    if (events['@context']) type = events['@context'];
    else type = 'http://ofs.fi.upm.es/model/#events-resource';

    res.links({
/*      HighTemperature:'/HighTemperature',
      Rain:'/Rain',
      StrongWind:'/StrongWind',*/
      //type: type
    });
    next();
  });

  // GET /Camera_inside/events/{eventType}
  router.route('/WoT/Camera_inside_2/events' + '/:eventType').get(function (req, res, next) {
    req.model = model;
    req.eventModel = events.resources[req.params.eventType];
    req.type = 'event';
    req.entityId = req.params.eventType;
    req.uri = 'Camera_inside_2';
    req.result = events.resources[req.entityId];

     if (events['@context']) type = events['@context'];
        else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    res.links({
      //type: type
    });
    next();
  });
};
//-----------------------------CAMERA OUTSIDE----------------------------------------------------
function createCameraOutsideRoute(model){
  //GET'/Camera_outside'
  router.route('/WoT/Camera_outside').get(function(req, res, next){
    req.model = model;
    req.type = 'root'; //nombre del html en la carpeta view
    req.uri = 'Camera_outside';

    //var fields = ['id','name','description','tags','customFields'];
    var fields = ['name','description','base', 'port', 'address', 'geo', 'tags'];
    //Extrae los campos requeridos del modelo, añade el objeto a result
    req.result = utils.extractFields(fields,model);
    req.links = ['Camera_outside/model', 'Camera_outside/properties', 'Camera_outside/actions', 'Camera_outside/events'];

    if (model['@context']) type = model['@context'];
    else type = 'http://ofs.fi.upm.es/model';

//Crea encabezado de enlace que direcciona a recursos
    res.links({
      model: '/model/',
      properties: '/properties/',
      actions: '/actions/',
      events: '/events/',
      //things: '/things/',
      ui: '/',
      //type: type
    });
    next();//llama a la siguiente representacion middleware
});
};

function createCameraOutsideModelRoutes(model) {
  // GET /Camera_outside/model
  router.route('/WoT/Camera_outside/model').get(function (req, res, next) {
    req.result = JSON.stringify(model,undefined,2);
    req.model = model;
    req.uri = "Camera_outside";
    req.entityId = "model";
    req.type = 'camera_outsideLD';

    if (model['@context']) type = model['@context'];
    else type = 'http://ofs.fi.upm.es/model';
    res.links({
      //type: type
    });
    next();
  });
};

function createCameraOutsidePropertiesRoutes(model) {
  var properties = model.links.properties;
  // GET /Camera_outside/properties
  router.route('/WoT/Camera_outside/properties').get(function (req, res, next) {
    req.model = model;
    req.type = 'properties';
    req.entityId = 'properties';
    req.uri = 'Camera_outside';
    req.result = utils.modelToResources(properties.resources, true);

    req.links = ['Camera_outside/properties', 'Camera_outside/actions', 'Camera_outside/events'];
    // Generate the Link headers
    if (properties['@context']) type = properties['@context'];
    else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    res.links({
/*      state:'/state',
      temperature:'/temperature',
      humidity:'/humidity',
      pressure:'/pressure',
      rainfall:'/rainfall',
      windSpeed:'/windSpeed',
      windDirection:'/windDirection'
      //type: type*/
    });
    next();
  });

  // GET /Camera_outside/properties/{id}
  router.route('/WoT/Camera_outside/properties' + '/:id').get(function (req, res, next) {
    req.model = model;
    req.propertyModel = properties.resources[req.params.id];
    req.type = 'property';
    req.entityId = req.params.id;
    req.uri = 'Camera_outside';
    if(req.params.id == 'NewPhoto'){
        var img  = fs.readFileSync('/home/pluton/backend/cameras/external.jpg');
        res.writeHead(200, {'Content-Type': 'image/gif' });
        res.end(img, 'binary');
    }
    else{
    req.result = properties.resources[req.entityId];

    // Generate the Link headers
     if (properties['@context']) type = properties['@context'];
        else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    //res.links({
      //type: type
    //});
    next();
    }
  });
};

function createCameraOutsideActionsRoutes(model) {
  var actions = model.links.actions;
  // GET /Camera_outside/actions
  router.route('/WoT/Camera_outside/actions').get(function (req, res, next) {
    req.model = model;
    req.type = 'actions';
    req.entityId = 'actions';
    req.uri = 'Camera_outside';
    req.result = utils.modelToResources(actions.resources, true);

    req.links = [''];

    if (actions['@context']) type = actions['@context'];
    else type = 'http://ofs.fi.upm.es/model/#actions-resource';

    res.links({
      //type: type
    });
    next();
  });

  // POST /Camera_outside/actions/{actionType}
  router.route('/WoT/Camera_outside/actions' + '/:actionType').post(function (req, res, next) {
    var action = req.body;
    action.id = uuid.v1();
    action.status = "pending";
    action.timestamp = utils.isoTimestamp();
    utils.cappedPush(actions.resources[req.params.actionType].data, action);
    res.location(req.originalUrl + '/' + action.id);

    next();
  });


  // GET /Camera_outside/actions/{actionType}
  router.route('/WoT/Camera_outside/actions' + '/:actionType').get(function (req, res, next) {

    req.result = reverseResults(actions.resources[req.params.actionType].data);
    req.actionModel = actions.resources[req.params.actionType];
    req.model = model;

    req.type = 'action';
    req.entityId = req.params.actionType;

     if (actions['@context']) type = actions['@context'];
        else type = 'http://ofs.fi.upm.es/model/#properties-resource';

    res.links({
      type: type
    });
    next();
  });

  // GET /Camera_outside/actions/{id}/{actionId}
  router.route('/Camera_outside/actions' + '/:actionType/:actionId').get(function (req, res, next) {
    req.result = utils.findObjectInArray(actions.resources[req.params.actionType].data,
      {"id" : req.params.actionId});
    next();
  });
};


function createCameraOutsideEventsRoutes(model) {
  var events = model.links.events;
  // GET /Camera_outside/events
  router.route('/WoT/Camera_outside/events').get(function (req, res, next) {
    req.model = model;
    req.type = 'events';
    req.entityId = 'events';
    req.uri = 'Camera_outside';
    req.result = utils.modelToResources(events.resources, true);

    if (events['@context']) type = events['@context'];
    else type = 'http://ofs.fi.upm.es/model/#events-resource';

    res.links({
//      HighTemperature:'/HighTemperature',
//      Rain:'/Rain',
//      StrongWind:'/StrongWind',
      //type: type
    });
    next();
  });

  // GET /Camera_outside/events/{eventType}
  router.route('/WoT/Camera_outside/events' + '/:eventType').get(function (req, res, next) {
    req.model = model;
    req.eventModel = events.resources[req.params.eventType];
    req.type = 'event';
    req.entityId = req.params.eventType;
    req.uri = 'Camera_outside';
    req.result = events.resources[req.entityId];

    if (events.resources[req.params.eventType]['@context']) type = events.resources[req.params.eventType]['@context'];
    else type = 'http://ofs.fi.upm.es/model/#events-resource';

    res.links({
      //type: type
    });
    next();
  });
};
//---------------------------------------------------------------------------------------
function createDefaultData(resources) {
  Object.keys(resources).forEach(function (resKey) {
    var resource = resources[resKey];
    resource.data = [];
  });
}

function reverseResults(array) {
  return array.slice(0).reverse();
}

function obtenerToken(json_, callback){
        //enviar a pasarela IoT el login
       request({
          url: "http://ofs.fi.upm.es/api/login",
          method: "POST",
          json: true,
          timeout: 30000,
          followRedirect: true,
          maxRedirects: 2,
          body: json_
          },function(error, response, body){
            //console.log(response.statusCode);
            if(!error && response.statusCode == 200){
              var resp = JSON.stringify(response.body.token);
              var tk1 = resp.replace('"','');
              var tk2 = tk1.replace('"','');
              //obtener token
              var token = 'Bearer '+tk2;
              //console.log(token);

              if(resp != null){
                callback(token);
              }else{
               callback(null);
              }
            }else{callback(null);}
          });
}

function obtenerReservas(token, callback){
//enviar peticion de consulta de reserva actual
                var auth = "Authorization";
                request({
                  url: "http://ofs.fi.upm.es/api/reservations/own",
                  method: "GET",
                  timeout: 30000,
                  followRedirect: true,
                  maxRedirects: 2,
                  json: true,
                  headers: {
                    "Authorization" : token
                  }
                },function(error, response, body){
                    if(!error && response.statusCode == 200){
                      resp = JSON.stringify(response.body);
                      //console.log(resp);
                      callback(resp);//devuelve el array de JSONs con las reservas del usuario
                    }
                    else{
                        callback(null);
                    }
                });
}

function comprobarReservaUser(arrReservas){
    var bool = false;
    var reservas = JSON.parse(arrReservas); //Array de reservas
    var tam = reservas.length;

    //current date
    var datetime = new Date();
    //console.log(datetime);

    //Recorrer todas las reservas, obtener las fechas de inicio y fin y comparar con fecha actual para ver si tiene reserva
    for( i = 0; i < tam; i++){
        var startD = new Date(reservas[i].startDate);
        var endD   = new Date(reservas[i].endDate);

        //console.log(datetime,endD);
        //if(startD < datetime) console.log('TRUE');

        if((startD < datetime) && (datetime < endD)){
            bool = true;
            //Se lanza proceso que cambiará el token cuando se termine la reserva
            //generará un token nuevo invalidando el acceso al usuario por fin de reserva
            utils.endReserva(endD);
        }
    }
    return bool;
}