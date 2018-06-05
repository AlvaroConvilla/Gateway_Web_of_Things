var keys = require('./../resources/auth'),
  crypto = require('crypto'),
  keys = require('./../resources/auth');
  //_ = require('lodash/collection');

exports.addDevice = function(id, name, description, sensors, actuators) {
  if(!model.things) {
    model.things = {};
  }
  model.things[id] = {'name' : name,
    'description' : description,
    'sensors' : sensors,
    'actuators' : actuators
  }
};

exports.findObjectInArray = function(array, filterObj) {
  //TODO: should be made async (what if array is big!)
  return _.find(array, filterObj);
};

exports.findProperty = function(propertyId,model){
  return model.links.properties.resources[propertyId];
};

exports.findAction = function(actionId,model){
  return model.links.actions.resources[actionId];
};

exports.findEvent = function(eventId,model){
  return model.links.events.resources[eventId];
};

exports.isoTimestamp = function(){
  var date = new Date();
  return date.toString(); //date.toISOString();
};

exports.extractFields = function(fields, object, target) {
  if(!target) var target = {};
  var arrayLength = fields.length;
  for (var i = 0; i < arrayLength; i++) {
    var field = fields[i];
    target[field] = object[field];
  }
  return target;
};

exports.modelToResources = function(subModel, withValue) {
  var resources = [];
  Object.keys(subModel).forEach(function(key) {
    var val = subModel[key];
    var resource = {};
    resource.id = key;
    resource.name = val['name'];
    if(withValue) resource.values = val.data[val.data.length-1];
    resources.push(resource);
  });
  return resources;
};

// Generate a unique API Key
exports.generateApiToken = function(length, chars) {
  if (!length) length = 32;
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var randomBytes = crypto.randomBytes(length);
  var result = new Array(length);

  var cursor = 0;
  for (var i = 0; i < length; i++) {
    cursor += randomBytes[i];
    result[i] = chars[cursor % chars.length];
  }

  return result.join('');
};

exports.isTokenValid = function(token) {
  return keys.apiToken === token;
};

exports.cappedPush = function(array, entry) {
  if(array.length >= model.customFields.dataArraySize) {
    array.shift();
    array.push(entry);
  } else {
    array.push(entry);
  }
  return array;
};
