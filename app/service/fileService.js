const pathModule = require('path')
const fsModule = require('fs');

//this generate filemodel
const dxfService = require('../service/DXFservice');
const pngService = require('../service/PNGservice');
const bmpService = require('../service/BMPservice');
const gcodeService = require('../service/GCODEservice');
const stlService = require('../service/STLservice');

//this generate canvas
const dxf2c = require("../convert/DXF2CANVAS");
const png2c = require("../convert/PNG2CANVAS");
const bmp2c = require("../convert/BMP2CANVAS");

//this generate gcode
const dxf2g = require("../convert/DXF2GC");
const png2g = require("../convert/PNG2GC");
const bmp2g = require("../convert/BMP2GC");
const gcode2g = require("../convert/GCODE2GC");
const obj3D2g = require("../convert/OBJ3D2GC");

const config = require("../singleton/config");
const fileManager = require("../singleton/fileManager");

const extensions2D = [".dxf", ".png", ".gcode", ".bmp"];
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
  else if(file.extension == "bmp")
    return bmp2c.getCanvas(file);

  return null;
}

exports.getGcode = async function(file){
  if(file.extension == "png")
    return await png2g.getGcode(file);
  else if(file.extension == "bmp")
    return await bmp2g.getGcode(file);
  else if(file.extension == "dxf")
    return await dxf2g.getGcode(file);
  else if(file.extension == "gcode")
    return await gcode2g.getGcode(file);
  else if (isFile3D(file))
    return await obj3D2g.getGcode(file);

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
  if(extension == ".bmp"){
    params.autoload = false;
    file = await bmpService.getBmp(params);
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
