const pathModule = require('path')
const fsModule = require('fs');

class FileModel{
  constructor(params) {
    //something like "head"
    this.path = params.path;
    this.name = pathModule.parse(this.path).base;
    this.extension = params.extension.substring(1);
    if(params.autoload)
      this.data = fsModule.readFileSync(this.path, params.encoding); //at first here were data from file, after service put here parsed data
    this.id = Date.now(); //id == time of upload in miliseconds

    //used for png
    this.threshold = 100;

    //used for dxf
    this.minX = 0;
    this.minY = 0;
    this.maxX = 0;
    this.maxY = 0;

    //used for 3D
    this.angleX3D = 0;
    this.angleY3D = 0;
    this.angleZ3D = 0;
    this.X3D = 0;
    this.Y3D = 0;
    this.Z3D = 0;
    this.material = null;

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

module.exports = FileModel;
