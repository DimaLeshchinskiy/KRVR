const pathModule = require('path')
const fsModule = require('fs');
const dxfService = require('../app/DXFservice');
const pngService = require('../app/PNGservice');
const gcodeService = require('../app/GCODEservice');
const stlService = require('../app/STLservice');
const config = require('../app/config');
var fileManager = require("../app/fileManager");

const extensions = [".dxf", ".png", ".gcode", ".stl"];

var pathToFile = "";
var extension = "";

function pushNewToFileManager(file){
  fileManager.push(file);
}

exports.setPath = function(path){

  extension = pathModule.extname(path);

  if(extensions.includes(extension)){
    pathToFile = path;
    return true;
  }

  return false;
}

exports.getFile = async function(){
  if(!pathToFile) return null;

  if(extension == ".dxf"){
    let file = new FileModel(pathToFile, extension, 'utf-8');
    dxfService.getDxf(file).then(pushNewToFileManager);
  }
  if(extension == ".png"){
    let file = new FileModel(pathToFile, extension);
    pngService.getPng(file).then(pushNewToFileManager);
  }
  if(extension == ".gcode"){
    let file = new FileModel(pathToFile, extension, 'utf-8');
    gcodeService.getGcode(file).then(pushNewToFileManager);
  }
  if(extension == ".stl"){
    let file = new FileModel(pathToFile, extension, null, false);
    stlService.getStl(file).then(pushNewToFileManager);
  }
}

class FileModel{
  constructor(path, extension, encoding = null, autoload = true) {
    //something like "head"
    this.path = path;
    this.extension = extension.substring(1);
    if(autoload)
      this.data = fsModule.readFileSync(this.path, encoding); //at first here were data from file, after service put here parsed data
    this.id = Date.now(); //id == time of upload in miliseconds

    //used for dxf
    this.minX = 0;
    this.minY = 0;
    this.maxX = 0;
    this.maxY = 0;

    //for all
    this.height = 0;
    this.width = 0;
    this.scale = 1;
    this.angle = 0;
    this.centerX = 0; // center of file
    this.centerY = 0; // center of file

    screenY = config.getDevY();
    screenX = config.getDevX();
    this.offsetX = screenX / 2; // offset from bottom left corner of screen to center of file
    this.offsetY = screenY / 2; // offset from bottom left corner of screen to center of file
  }

  getData() {
      console.log(this.data);
      return this.data;
  }

  equals(object){

    if(!object)
      return false;

    if(!(object instanceof FileModel))
      return false;

    if(object.id == this.id)
      return true;

  }
}
