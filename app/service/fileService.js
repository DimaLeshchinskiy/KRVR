const pathModule = require('path')
const fsModule = require('fs');

//this generate filemodel
const dxfService = require('../service/DXFservice');
const pngService = require('../service/PNGservice');
const gcodeService = require('../service/GCODEservice');
const stlService = require('../service/STLservice');

//this generate canvas
const dxf2c = require("../convert/DXF2CANVAS");
const png2c = require("../convert/PNG2CANVAS");

//this generate gcode
const dxf2g = require("../convert/DXF2GC");
const png2g = require("../convert/PNG2GC");
const gcode2g = require("../convert/GCODE2GC");
const obj3D2g = require("../convert/OBJ3D2GC");

const config = require("../singleton/config");
const fileManager = require("../singleton/fileManager");

const extensions2D = [".dxf", ".png", ".gcode"];
const extensions3D = [".stl"];

function pushNewToFileManager(file){
  fileManager.push(file);
}

function getAllExtensions(){
  return extensions2D.concat(extensions3D);
}

function getExtension(path){
  return pathModule.extname(path);
}

function isFile3D(file){
  return extensions3D.includes("." + file.extension);
}

exports.checkPath = function(path){
  return getAllExtensions().includes(getExtension(path));
}

exports.getCanvas = function(file){
  if(file.extension == "dxf")
    return dxf2c.getCanvas(file);
  else if(file.extension == "png")
    return png2c.getCanvas(file);

  return null;
}

exports.getGcode = function(file){
  if(file.extension == "png")
    return png2g.getGcode(file);
  else if(file.extension == "dxf")
    return dxf2g.getGcode(file);
  else if(file.extension == "gcode")
    return gcode2g.getGcode(file);
  else if (isFile3D(file))
    return obj3D2g.getGcode(file);

  return null;
}

exports.getFile = async function(path){
  let file = {};

  let extension = getExtension(path);
  let params = {
    path: path,
    extension: extension,
    autoload: true
  };

  if(extension == ".dxf"){
    params.encoding = "utf-8";
    file = await dxfService.getDxf(params);
  }
  if(extension == ".png"){
    file = await pngService.getPng(params);
  }
  if(extension == ".gcode"){
    params.encoding = "utf-8";
    file = await gcodeService.getGcode(params);
  }
  if(extension == ".stl"){
    params.autoload = false;
    file = await stlService.getStl(params);
  }

  pushNewToFileManager(file);
}
