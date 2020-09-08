const DrillModel = require("../model/drillModel");

var originalSizes = [
  {size: 10, radius: 0.25},
  {size: 10, radius: 0.35},
  {size: 10, radius: 0.55},
  {size: 10, radius: 0.55},
  {size: 10, radius: 0.65},
  {size: 10, radius: 0.75},
  {size: 10, radius: 0.85},
  {size: 10, radius: 0.95},
  {size: 10, radius: 1.05, inSet: true},
  {size: 10, radius: 1.15},
  {size: 10, radius: 2.1},
  {size: 10, radius: 2.2},
  {size: 10, radius: 2.3},
  {size: 10, radius: 2.4},
  {size: 10, radius: 2.5, inSet: true},
  {size: 10, radius: 2.6},
  {size: 10, radius: 2.7},
  {size: 10, radius: 2.8},
  {size: 10, radius: 2.9},
  {size: 10, radius: 3, inSet: true}
];
var original =  [];
var custom =  [];

exports.load = function(){

  for(let i = 0; i < originalSizes.length; i++)
    original.push(this.create(originalSizes[i].radius, originalSizes[i].size, originalSizes[i].inSet));
}

exports.getAll = function(){
  return original.concat(custom);
}

exports.getSet = function(){
  let drills = this.getAll();
  let set = [];

  for (var i = 0; i < drills.length; i++){
    if(drills[i].isInSet)
      set.push(drills[i]);
  }

  return set;
}

exports.getSortedSet = function(fromBig = true){
  let drills = this.getSortedAll(fromBig);
  let set = [];

  for (var i = 0; i < drills.length; i++){
    if(drills[i].isInSet)
      set.push(drills[i]);
  }

  return set;
}

exports.getSortedAll = function(fromBig = true){
  let drills = this.getAll();

  let fromBigFunc = function(a, b){
      if (a.radius < b.radius) return 1;
      return -1;
  }

  let fromSmallFunc = function(a, b){
      if (a.radius > b.radius) return 1;
      return -1;
  }

  let func = (fromBig)? fromBigFunc: fromSmallFunc;
  drills = drills.sort(func);

  return drills;
}

exports.getById = function(id){
  let drills = this.getAll();

  for (var i = 0; i < drills.length; i++){
    if(drills[i].id == id)
      return drills[i];
  }

  return null;
}

exports.pushInSet = function(id){
  let drill = getById(id);

  if(drill)
    drill.inSet();
}

exports.addNew = function(radius, size, set = false){
  custom.push(create(radius, size, set));
}

exports.create = function(radius, size, set = false){
  return new DrillModel(radius, size, set);
}
