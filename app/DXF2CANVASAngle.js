const util = require("../app/util");
const config = require("../app/config");

var offsetX = 0;
var offsetY = 0;
var scale = 1;
var offsetAngle = 0;

var CnvCenterX = 0;
var CnvCenterY = 0;

var maxHeight = 0;

function RotatePoint(x, y){
  let r = Math.round(Math.pow(x - CnvCenterX, 2) + Math.pow(y - CnvCenterY, 2));
  let angle = getAngle(r, CnvCenterX - x, CnvCenterY - y) + offsetAngle;

  return getXYcurve(angle, r);
}

function getXYcurve(angle, radius){
  let y = (radius * Math.sin(angle));
  let x = (radius * Math.cos(angle));

  return [x, y];
}

function getAngle(radius, I, J){
  angle = Math.acos(-I / radius);

  if(I <= 0 && J <= 0)
    return angle;
  else if(I >= 0 && J <= 0)
    return Math.PI - angle;
  else if(I <= 0 && J >= 0)
    return 2 * Math.PI - angle;
  else if(I >= 0 && J >= 0)
    return Math.PI + angle;

}

function LineAdd(ctx, entity){
  let v = entity.vertices;

  let x0 = (roundNumber(v[0].x) + offsetX) * scale;
  let y0 = (maxHeight - roundNumber(v[0].y) + offsetY) * scale;

  let point0 = RotatePoint(x0, y0);
  x0 = point0[0];
  y0 = point0[1];

  let x1 = (roundNumber(v[1].x) + offsetX) * scale;
  let y1 = (maxHeight - roundNumber(v[1].y) + offsetY) * scale;

  let point1 = RotatePoint(x1, y1);
  x1 = point1[0];
  y1 = point1[1];

  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);

}

function PolyLineAdd(ctx, entity){
  let v = entity.vertices;

  let x0 = (roundNumber(v[0].x) + offsetX) * scale;
  let y0 = (maxHeight - roundNumber(v[0].y) + offsetY) * scale;

  let point0 = RotatePoint(x0, y0);
  x0 = point0[0];
  y0 = point0[1];

  ctx.moveTo(x0, y0);

  for(let i = 1; i < v.length; i++){
    let xi = (roundNumber(v[i].x) + offsetX) * scale;
    let yi = (maxHeight - roundNumber(v[i].y) + offsetY) * scale;

    let point = RotatePoint(xi, yi);
    xi = point[0];
    yi = point[1];

    ctx.lineTo(xi, yi);
  }
}

function ArcAdd(ctx, entity){
  let centerX = (roundNumber(entity.center.x) + offsetX) * scale;
  let centerY = (maxHeight - roundNumber(entity.center.y) + offsetY) * scale;

  let point = RotatePoint(centerX, centerY);
  centerX = point[0];
  centerY = point[1];

  let startAngle = (entity.startAngle * Math.PI) / 180 + offsetAngle; //radian
  let endAngle = (entity.endAngle * Math.PI) / 180 + offsetAngle; //radian
  let radius = roundNumber(entity.radius) * scale;

  let sX = Math.cos(startAngle) * radius + centerX;
  let sY = Math.sin(startAngle) * radius + centerY;

  ctx.moveTo(sX, sY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
}

function CircleAdd(ctx, entity){
  let centerX = (roundNumber(entity.center.x) + offsetX) * scale;
  let centerY = (maxHeight - roundNumber(entity.center.y) + offsetY) * scale;

  let point = RotatePoint(centerX, centerY);
  centerX = point[0];
  centerY = point[1];

  let radius = roundNumber(entity.radius) * scale;

  ctx.moveTo(centerX + radius, centerY);
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
}

function roundNumber(num) {
    return util.roundToDigits(num, 2);
}

exports.getCanvas = function(file){
  let json = file.data;
  if(!json) return null;

  //scale = file.scale * config.getByKey("ScreenS");

  width = file.width * scale;
  height = file.height * scale;
  maxHeight = file.height;

  offsetAngle = (file.angle * Math.PI) / 180;
  offsetX = -file.minX;
  offsetY = file.minY;

  CnvCenterX = width / 2;
  CnvCenterY = height / 2;

  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  var att = document.createAttribute("dataPath");
  att.value = file.path;
  canvas.setAttributeNode(att);

  let entities = json.entities;
  for(let i = 0; i < entities.length; i++){
    let entity = entities[i];

    let type = entity.type;

    switch(type){
      case "LINE":
      LineAdd(ctx, entity);
      break;
      case "POLYLINE":
      case "LWPOLYLINE":
      PolyLineAdd(ctx, entity);
      break;
      case "CIRCLE":
      CircleAdd(ctx, entity);
      break;
      case "ARC":
      ArcAdd(ctx, entity);
      break;
      default: continue;
    }

  }

  ctx.stroke();
  return canvas;
}
