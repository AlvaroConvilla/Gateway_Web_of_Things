var http = require('http');
var request = require('request');
var parse = require('parse-json-response');
var resources = require('./../resources/modelWeatherStation');
//var model = resources.WeatherStation.sensors;
var util = require('util'),
    utils = require('./../utils/utils.js');
//var sleep = require('sleep');


//variables
var modelTemperature, modelHumidity, modelPressure, modelWindSpeed, modelWindDirection, modelRainFall, modelEventHighTemp, modelEventLowTemp, modelEventRain, modelEventWind;
    
    modelTemperature = utils.findProperty('temperature',resources);
    modelHumidity = utils.findProperty('humidity',resources);
    modelPressure = utils.findProperty('pressure',resources);
    modelWindSpeed = utils.findProperty('windSpeed',resources);
    modelWindDirection = utils.findProperty('windDirection',resources);
    modelRainFall = utils.findProperty('rainfall',resources);

    modelState = utils.findProperty('state',resources);
    var estado = "OFF";
    modelState.data = {"state":estado, "timestamp":utils.isoTimestamp()};

    modelEventHighTemp = utils.findEvent('HighTemperature',resources);
    modelEventHighTemp.data = {"state":estado, "timestamp":utils.isoTimestamp()};

    modelEventLowTemp = utils.findEvent('LowTemperature',resources);
    modelEventLowTemp.data = {"state":estado, "timestamp":utils.isoTimestamp()};

    modelEventRain = utils.findEvent('Rain',resources);
    modelEventRain.data = {"state":estado, "timestamp":utils.isoTimestamp()};

    modelEventWind = utils.findEvent('StrongWind',resources);
    modelEventWind.data = {"state":estado, "timestamp":utils.isoTimestamp()};
//variables
    var hayError = 0; //flag para saber si hubo un error

