const pars = require("dxf-parser");
const config = require("../singleton/config");
const FileModel = require("../model/fileModel");

const parser = new pars();

let minX = 0;
let minY = 0;

let maxX = 0;
let maxY = 0;

function PolyLine(entity){
  let v = entity.vertices;

  for(let i = 0; i < v.length; i++){
    let xi = roundNumber(v[i].x);
    let yi = roundNumber(v[i].y);

    if(xi > maxX) maxX = xi;
    if(xi < minX) minX = xi;

    if(yi > maxY) maxY = yi;
    if(yi < minY) minY = yi;
  }
}

function Arc(entity){
  let centerX = roundNumber(entity.center.x);
  let centerY = roundNumber(entity.center.y);
  let startAngle = (entity.startAngle * Math.PI) / 180; //radian
  let endAngle = (entity.endAngle * Math.PI) / 180; //radian
  let radius = roundNumber(entity.radius);

  let sX = Math.cos(startAngle) * radius + centerX;
  let sY = Math.sin(startAngle) * radius + centerY;

  let eX = Math.cos(endAngle) * radius + centerX;
  let eY = Math.sin(endAngle) * radius + centerY;

  if(sX > maxX) maxX = sX;
  if(sX < minX) minX = sX;

  if(eX > maxX) maxX = eX;
  if(eX < minX) minX = eX;

  if(sY > maxY) maxY = sY;
  if(sY < minY) minY = sY;

  if(eY > maxY) maxY = eY;
  if(eY < minY) minY = eY;
}

function Circle(entity){
  let centerX = roundNumber(entity.center.x);
  let centerY = roundNumber(entity.center.y);
  let radius = roundNumber(entity.radius) ;

  if(centerX + radius > maxX) maxX = centerX + radius;
  if(centerX - radius < minX) minX = centerX - radius;
  if(centerY + radius > maxY) maxY = centerY + radius;
  if(centerY - radius < minY) minY = centerY - radius;

}

function roundNumber(num) {
    return util.roundToDigits(num, 2);
}


exports.getDxf = async function(params){

  let file = new FileModel(params);

  maxX = 0;
  maxY = 0;
  minX = 0;
  minY = 0;

  try {
    var dxf = parser.parseSync(file.data);
    file.data = dxf;

    let entities = dxf.entities;
    for(let i = 0; i < entities.length; i++){
      let entity = entities[i];

      let type = entity.type;

      switch(type){
        case "LINE":
        case "POLYLINE":
        case "LWPOLYLINE":
        PolyLine(entity);
        break;
        case "CIRCLE":
        Circle(entity);
        break;
        case "ARC":
        Arc(entity);
        break;
        default: continue;
      }
    }

    file.minX = minX;
    file.minY = minY;

    file.maxX = maxX;
    file.maxY = maxY;

    file.width = file.maxX - file.minX;
    file.height = file.maxY - file.minY;

    file.centerX = file.width / 2;
    file.centerY = file.height / 2;

  } catch (err) {
    console.error(err.stack);
  }finally{
    return file;
  }
}
