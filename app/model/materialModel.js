class MaterialModel{
  constructor(params) {
    this.name = params.name;
    this.id = Date.now();

    this.depth = 10;

    this.texture = null;
  }

  equals(object){

    if(!object)
      return false;

    if(!(object instanceof MaterialModel))
      return false;

    if(object.id == this.id)
      return true;

  }
}

module.exports = MaterialModel;
