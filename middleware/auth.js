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
      //console.log(req.method);
      var path = req.path;
      if ((!token) && (req.method === 'GET')) { //#C
            if((path==='/WoT/Camera/actions/TakePhoto') || (path==='/WoT/Mount/actions/Goto') || (path==='/WoT/Mount/actions/setTracking')
            || (path==='/WoT/Mount/actions/GoPark') || (path==='/WoT/Mount/actions/GoHome') || (path==='/WoT/Mount/actions/GoNorth')
            || (path==='/WoT/Mount/actions/GoNorth') || (path==='/WoT/Camera/properties/ExposureTime') || (path==='/WoT/Camera/properties/ExposureTime')
            || (path==='/WoT/Camera/properties/Gamma') || (path==='/WoT/Camera/properties/Brightness') || (path==='/WoT/Camera/properties/NumberOfShoots')){

                return res.status(401).send({success: false, message: 'API token missing.'});
            }
            else{
                console.log('Access authorized to '+path);
                next();
            }
      }
      else {
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