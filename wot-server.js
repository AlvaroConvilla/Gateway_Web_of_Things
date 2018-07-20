//Cargar el servidor HTTP y el modelo.
var httpServer = require('./servers/http'),
    wsServer = require('./servers/websockets'),
    fs = require('fs');

 //Argumento del comando de ejecución
 //const args = process.argv;
/* var first_value = process.argv[2];
 var secure;
 //console.log(first_value);
 if(typeof first_value === "undefined"){
    console.log(">Si quiere arrancar la Gateway con seguridad : $node wot-server secure");
    secure = false;
 }else{
    secure = true;
 }*/

//Secure
//if (process.env.PORT) port = process.env.PORT;
  //else if (port === undefined) port = resources.customFields.port;
  //if (secure === undefined) secure = resources.customFields.secure;

//Plugins
var sensorsPlugin = require('./plugins/sensorsPlugin');
var domePlugin = require('./plugins/domePlugin');
var mountPlugin = require('./plugins/mountPlugin');
var cameraPlugin = require('./plugins/cameraPlugin');
var camerasINOUT = require('./plugins/cameras_IN_OUT_Plugin');
//sensorsPlugin.start(); //start de la recolección de datos de la estación meteo
sensorsPlugin.mock(); //mock debido a que la estación no funciona
domePlugin.start(); //start de la recolección de datos de la cúpula (rabbitmq)
mountPlugin.start(); //start de la recolección de datos de la montura (rabbitmq)
cameraPlugin.start(); //start de la recolección de datos de la cámara DMK(rabbitmq)
camerasINOUT.start(); //start poner datos de las cámaras inside and outside

//Proceso de obtener las fotos según los properties de brillo, gamma, etc
var take_photos = require('./plugins/cameraPlugin');
take_photos.takePhotos();//Comienzo del proceso de obtener las fotos

var port = 8484;
var secure = false;
if(secure) {
    var https = require('https'); //#B
    var certFile = './resources/secure/caCert.pem'; //#C
    var keyFile = './resources/secure/privateKey.pem'; //#D
    var passphrase = 'admin'; //#E

    var config = {
      cert: fs.readFileSync(certFile),
      key: fs.readFileSync(keyFile),
      passphrase: passphrase
    };

    return server = https.createServer(config, httpServer) //#F
      .listen(port, function () {
        wsServer.listen(server); //#G
        console.log('>Secure WoT server started on port %s', port);
    })
  } else { //Sin HTTPS://
    Iniciar el servidor HTTP mediante la invocación de escucha() en la aplicación express.
    var server = httpServer.listen(port, function () {
      console.log('>HTTP server started...');
      wsServer.listen(server);
      Una vez que se inicia el servidor, se invoca la devolución de llamada.
      console.info('>Your WoT-Gateway is up and running on port %s', port);
    });
}