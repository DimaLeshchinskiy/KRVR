const pathModule = require('path')
const fsModule = require('fs');
const dxfService = require('../app/DXFservice');
const pngService = require('../app/PNGservice');
const config = require('../app/config');

const extensions = [".dxf", ".png"];

var pathToFile = "";
var extension = "";

exports.setPath = function(path){

  extension = pathModule.extname(path);

  if(extensions.includes(extension)){
    pathToFile = path;
    return true;
  }

  return false;
}

exports.getFile = function(){
  if(!pathToFile) return null;

  if(extension == ".dxf"){
    let file = new FileModel(pathToFile, extension, 'utf-8');
    return dxfService.getDxf(file);
  }
  if(extension == ".png"){
    let file = new FileModel(pathToFile, extension);
    return pngService.getPng(file);
  }

  return null;
}

class FileModel{
  constructor(path, extension, encoding = null) {
    //something like "head"
    this.path = path;
    this.extension = extension.substring(1);
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
