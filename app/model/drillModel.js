const utill = require("../utill");

class DrillModel{
  constructor(radius, size, set) {
    this.size = size;
    this.radius = radius;

    this.isInSet = set;

    this.id = utill.generateUUID();
  }

  inSet(parametr = true){
    this.isInSet = parametr;
  }

  equals(object = null){

    if(!object)
      return false;

    if(!(object instanceof DrillModel))
      return false;

    if(object.size != this.size)
      return false;

    if(object.radius != this.radius)
      return false;

    return true;

  }
}

module.exports = DrillModel;