exports.start = function connectHardware(){
 var requestLoop = setInterval(function(){
  request({
      url: "https://ofs.fi.upm.es:8484:5000/api/estacion/montegancedo",
      method: "GET",
      timeout: 30000,
      followRedirect: true,
      maxRedirects: 1
  },function(error, response, body){
      if(!error && response.statusCode == 200){
          console.log('WeatherStation connection: sucess!');
          //console.log(body);
          var obj = JSON.parse(body);
	  
	  var hora = obj.Estacion.Hora;
	  var temp = obj.Estacion.Temperatura;
	  var str = "Velocidad viento";
	  var windSpeed = obj.Estacion[str];
	  var pressure = obj.Estacion.Presion;
	  var humidity =obj.Estacion.Humedad;
	  var fecha = obj.Estacion.Fecha;
	  var str2 = "Direccion viento";
	  var windDir = obj.Estacion[str2];
	  var state = obj.Estacion.Estado;
	  var rain = obj.Estacion.Precipitacion;

	  if(state !== "No operativo"){
      var estado = "ON";
	    //Actualizar el modelo con los nuevos valores de los sensores.
	    //Se notificará a todos los observadores
	    //model.temperature.value = parseFloat(datosFil[3]);
	    modelTemperature.data = {"temperature":parseFloat(temp), "timestamp":utils.isoTimestamp()};
	    //model.pressure.value = parseFloat(datosFil[5]);
	    modelPressure.data = {"pressure":parseFloat(pressure), "timestamp":utils.isoTimestamp()};
	    //model.humidity.value = parseFloat(datosFil[7]);
	    modelHumidity.data = {"humidity":parseFloat(humidity), "timestamp":utils.isoTimestamp()};
	    //model.windSpeed.value = parseFloat(datosFil[9]);
	    modelWindSpeed.data = {"windSpeed":parseFloat(windSpeed), "timestamp":utils.isoTimestamp()};
	    //model.rainfall.value = parseFloat(datosFil[11]);
	    modelRainFall.data = {"rainfall":parseFloat(rain), "timestamp":utils.isoTimestamp()};
	    //model.windDirection.value = datosFil[13];
	    modelWindDirection.data = {"windDirection":windDir, "timestamp":utils.isoTimestamp()};
	    modelState.data = {"state":estado, "timestamp":utils.isoTimestamp()};
	    if(parseFloat(temp) >= parseFloat(40)){ //si es más de 40 grados
	        modelEventHighTemp.data = {"state":estado, "timestamp":utils.isoTimestamp()};
	    }else{
	        modelEventHighTemp.data = {"state":"OFF", "timestamp":utils.isoTimestamp()};
	    }
	    if(parseFloat(temp) <= parseFloat(0)){ //si es menos de 0 grados
	        modelEventLowTemp.data = {"state":estado, "timestamp":utils.isoTimestamp()};
	    }else{
	        modelEventLowTemp.data = {"state":"OFF", "timestamp":utils.isoTimestamp()};
	    }
	    if(parseFloat(rain) > parseFloat(0)){
	        modelEventRain.data = {"state":estado, "timestamp":utils.isoTimestamp()};
	    }else{
	        modelEventRain.data = {"state":"OFF", "timestamp":utils.isoTimestamp()};
	    }
	    if(parseFloat(windSpeed) > parseFloat(30)){
	        modelEventWind.data = {"state":estado, "timestamp":utils.isoTimestamp()};
	    }
	    else{
	        modelEventWind.data = {"state":"OFF", "timestamp":utils.isoTimestamp()};
	    }
	    //console.log(hora, temp, windSpeed, pressure, humidity, fecha, windDir, estado, rain);
      }else{hayError=1;}
      }else{hayError=1;}
      if(hayError==1){ //si error meter estado "Sin conexión" a la estación
          var estado = "OFF";
          modelTemperature.data = {"temperature":" ", "timestamp":utils.isoTimestamp()};
          modelPressure.data = {"pressure":" ", "timestamp":utils.isoTimestamp()};
          modelHumidity.data = {"humidity":" ", "timestamp":utils.isoTimestamp()};
          modelWindSpeed.data = {"windSpeed":" ", "timestamp":utils.isoTimestamp()};
          modelRainFall.data = {"rainfall":" ", "timestamp":utils.isoTimestamp()};
          modelWindDirection.data = {"windDirection":" ", "timestamp":utils.isoTimestamp()};
          modelState.data = {"state":estado, "timestamp":utils.isoTimestamp()};
          modelEventHighTemp.data = {"state":estado, "timestamp":utils.isoTimestamp()};
          modelEventLowTemp.data = {"state":estado, "timestamp":utils.isoTimestamp()};
          modelEventRain.data = {"state":estado, "timestamp":utils.isoTimestamp()};
          modelEventWind.data = {"state":estado, "timestamp":utils.isoTimestamp()};
      }
  });
}, 30000);
}
//MOCK para poder probar las funcionalidades de la gateway, debido a que la estación no está operativa.
exports.mock = function connectHardware(){
    var temp, pressure, humidity, windSpeed, rain, windDir, estado;
    temp = 39.0; pressure = 850.0, humidity = 22; windSpeed = 28.0; rain = 0; windDir = 'N'; estado = 'ON';
    var requestLoop = setInterval(function(){
        modelTemperature.data = {"temperature":parseFloat(temp), "timestamp":utils.isoTimestamp()};
        modelPressure.data = {"pressure":parseFloat(pressure), "timestamp":utils.isoTimestamp()};
        modelHumidity.data = {"humidity":parseFloat(humidity), "timestamp":utils.isoTimestamp()};
        modelWindSpeed.data = {"windSpeed":parseFloat(windSpeed), "timestamp":utils.isoTimestamp()};
        modelRainFall.data = {"rainfall":parseFloat(rain), "timestamp":utils.isoTimestamp()};
        modelWindDirection.data = {"windDirection":windDir, "timestamp":utils.isoTimestamp()};
        modelState.data = {"state":estado, "timestamp":utils.isoTimestamp()};
        //
        modelEventChangeState = utils.findEvent('ChangeState',resources);
        modelEventChangeState.data = {"state":estado, "timestamp":utils.isoTimestamp()};

        if(parseFloat(temp) >= parseFloat(40)){ //si es más de 40 grados
            modelEventHighTemp.data = {"state":"ON", "timestamp":utils.isoTimestamp()};
        }else{
            modelEventHighTemp.data = {"state":"OFF", "timestamp":utils.isoTimestamp()};
        }
        if(parseFloat(temp) <= parseFloat(0)){ //si es menos de 0 grados
        	modelEventLowTemp.data = {"state":"ON", "timestamp":utils.isoTimestamp()};
        }else{
        	modelEventLowTemp.data = {"state":"OFF", "timestamp":utils.isoTimestamp()};
        }
        if(parseFloat(rain) > parseFloat(0)){
        	modelEventRain.data = {"state":"ON", "timestamp":utils.isoTimestamp()};
        }else{
        	modelEventRain.data = {"state":"OFF", "timestamp":utils.isoTimestamp()};
        }
        if(parseFloat(windSpeed) > parseFloat(30)){
        	modelEventWind.data = {"state":"ON", "timestamp":utils.isoTimestamp()};
        }else{
        	modelEventWind.data = {"state":"OFF", "timestamp":utils.isoTimestamp()};
        }
        //sleep.sleep(10);
        if(temp === 45.0){
            temp = 15.0; pressure = 850.0, humidity = 22; windSpeed = 28.0; rain = 0; windDir = 'N'; estado = 'ON';
        }
        else{
            temp = temp + 1; pressure = pressure + 2.2; humidity = humidity + 2; windSpeed = windSpeed + 0.3; //rain = rain + 1;
        }
    }, 30000);//30000
}
