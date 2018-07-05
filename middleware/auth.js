var keys = require('../resources/secure/auth'),
modelSecure = require('./../resources/modelSecure');
var request = require('request');
var rp = require('request-promise');

var token2;

module.exports = function() {
  return function (req, res, next) {
    //console.log(req.method + " " + req.path);
    if (req.path.substring(0, 5) === "/css/") {
      next(); //#A

    } else {
      var token = req.body.token || req.get('authorization') || req.query.token; //#B
      //console.log(req.path);
          if (!token) { //#C
            if(token='/WoT/login'){ // POST localhost:8484/WoT/login
              //coger Json que nos llega
              var json = req.body;
              console.log(json);
              //enviar a pasarela IoT el login
              request({
                    url: "http://ofs.fi.upm.es/api/login",
                    method: "POST",
                    json: true,
                    timeout: 30000,
                    followRedirect: true,
                    maxRedirects: 2,
                    body: json
                },function(error, response, body){
                    //console.log(error);
                    //console.log(response.statusCode);
                    if(!error && response.statusCode == 200){
                        var resp = JSON.stringify(response.body.token);
                        var tk1 = resp.replace('"','');
                        var tk2 = tk1.replace('"','');
                        //obtener token
                        var token = 'Beare '+tk2;
                        token2 = '"'+token+'"';
                        console.log(token2);

                        if(token != null){
                                      //enviar peticion de consulta de reserva actual
                                      request({
                                                url: "http://ofs.fi.upm.es/api/reservations/own",
                                                method: "GET",
                                                timeout: 30000,
                                                followRedirect: true,
                                                maxRedirects: 2,
                                                headers: {
                                                        'Authorization': token2
                                                    }
                                                //json: true
                                            },function(error, response, body){
                                                console.log(error);
                                                console.log(response.statusCode);
                                                if(!error && response.statusCode == 200){
                                                    var resp = JSON.stringify(response.body.token);
                                                    console.log(resp);
                                                }
                                          });
                                      }
                                      //si coincide con usuario que intenta loggear
                                         //dar acceso enviandole el token de pasarela WoT
                                         return res.status(200).send({token: 'totokenken'});
                                      //sino devolver un 401 credenciales incorrectas
                    }
              });
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