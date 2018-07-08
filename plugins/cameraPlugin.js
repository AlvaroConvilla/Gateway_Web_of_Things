var http = require('http');
var request = require('request');
var parse = require('parse-json-response');
var resourcesCam = require('./../resources/modelCamera');
var util = require('util'),
    utils = require('./../utils/utils.js'),
    fs = require('fs');
//var sleep = require('sleep');

//variables
var modelState = utils.findProperty('state',resourcesCam);
var modelExposureTime = utils.findProperty('ExposureTime',resourcesCam);
var modelGamma = utils.findProperty('Gamma',resourcesCam);
var modelBrightness = utils.findProperty('Brightness',resourcesCam);
var modelNumberOfShoots = utils.findProperty('NumberOfShoots',resourcesCam);
var modelEventNewPhoto = utils.findEvent('NewPhoto',resourcesCam);

var estado = "OFF";
modelState.data = {"state":estado, "timestamp":utils.isoTimestamp()};
//fin variables

exports.start = function connectHardwareCamera(){
    modelState.data = {"state":estado, "timestamp":utils.isoTimestamp()};
    modelExposureTime.data = {"Hour":0,"Minute":0,"Second":15, "timestamp":utils.isoTimestamp()};
    modelGamma.data = {"Gamma":parseFloat(0), "timestamp":utils.isoTimestamp()};
    modelBrightness.data = {"Brightness":parseFloat(0), "timestamp":utils.isoTimestamp()};
    modelNumberOfShoots.data = {"NumberOfShoots":parseFloat(2), "timestamp":utils.isoTimestamp()};
    modelEventNewPhoto.data = {"ID":parseFloat(0), "timestamp":utils.isoTimestamp()};

    modelEventChangeState = utils.findEvent('ChangeState',resourcesCam);
    modelEventChangeState.data = {"state":estado, "timestamp":utils.isoTimestamp()};

    /* PRUEBA
    var cont = 1;
    var requestLoop = setInterval(function(){
        console.log(cont);
        sleep.sleep(10);
        modelEventNewPhoto.data = {"ID":parseFloat(cont), "timestamp":utils.isoTimestamp()};
        cont++;
    }, 100);//30000
    */
}

exports.takePhotos = function takePhotos(){
    var id_photo=1; //identificador de cada foto
    var exposureHour = resourcesCam.links.properties.resources.ExposureTime.data.Hour;
    var exposureMin = resourcesCam.links.properties.resources.ExposureTime.data.Minute;
    var exposureSec = resourcesCam.links.properties.resources.ExposureTime.data.Second;
    var gamma = resourcesCam.links.properties.resources.Gamma.data.Gamma;
    var brightness = resourcesCam.links.properties.resources.Brightness.data.Brightness;
    var number = resourcesCam.links.properties.resources.NumberOfShoots.data.NumberOfShoots;
    var tomarFotos = resourcesCam.links.actions.resources.TakePhoto.data.unit;

    var timePhotos = exposureHour*3600 + exposureMin*60 + exposureSec; //Tiempo de exposición en segundos por cada foto

    var requestLoop = setInterval(function(){
        var exposureHour = resourcesCam.links.properties.resources.ExposureTime.data.Hour;
        var exposureMin = resourcesCam.links.properties.resources.ExposureTime.data.Minute;
        var exposureSec = resourcesCam.links.properties.resources.ExposureTime.data.Second;
        var gamma = resourcesCam.links.properties.resources.Gamma.data.Gamma;
        var brightness = resourcesCam.links.properties.resources.Brightness.data.Brightness;
        var number = resourcesCam.links.properties.resources.NumberOfShoots.data.NumberOfShoots;
        var tomarFotos = resourcesCam.links.actions.resources.TakePhoto.data.unit;

        var timePhotos = exposureHour*3600 + exposureMin*60 + exposureSec; //Tiempo de exposición en segundos por cada foto

        var modelEventNewPhoto = utils.findEvent('NewPhoto',resourcesCam);

        //console.log(tomarFotos,number,timePhotos);
        if(number >0 && tomarFotos == 'TakePhotos'){
            //sleep.sleep(timePhotos);
            modelEventNewPhoto.data = {"ID":id_photo, "timestamp":utils.isoTimestamp()};
            //console.log(modelEventNewPhoto.data,id_photo);
            id_photo++;
            number--;
            modelNumberOfShoots.data = {"NumberOfShoots":parseFloat(number), "timestamp":utils.isoTimestamp()};
        }
        else{
            //modelEventNewPhoto.data = {"ID":parseFloat(0), "timestamp":utils.isoTimestamp()};
        }
    }, timePhotos);
}
