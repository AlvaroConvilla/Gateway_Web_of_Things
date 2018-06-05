var msgpack = require('msgpack5')(),
  encode = msgpack.encode,
  express = require('express'),
  router = express.Router(),
  Gate_jsonld = require('./../resources/json/GateLD.json'),
  WeatherStation_jsonld = require('./../resources/modelWeatherStationLD'),
  Dome_jsonld = require('./../resources/modelDomeLD'),
  Mount_jsonld = require('./../resources/modelMountLD'),
  Camera_jsonld = require('./../resources/modelCameraLD'),
  CameraInside_jsonld = require('./../resources/modelCameraInsideLD'),
  CameraOutside_jsonld = require('./../resources/modelCameraOutsideLD');

module.exports = function () {
  return function (req, res, next) {
    if (req.result) {

      req.rooturl = req.headers.host;
      req.qp = req._parsedUrl.search;

      if (req.accepts('html')) {

        var helpers = {
          json: function (object) {
            return JSON.stringify(object);
          },
          getById: function (object, id) {
            return object[id];
          }
        };

        // Check if there's a custom renderer for this media type and resource
        if (req.type) res.render(req.type, {req: req, helpers: helpers});
        else res.render('default', {req: req, helpers: helpers});

        return;
      }

      if (req.accepts('application/x-msgpack')) {
        console.info('MessagePack representation selected!');
        res.type('application/x-msgpack');
        res.send(encode(req.result));
        return;
      }

      if (req.accepts('application/ld+json')) {
        console.info('JSON-ld representation selected!');
        //console.info(req.uri);
      	if(req.uri == 'WeatherStation'){
          res.send(WeatherStation_jsonld);
          return;
        }
        else if(req.uri == 'Dome'){
            res.send(Dome_jsonld);
            return;
        }
        else if(req.uri == 'Mount'){
             res.send(Mount_jsonld);
             return;
        }
        else if(req.uri == 'Camera'){
             res.send(Camera_jsonld);
             return;
        }
        else if(req.uri == 'Camera_inside'){
             res.send(Camera_jsonld);
             return;
        }
        else if(req.uri == 'Camera_outside'){
             res.send(Camera_jsonld);
             return;
        }
        else{ //si es la gateway
          res.send(Gate_jsonld);
          return;
        }
      }
      else{//Para todos los demás formatos por defecto en json.
        console.info('Defaulting to JSON representation!');
        res.send(req.result);
      }

    }
    else if (res.location) {
      res.status(204).send();
      return;
    } else {
      next();
    }
  }
};

