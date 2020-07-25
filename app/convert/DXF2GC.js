const util = require("../util");
const config = require("../singleton/config");

var scale = 1;

var FileCenter_X = 0;
var FileCenter_Y = 0;
var FileLTBT_X = 0;
var FileLTBT_Y = 0;

var angle = 0;

var feed = 1;

var GOFF = "M5";
var GONN = "M3";

function getAngle(radius, I, J){
  let loc_angle = Math.acos(Math.abs(I) / radius);

  if(I <= 0 && J <= 0)
    return Math.PI + loc_angle;
  else if(I >= 0 && J <= 0)
    return 2 * Math.PI - loc_angle;
  else if(I <= 0 && J >= 0)
    return Math.PI - loc_angle;
  else if(I >= 0 && J >= 0)
    return loc_angle;

}

function getNewPoint(Xbef, Ybef){
  //console.log(Xbef + " " + Ybef);
  //move to left bottom of file
  Xbef += FileLTBT_X;
  Ybef += FileLTBT_Y;

  /*console.log(FileLTBT_X + " " + FileLTBT_Y);
  console.log(Xbef + " " + Ybef);*/

  //rotation and scale
  let I = (Xbef - FileCenter_X) * scale;
  let J = (Ybef - FileCenter_Y) * scale;
  let r = Math.sqrt(Math.pow(I, 2) + Math.pow(J, 2));

  let new_angle = getAngle(r, I, J) - angle * Math.PI / 180;

  newX = r * Math.cos(new_angle) + FileCenter_X;
  newY = r * Math.sin(new_angle) + FileCenter_Y;

  /*console.log(I + " " + J + " " + r);
  console.log(FileCenter_X + " " + FileCenter_Y);

  console.log(new_angle + " " + getAngle(r, I, J) + " " + angle + " " + (angle * Math.PI / 180));
  console.log({x:newX, y:newY});*/

  return {x:newX, y:newY};
}

function LineGcode(entity){
  cmd = [];
  let v = entity.vertices;

  let x0 = roundNumber(v[0].x);
  let y0 = roundNumber(v[0].y);
  let point0 = getNewPoint(x0, y0);

  let x1 = roundNumber(v[1].x);
  let y1 = roundNumber(v[1].y);
  let point1 = getNewPoint(x1, y1);

  cmd.push(GOFF);

  cmd.push("G0 X" + point0.x + " Y" + point0.y + " F" + feed);
  cmd.push(GONN);

  cmd.push("G1 X" + point1.x + " Y" + point1.y + " F" + feed);

  cmd.push(GOFF);

  return cmd;

}

function PolyLineGcode(entity){
  cmd = [];
  let v = entity.vertices;

  cmd.push(GOFF);

  let x0 = roundNumber(v[0].x);
  let y0 = roundNumber(v[0].y);
  let point0 = getNewPoint(x0, y0);

  cmd.push("G0 X" + point0.x + " Y" + point0.y + " F" + feed);
  cmd.push(GONN);

  for(let i = 1; i < v.length; i++){
    let xi = roundNumber(v[i].x);
    let yi = roundNumber(v[i].y);
    let point = getNewPoint(xi, yi);
    cmd.push("G1 X" + point.x + " Y" + point.y + " F" + feed);
  }

  cmd.push(GOFF);

  return cmd;
}

function getXYcurve(angle, radius){
  //converts to radian
  angle *= Math.PI;
  angle /= 180;

  let y = (radius * Math.sin(angle));
  let x = (radius * Math.cos(angle));

  return [x, y];
}

function ArcGcode(entity){
  cmd = [];

  let cx = roundNumber(entity.center.x);
  let cy = roundNumber(entity.center.y);
  let point = getNewPoint(cx, cy);

  let centerX = point.x;
  let centerY = point.y;
  let radius = roundNumber(entity.radius) * scale;

  let sPoints = getXYcurve(entity.startAngle, radius);
  sPoints[0] += centerX;
  sPoints[1] += centerY;

  let ePoints = getXYcurve(entity.endAngle, radius);
  ePoints[0] += centerX;
  ePoints[1] += centerY;

  let cPoints = getXYcurve(entity.startAngle, radius);
  let i = roundNumber((centerX - cPoints[0]) - centerX);
  let j = roundNumber((centerY - cPoints[1]) - centerY);

  cmd.push(GOFF);

  cmd.push("G0 X" + roundNumber(sPoints[0]) + " Y" + roundNumber(sPoints[1]) + " F" + feed);
  cmd.push(GONN);

  cmd.push("G2 X" + roundNumber(ePoints[0]) + " Y" + roundNumber(ePoints[1]) + " I" + i + " J" + j + " F" + feed);

  cmd.push(GOFF);

  return cmd;
}

function CircleGcode(entity){
  cmd = [];
  let cx = roundNumber(entity.center.x);
  let cy = roundNumber(entity.center.y);
  let point = getNewPoint(cx, cy);

  let centerX = point.x;
  let centerY = point.y;
  let radius = roundNumber(entity.radius) * scale;

  let sX = roundNumber(centerX + radius);
  let eX = roundNumber(centerX - radius);

  cmd.push(GOFF);

  cmd.push("G0 X" + sX + " Y" + centerY + " F" + feed);
  cmd.push(GONN);

  cmd.push("G2 X" + eX + " Y" + centerY + " I" + (-radius) + " J0" + " F" + feed);
  cmd.push("G2 X" + sX + " Y" + centerY + " I" + radius + " J0" + " F" + feed);

  cmd.push(GOFF);

  return cmd;
}

function roundNumber(num) {
    //return util.roundToDigits(num, 2);
    return num;
}

exports.getGcode = function(file){
  let json = file.data;
  if(!json) return null;

  scale = file.scale;

  FileCenter_X = (file.offsetX - file.minX);
  FileCenter_Y = (file.offsetY - file.minY);
  FileLTBT_X = FileCenter_X - file.width / 2;
  FileLTBT_Y = FileCenter_Y - file.height / 2;

  angle = file.angle;

  feed = config.getByKey("feed");
  GONN = "M3 S" + config.getPWM();

  let gcode = ["$X", "G21", GOFF];
  let entities = json.entities;
  for(let i = 0; i < entities.length; i++){
    let entity = entities[i];

    let type = entity.type;
    let cmd = [];

    switch(type){
      case "LINE":
      cmd = LineGcode(entity);
      break;
      case "POLYLINE":
      case "LWPOLYLINE":
      cmd = PolyLineGcode(entity);
      break;
      case "CIRCLE":
      cmd = CircleGcode(entity);
      break;
      case "ARC":
      cmd = ArcGcode(entity);
      break;
      default: continue;
    }

    gcode = gcode.concat(cmd);

  }

  gcode.push("$X");
  return gcode;
}
