# Gateway_Web_of_Things

##Instrucciones para el despliegue de la pasarela Web of Things.
###1º Desplegar imagen Docker y ejecutar contenedor de Rabbitmq.
####Para ello escribir el siguiente documento: docker-compose.yml
´´´
version: '3'
services:
  rabbit:
    image: rabbitmq:3.7.5-management
    hostname: "rabbitmq"
    restart: always
    ports:
     - 5672:5672
     - 15672:15672
    environment:
     - RABBITMQ_DEFAULT_USER=venus
     - RABBITMQ_DEFAULT_PASS=venuspass
´´´
####-Ejecutar el siguiente comando:
´´´
sudo docker-compose up
´´´
###Ahora se tiene el contenedor de Rabbitmq al cual se comunica por el puerto 5672 para el protocolo amqp y al gestor mediante un navegador: http://localhost:15672

###2º Dentro del directorio del proyecto de la pasarela Web of Things, ejecutar el siguiente comando:
´´´
node wot-server.js
´´´
####Versión de nodejs: v9.11.1
##Ahora están ambos servicios corriendo en la máquina.