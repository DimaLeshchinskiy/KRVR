class DeviceModel{
  constructor(name, maxX, maxY, maxZ, id) {
    this.name = name;
    this.maxX = maxX;
    this.maxY = maxY;
    this.maxZ = maxZ;
    this.id = id;
  }

  equals(object){

    if(!object)
      return false;

    if(!(object instanceof DeviceModel))
      return false;

    if(object.name == this.name)
      return true;

  }
}

module.exports = DeviceModel;
