var WebSocketServer = require('ws'),
    resourcesWS = require('./../resources/modelWeatherStation'),
    resourcesDome = require('./../resources/modelDome'),
    resourcesCamDMK = require('./../resources/modelCamera'),
    resourcesMount = require('./../resources/modelMount'),
    resourcesCamIn = require('./../resources/modelCameraInside'),
    resourcesCamOut = require('./../resources/modelCameraOutside'),
    url = require('url'),
    observe = require('object.observe'),
    utils = require('./../utils/utils.js');

exports.listen = function(server){
  //crear un servidor WebSockets pasando el servidor Express
  var wss = new WebSocketServer.Server({server: server});
  console.info('>WebSocket server started...');

  //Se activa tras una actualización del protocolo cuando el cliente conecta
  wss.on('connection', function(ws, req){
    var ruta= req.url;

    try{
      //Registra un observador correspondiente al recurso de la URL de actualización del protocolo
      /*ws.send(JSON.stringify(selectResource(location)));
       Object.observe(selectResource(location), function(changes){
	  ws.send(JSON.stringify(selectResource(location))//, function(){}
        );
       })*/
/////////////////WeatherStation
       if(ruta == '/WeatherStation/properties/demo_grafica'){
          var location = '/links/properties/resources/temperature'; //localización del recurso pedido en el JSON

          ws.send(JSON.stringify(selectResource(location, resourcesWS)));
          Object.observe(selectResource(location, resourcesWS), function(changes){
            try{
               ws.send(JSON.stringify(selectResource(location, resourcesWS)));
            }
            catch(e){
              ws.terminate();
            }
          })
       }
       if(ruta == '/WeatherStation/properties/demo_press'){
                 var location = '/links/properties/resources/pressure'; //localización del recurso pedido en el JSON

                 ws.send(JSON.stringify(selectResource(location, resourcesWS)));
                 Object.observe(selectResource(location, resourcesWS), function(changes){
                   try{
                      ws.send(JSON.stringify(selectResource(location, resourcesWS)));
                   }
                   catch(e){
                     ws.terminate();
                   }
                 })
       }
       if(ruta == '/WeatherStation/properties/demo_windSpeed'){
                        var location = '/links/properties/resources/windSpeed'; //localización del recurso pedido en el JSON

                        ws.send(JSON.stringify(selectResource(location, resourcesWS)));
                        Object.observe(selectResource(location, resourcesWS), function(changes){
                          try{
                             ws.send(JSON.stringify(selectResource(location, resourcesWS)));
                          }
                          catch(e){
                            ws.terminate();
                          }
                        })
       }
       if(ruta == '/WeatherStation/properties/demo_humidity'){
                        var location = '/links/properties/resources/humidity'; //localización del recurso pedido en el JSON

                        ws.send(JSON.stringify(selectResource(location, resourcesWS)));
                        Object.observe(selectResource(location, resourcesWS), function(changes){
                          try{
                             ws.send(JSON.stringify(selectResource(location, resourcesWS)));
                          }
                          catch(e){
                            ws.terminate();
                          }
                        })
              }
       //Evento que avisa a los subscritos si la temperatura ha cambiado
       if(ruta == '/WeatherStation/properties/temperature'){
           var temp = null;
           var location = '/links/properties/resources/temperature'; //localización del recurso pedido en el JSON
           ws.send(JSON.stringify(selectResource(location, resourcesWS)));
           Object.observe(selectResource(location, resourcesWS), function(changes){
               //console.info(changes);
               modelTemperature = utils.findProperty('temperature',resourcesWS);
               if(parseFloat(modelTemperature.data.temperature) != temp){
                   temp = parseFloat(modelTemperature.data.temperature);
                   try{
           	         ws.send(JSON.stringify(selectResource(location, resourcesWS)));
           	       }
           	       catch(e){
           	         ws.terminate();
                   }
               }
           })
       }
       //Evento que avisa a los subscritos si la temperatura es alta para el observatorio
       else if(ruta == '/WeatherStation/events/HighTemperature'){
          var flag = null;
          var location = '/links/events/resources/HighTemperature'; //localización del recurso pedido en el JSON
          //ws.send(JSON.stringify(selectResource(location, resourcesWS)));
          Object.observe(selectResource(location, resourcesWS), function(changes){
            model = utils.findEvent('HighTemperature',resourcesWS);
            if(model.data.state != flag){
                flag = model.data.state;
                try{
                    ws.send(JSON.stringify(selectResource(location, resourcesWS)));
                }
                catch(e){
                    ws.terminate();
                }
            }
          })
       }
       //Evento que avisa a los subscritos si la temperatura es baja para el observatorio
       else if(ruta == '/WeatherStation/events/LowTemperature'){
         var flag = null;
         var location = '/links/events/resources/LowTemperature'; //localización del recurso pedido en el JSON
         //ws.send(JSON.stringify(selectResource(location)));
         Object.observe(selectResource(location, resourcesWS), function(changes){
           model = utils.findEvent('LowTemperature',resourcesWS);
           if(model.data.state != flag){
                flag = model.data.state;
                try{
                   ws.send(JSON.stringify(selectResource(location, resourcesWS)));
                }
                catch(e){
                   ws.terminate();
                }
           }
         })
       }
       //Evento que avisa a los observadores sobre que está lloviendo
       else if(ruta == '/WeatherStation/events/Rain'){
          var flag = null;
          var location = '/links/events/resources/Rain'; //localización del recurso pedido en el JSON
          //ws.send(JSON.stringify(selectResource(location)));
          Object.observe(selectResource(location, resourcesWS), function(changes){
              model = utils.findEvent('LowTemperature',resourcesWS);
              if(model.data.state != flag){
                flag = model.data.state;
                try{
           	         ws.send(JSON.stringify(selectResource(location, resourcesWS)));
           	    }
           	    catch(e){
           	         ws.terminate();
                }
              }
          })
       }
       //Evento que informa a los observadores de que la vel. del viento es alta
       else if(ruta == '/WeatherStation/events/StrongWind'){ //modelWindSpeed = utils.findProperty('windSpeed',resources);
          var flag = null;
          var location = '/links/events/resources/StrongWind';
          ws.send(JSON.stringify(selectResource(location, resourcesWS)));
          Object.observe(selectResource(location, resourcesWS), function(changes){
              model = utils.findEvent('StrongWind',resourcesWS);
              if(model.data.state != flag){
                flag = model.data.state;
                try{
           	         ws.send(JSON.stringify(selectResource(location, resourcesWS)));
           	    }
           	    catch(e){
           	         ws.terminate();
                }
              }
          })
       }
       //Evento que informa a los observadores de que la vel. del viento es alta
       else if(ruta == '/WeatherStation/events/ChangeState'){ //modelWindSpeed = utils.findProperty('windSpeed',resources);
          var flag = null;
          var location = '/links/events/resources/ChangeState';
          ws.send(JSON.stringify(selectResource(location, resourcesWS)));
          Object.observe(selectResource(location, resourcesWS), function(changes){
              model = utils.findEvent('ChangeState',resourcesWS);
              if(model.data.state != flag){
                flag = model.data.state;
                try{
           	         ws.send(JSON.stringify(selectResource(location, resourcesWS)));
           	    }
           	    catch(e){
           	         ws.terminate();
                }
              }
          })
       }//FIN WeatherStation
////////////////////Dome
       else if(ruta == '/Dome/events/ChangeStateShutter'){
            var flag = null;
            var location = '/links/events/resources/ChangeStateShutter';
            ws.send(JSON.stringify(selectResource(location, resourcesDome)));
            Object.observe(selectResource(location, resourcesDome), function(changes){
              model = utils.findEvent('ChangeStateShutter',resourcesDome);
              if(model.data.state != flag){
                flag = model.data.state;
                try{
               	  ws.send(JSON.stringify(selectResource(location, resourcesDome)));
               	}
               	catch(e){
               	  ws.terminate();
                }
              }
            })
       }
       else if(ruta == '/Dome/events/ChangeStateDome'){
            var flag = null;
            var location = '/links/events/resources/ChangeStateDome';
            ws.send(JSON.stringify(selectResource(location, resourcesDome)));
            Object.observe(selectResource(location, resourcesDome), function(changes){
              model = utils.findEvent('ChangeStateDome',resourcesDome);
              if(model.data.state != flag){
                flag = model.data.state;
                try{
               	  ws.send(JSON.stringify(selectResource(location, resourcesDome)));
               	}
               	catch(e){
               	  ws.terminate();
                }
              }
            })
       }
       else if(ruta == '/Dome/events/LowVoltageBattery'){
            var flag = null;
            var location = '/links/events/resources/LowVoltageBattery';
            ws.send(JSON.stringify(selectResource(location, resourcesDome)));
            Object.observe(selectResource(location, resourcesDome), function(changes){
              model = utils.findEvent('LowVoltageBattery',resourcesDome);
              if(model.data.state != flag){
                flag = model.data.state;
                try{
               	  ws.send(JSON.stringify(selectResource(location, resourcesDome)));
               	}
               	catch(e){
               	  ws.terminate();
                }
              }
            })
       }
       else if(ruta == '/Dome/events/StopRunningDome'){
            var flag = null;
            var location = '/links/events/resources/StopRunningDome';
            ws.send(JSON.stringify(selectResource(location, resourcesDome)));
            Object.observe(selectResource(location, resourcesDome), function(changes){
              model = utils.findEvent('StopRunningDome',resourcesDome);
              if(model.data.state != flag){
                flag = model.data.state;
                try{
               	  ws.send(JSON.stringify(selectResource(location, resourcesDome)));
               	}
               	catch(e){
               	  ws.terminate();
                }
              }
            })
       }
       else if(ruta == '/Dome/events/ChangeState'){
                   var flag = null;
                   var location = '/links/events/resources/ChangeState';
                   ws.send(JSON.stringify(selectResource(location, resourcesDome)));
                   Object.observe(selectResource(location, resourcesDome), function(changes){
                     model = utils.findEvent('ChangeState',resourcesDome);
                     if(model.data.state != flag){
                       flag = model.data.state;
                       try{
                      	  ws.send(JSON.stringify(selectResource(location, resourcesDome)));
                      	}
                      	catch(e){
                      	  ws.terminate();
                       }
                     }
                   })
              }
////////////////////Camera DMK
       else if(ruta == '/Camera/events/NewPhoto'){
            var flag = null;
            var location = '/links/events/resources/NewPhoto';
            ws.send(JSON.stringify(selectResource(location, resourcesCamDMK)));
            Object.observe(selectResource(location, resourcesCamDMK), function(changes){
              model = utils.findEvent('NewPhoto',resourcesCamDMK);
              if(parseFloat(model.data.ID) != parseFloat(flag)){
                flag = parseFloat(model.data.ID);
                try{
                  //var obj = JSON.stringify(selectResource(location, resourcesCamDMK));
                  //console.log(obj);
               	  ws.send(JSON.stringify(selectResource(location, resourcesCamDMK)));
               	}
               	catch(e){
               	  ws.terminate();
                }
              }
            })
       }
       else if(ruta == '/Camera/events/ChangeState'){
                   var flag = null;
                   var location = '/links/events/resources/ChangeState';
                   ws.send(JSON.stringify(selectResource(location, resourcesCamDMK)));
                   Object.observe(selectResource(location, resourcesCamDMK), function(changes){
                     model = utils.findEvent('ChangeState',resourcesCamDMK);
                     if(parseFloat(model.data.ID) != parseFloat(flag)){
                       flag = parseFloat(model.data.ID);
                       try{
                         //var obj = JSON.stringify(selectResource(location, resourcesCamDMK));
                         //console.log(obj);
                      	  ws.send(JSON.stringify(selectResource(location, resourcesCamDMK)));
                      	}
                      	catch(e){
                      	  ws.terminate();
                       }
                     }
                   })
              }
////////////////////Mount
       else if(ruta == '/Mount/events/ChangeMotion'){
            var flag = null;
            var location = '/links/events/resources/ChangeMotion';
            ws.send(JSON.stringify(selectResource(location, resourcesMount)));
            Object.observe(selectResource(location, resourcesMount), function(changes){
              model = utils.findEvent('ChangeMotion',resourcesMount);
              if(model.data.state != flag){
                flag = model.data.state;
                try{
               	  ws.send(JSON.stringify(selectResource(location, resourcesMount)));
               	}
               	catch(e){
               	  ws.terminate();
                }
              }
            })
       }
       else if(ruta == '/Mount/events/ChangeState'){
                   var flag = null;
                   var location = '/links/events/resources/ChangeState';
                   ws.send(JSON.stringify(selectResource(location, resourcesMount)));
                   Object.observe(selectResource(location, resourcesMount), function(changes){
                     model = utils.findEvent('ChangeState',resourcesMount);
                     if(model.data.state != flag){
                       flag = model.data.state;
                       try{
                      	  ws.send(JSON.stringify(selectResource(location, resourcesMount)));
                      	}
                      	catch(e){
                      	  ws.terminate();
                       }
                     }
                   })
              }
////////////////////Camera_inside
        else if(ruta == '/Camera_inside/events/ChangeState'){
                   var flag = null;
                   var location = '/links/events/resources/ChangeState';
                   ws.send(JSON.stringify(selectResource(location, resourcesMount)));
                   Object.observe(selectResource(location, resourcesMount), function(changes){
                     model = utils.findEvent('ChangeState',resourcesMount);
                     if(model.data.state != flag){
                       flag = model.data.state;
                       try{
                      	  ws.send(JSON.stringify(selectResource(location, resourcesMount)));
                      	}
                      	catch(e){
                      	  ws.terminate();
                       }
                     }
                   })
              }
////////////////////Camera_outside
              else if(ruta == '/Camera_outside/events/ChangeState'){
                   var flag = null;
                   var location = '/links/events/resources/ChangeState';
                   ws.send(JSON.stringify(selectResource(location, resourcesMount)));
                   Object.observe(selectResource(location, resourcesMount), function(changes){
                     model = utils.findEvent('ChangeState',resourcesMount);
                     if(model.data.state != flag){
                       flag = model.data.state;
                       try{
                      	  ws.send(JSON.stringify(selectResource(location, resourcesMount)));
                      	}
                      	catch(e){
                      	  ws.terminate();
                       }
                     }
                   })
              }

    }
    //para captar errores, como formato incorrecto/no soportado de URL
    catch(e){
      console.log(e);
      console.log('Unable to observe %s resource!',location);
    };
  });
};

//Toma una URL de solicitud y devuelve el recurso correspondiente
function selectResource(location, resources){
  var parts = location.split('/');
  parts.shift();
  var result = resources;
  for(var i=0; i<parts.length; i++){
    result = result[parts[i]];
  }
  //console.info(result);
  return result;
}