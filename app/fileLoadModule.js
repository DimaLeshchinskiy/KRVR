const pathModule = require('path')
const fsModule = require('fs');
const dxfService = require('../app/DXFservice');
const config = require('../app/config');

const extensions = [".dxf"];

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

  let file = new FileModel(pathToFile, extension);
  if(extension == ".dxf")
    return dxfService.getDxf(file);

  return file;
}

class FileModel{
  constructor(path, extension) {
    this.path = path;
    this.extension = extension.substring(1);
    this.data = fsModule.readFileSync(this.path, 'utf8');
    this.id = Date.now();

    this.offsetX = 0;
    this.offsetY = 0;
    this.minX = 0;
    this.minY = 0;
    this.maxX = 0;
    this.maxY = 0;
    this.height = 0;
    this.width = 0;
    this.scale = 1;
    this.angle = 0;

    this.centerX = 0;
    this.centerY = 0;
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
