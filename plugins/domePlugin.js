var http = require('http');
var request = require('request');
var parse = require('parse-json-response');
var resources = require('./../resources/modelDome');
var util = require('util'),
    utils = require('./../utils/utils.js');
var amqp = require('amqplib/callback_api');
var timer = require('timer-shim'), count = 0, handle = null;

//variables
var modelState = utils.findProperty('state',resources);
var modelAzimuth = utils.findProperty('Azimuth',resources);
var modelShutter = utils.findProperty('Shutter',resources);
var modelVoltageBat = utils.findProperty('VoltageBattery',resources);
var modelCurrentAct = utils.findProperty('CurrentAction',resources);

var estado = "OFF";
modelState.data = {"state":estado, "timestamp":utils.isoTimestamp()};
modelShutter.data = {"Shutter": "CLOSE", "timestamp":utils.isoTimestamp()};
//fin variables

//Eventos
modelEventLowVoltageBattery = utils.findEvent('LowVoltageBattery',resources);
modelEventLowVoltageBattery.data = {"state":estado, "timestamp":utils.isoTimestamp()};

modelEventChangeStateShutter = utils.findEvent('ChangeStateShutter',resources);
modelEventChangeStateShutter.data = {"state":estado, "timestamp":utils.isoTimestamp()};

modelEventChangeStateDome = utils.findEvent('ChangeStateDome',resources);
modelEventChangeStateDome.data = {"state":estado, "timestamp":utils.isoTimestamp()};

modelEventStopRunningDome = utils.findEvent('StopRunningDome',resources);
modelEventStopRunningDome.data = {"state":estado, "timestamp":utils.isoTimestamp()};
//Fin eventos

exports.start = function connectHardware(){
//Obtener datos del rabbitmq
//amqp.connect('amqp://venus:venuspass@localhost', function(err, conn) {
amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'cupula';
    //var ex = 'montura';
    ch.assertExchange(ex, 'direct', {durable: false});

    ch.assertQueue('', {exclusive: true}, function(err, q) {
      //console.log(' [*] Waiting for logs. To exit press CTRL+C');

      ch.bindQueue(q.queue, ex, 'info');
      ch.consume(q.queue, function(msg) {
        //console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());

        //Del JSON obtenido saco los datos y los modifico en mi JSON de la gateway
        //1º convertir en modelo
         var obj = JSON.parse(msg.content);
        //2º del modelo sacar los diferentes datos, para properties
        modelState.data = {"state":"ON", "timestamp":utils.isoTimestamp()};
        modelEventChangeStateDome.data = {"state":"OFF", "timestamp":utils.isoTimestamp()};

        modelAzimuth.data = {"Azimuth": obj.position, "timestamp":utils.isoTimestamp()};

        modelVoltageBat.data = {"VoltageBattery": obj.supply_voltage, "timestamp":utils.isoTimestamp()};
        modelCurrentAct.data = {"CurrentAction": obj.current_action, "timestamp":utils.isoTimestamp()};
        if(obj.current_action == 'Running CCW' || obj.current_action == 'Running CW' || obj.current_action == 'Stopped'){
            modelShutter.data = {"Shutter": "OPEN", "timestamp":utils.isoTimestamp()};
            modelEventChangeStateShutter.data = {"state":"ON", "timestamp":utils.isoTimestamp()};
        }else{
            modelShutter.data = {"Shutter": "CLOSE", "timestamp":utils.isoTimestamp()};
            modelEventChangeStateShutter.data = {"state":"OFF", "timestamp":utils.isoTimestamp()};
        }
        if(obj.current_action == 'Running CCW' || obj.current_action == 'Running CW' || obj.current_action == 'Parking' || obj.current_action == 'Going home' || obj.current_action == 'Calibrating'){
            modelEventStopRunningDome.data = {"state":"ON", "timestamp":utils.isoTimestamp()};
        }
        else{
            modelEventStopRunningDome.data = {"state":"OFF", "timestamp":utils.isoTimestamp()};
        }
        //eventos
        if(parseFloat(obj.supply_voltage) <= parseFloat(8)){ //si es menos de 8 voltios
          modelEventLowVoltageBattery.data = {"state":"ON", "timestamp":utils.isoTimestamp()};
        }else{
          modelEventLowVoltageBattery.data = {"state":"OFF", "timestamp":utils.isoTimestamp()};
        }
        //Contador para cuando lleva mucho tiempo sin publicar la cúpula poner todos OFF
        /*handle = timer.interval(100, function() {
          console.log(count++);
          if (count == 10) timer.clear(handle);
        });*/
        //Fin recogida datos
      }, {noAck: true});
    });
  });
});

//Fin rabbitmq
}
modelState.data = {"state":"OFF", "timestamp":utils.isoTimestamp()};
modelEventChangeStateDome.data = {"state":"OFF", "timestamp":utils.isoTimestamp()};
