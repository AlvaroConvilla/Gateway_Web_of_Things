var keys = require('../resources/secure/auth'),
modelSecure = require('./../resources/modelSecure');

var token2;

module.exports = function() {
  return function (req, res, next) {
    //console.log(req.method + " " + req.path);
    if (req.path.substring(0, 5) === "/css/") {
      next(); //#A

    } else {
      var token = req.body.token || req.get('authorization') || req.query.token; //#B
      //console.log(req.path);
      var path = req.path;
          if (!token) { //#C
            if((path==='/') || (path==='/WoT/login') || (path==='/WoT') || (path==='/WoT/') || (path==='/WoT/model')
            /*|| (path==='/WoT/WeatherStation') || (path==='/WoT/WeatherStation/properties') || (path==='/WoT/WeatherStation/actions') || (path==='/WoT/WeatherStation/events')
            || (path==='/WoT/Mount') || (path==='/WoT/Mount/properties') || (path==='/WoT/Mount/actions') || (path==='/WoT/Mount/events')
            || (path==='/WoT/Dome') || (path==='/WoT/Dome/properties') || (path==='/WoT/Dome/actions') || (path==='/WoT/Dome/events')
            || (path==='/WoT/Camera') || (path==='/WoT/Camera/properties') || (path==='/WoT/Camera/actions') || (path==='/WoT/Camera/events')
            || (path==='/WoT/Camera_inside') || (path==='/WoT/Camera_inside/properties') || (path==='/WoT/Camera_inside/actions') || (path==='/WoT/Camera_inside/events')
            || (path==='/WoT/Camera_outside') || (path==='/WoT/Camera_outside/properties') || (path==='/WoT/Camera_outside/actions') || (path==='/WoT/Camera_outside/events')*/
            ){
                console.log('Access authorized to '+path);
                next();
            }
            else{
              return res.status(401).send({success: false, message: 'API token missing.'});
            }
          } else {
            if (token != modelSecure.data.apiToken){//keys.apiToken) { //#D
              return res.status(403).send({success: false, message: 'API token invalid.'});
            } else { //#E
              next();
            }
          }
    }
  }
};
//#A Allow unauthorized access to the css folder
//#B check header or url parameters or post parameters for token
//#C If no token provided, return 401 UNAUTHORIZED
//#D If token is not a valid API key, return 403 FORBIDDEN
//#E If everything is good, save to request for use in other routes