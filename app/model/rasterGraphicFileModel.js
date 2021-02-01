const FileModel = require("./fileModel");

class RasterGraphicFileModel extends FileModel{
  constructor(params) {
    super(params);

    this._threshold = 100;
  }

  set threshold(val){
    this._threshold = parseInt(val);
  }

  get threshold(){
    return this._threshold
  }

  equals(object){

    if(!object)
      return false;

    if(!(object instanceof RasterGraphicFileModel))
      return false;

    if(object.id == this.id)
      return true;

  }
}

module.exports = RasterGraphicFileModel;
