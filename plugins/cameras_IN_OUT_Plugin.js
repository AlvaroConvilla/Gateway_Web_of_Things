var http = require('http');
var request = require('request');
var parse = require('parse-json-response');
var resourcesIN = require('./../resources/modelCameraInside');
var resourcesOUT = require('./../resources/modelCameraOutside');
var util = require('util'),
    utils = require('./../utils/utils.js'),
    fs = require('fs');

//variables
var modelStateIN = utils.findProperty('state',resourcesIN);
var modelStateOUT = utils.findProperty('state',resourcesOUT);
var modelNewPhotoIN = utils.findProperty('NewPhoto',resourcesOUT);
var modelNewPhotoOUT = utils.findProperty('NewPhoto',resourcesOUT);

var estado = "OFF";
modelStateIN.data = {"state":estado, "timestamp":utils.isoTimestamp()};
modelStateOUT.data = {"state":estado, "timestamp":utils.isoTimestamp()};
//fin variables

exports.start = function connectHardwareCamera(){
    estado = 'ON';
    modelStateIN.data = {"state":estado, "timestamp":utils.isoTimestamp()};
    modelStateOUT.data = {"state":estado, "timestamp":utils.isoTimestamp()};

    modelEventChangeStateIN = utils.findEvent('ChangeState',resourcesIN);
    modelEventChangeStateIN.data = {"state":estado, "timestamp":utils.isoTimestamp()};

    modelEventChangeStateOUT= utils.findEvent('ChangeState',resourcesOUT);
    modelEventChangeStateOUT.data = {"state":estado, "timestamp":utils.isoTimestamp()};
}