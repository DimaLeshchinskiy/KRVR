const config = require("../singleton/config");
const DeviceModel = require("../model/deviceModel");

var original =  [];
var custom = [];

exports.load = function(){
  original =  [
                new DeviceModel("KRVR S1", 220, 140, 0, 0),
                new DeviceModel("KRVR X1", 254, 217, 40, 1)
              ];

  custom =  [
              new DeviceModel("Custom size", 100, 100, 100, 2)
            ];

  config.put("device", this.getDefault());
}

exports.getAll = function(){
  return original.concat(custom);
}

exports.getById = function(id){
  let devices = this.getAll();

  for (var i = 0; i < devices.length; i++){
    if(devices[i].id == id)
      return devices[i];
  }

}

exports.isOriginal = function(id){
  let device = this.getById(id);

  if(original.includes(device))
    return true;

  return false;

}

exports.getDefault = function(){
  return original[0];
}

exports.create = function(name, maxX, maxY, maxZ){
  custom.push(new DeviceModel(name, maxX, maxY, maxZ));
}
