//var serial = require("../singleton/serial");
const events = require('events');
const listener = new events.EventEmitter();

exports.listener = listener;

var position = [0, 0, 0] //x,y,z

const statuses = ["stop", "run", "pause"];
var status = "stop";

exports.getPosition = () => {return position};
exports.getX = () => {return position[0]};
exports.getY = () => {return position[1]};
exports.getZ = () => {return position[2]};

exports.setPosition = (newPosition) => {
  position = newPosition;
  listener.emit("changePos", position);
};
exports.setX = (newX) => {position[0] = newX};
exports.setY = (newY) => {position[1] = newY};
exports.setZ = (newZ) => {position[2] = newZ};

exports.addX = (addX) => {position[0] += addX};
exports.addY = (addY) => {position[1] += addY};
exports.addZ = (addZ) => {position[2] += addZ};

exports.print = () => {console.log(position)};

exports.getStatus = () => {return status};
exports.setStatus = (newStatus) => {
  if(statuses.includes(newStatus)){
    status = newStatus;
    listener.emit("changeStatus", status);
  }
};
/*
serial.listener.on("position", (str)=>{
  console.log(str);
  //str = <Idle|MPos:10.000,10.000,0.000|FS:0,0|Pn:XYZ>
  let pos3D = str.split("|")[1];
  //pos3D = MPos:10.000,10.000,0.000
  pos3D = pos3D.split(":")[1];
  //pos3D = 10.000,10.000,0.000
  pos3D = pos3D.split(",");

  for (var i = 0; i < pos3D.length; i++) {
    pos3D[i] = parseFloat(pos3D[i]);
  }

  this.setPosition(pos3D);
});

*/
/*
setInterval(
  function(){
    serial.sendAsync("?");
  }, 300);
  */
