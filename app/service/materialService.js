const config = require("../singleton/config");
const MaterialModel = require("../model/materialModel");


exports.getCustom = function(){

  return new MaterialModel({
    name: "custom"
  });
}
