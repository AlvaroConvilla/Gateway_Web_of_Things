var http = require('http');
var request = require('request');
var parse = require('parse-json-response');
var resources = require('./../resources/modelMount');
var util = require('util'),
    utils = require('./../utils/utils.js');
var amqp = require('amqplib/callback_api');

//variables
var modelState = utils.findProperty('state',resources);
var modelAzimuth = utils.findProperty('Azimuth',resources);
var modelAltitude = utils.findProperty('Altitude',resources);
var modelMotion = utils.findProperty('Motion',resources);
var modelEventChangeMotion = utils.findEvent('ChangeMotion',resources);

var estado = "OFF";
modelState.data = {"state":estado, "timestamp":utils.isoTimestamp()};
modelMotion.data = {"Motion": "Parked", "timestamp":utils.isoTimestamp()};
modelEventChangeMotion.data = {"state":"OFF", "timestamp":utils.isoTimestamp()};

modelEventChangeState = utils.findEvent('ChangeState',resources);
modelEventChangeState.data = {"state":estado, "timestamp":utils.isoTimestamp()};
//fin variables


exports.start = function connectHardware(){
var azimuth = null;
var altitude = null;
//Obtener datos del rabbitmq
//amqp.connect('amqp://venus:venuspass@localhost', function(err, conn) {
amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    //var ex = 'cupula';
    var ex = 'montura';
    ch.assertExchange(ex, 'direct', {durable: false});

    ch.assertQueue('', {exclusive: true}, function(err, q) {
      //console.log(' [*] Waiting for logs. To exit press CTRL+C');
      ch.bindQueue(q.queue, ex, 'info');

      ch.consume(q.queue, function(msg) {
        //console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());

        //Del JSON obtenido saco los datos y los modifico en mi JSON de la gateway
        //1º convertir en modelo
         var obj = JSON.parse(msg.content);

        //2º del modelo sacar los diferentes datos
        modelState.data = {"state":"ON", "timestamp":utils.isoTimestamp()};
        modelAzimuth.data = {"Azimuth": obj.properties.azimut, "timestamp":utils.isoTimestamp()};
        modelAltitude.data = {"Altitude": obj.properties.altura, "timestamp":utils.isoTimestamp()};
        if((azimuth != obj.properties.azimut) || (altitude != obj.properties.altura)){ //Si cambia el azimuth o la altura se está moviendo
            modelMotion.data = {"Motion": "Slewing", "timestamp":utils.isoTimestamp()};
            azimuth = obj.properties.azimut;
            altitude = obj.properties.altura;
            modelEventChangeMotion.data = {"state":"ON", "timestamp":utils.isoTimestamp()};
        }
        else{
            modelMotion.data = {"Motion": "Parked", "timestamp":utils.isoTimestamp()};
            modelEventChangeMotion.data = {"state":"OFF", "timestamp":utils.isoTimestamp()};
        }
        //Fin recogida datos
      }, {noAck: true});
    });
  });
});
//Fin rabbitmq
}
modelState.data = {"state":"OFF", "timestamp":utils.isoTimestamp()};
