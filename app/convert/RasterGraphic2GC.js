const config = require("../singleton/config");
const util = require("../utill");

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
  //move to left bottom of file
  Xbef += FileLTBT_X;
  Ybef += FileLTBT_Y;

  //rotation and scale
  let I = (Xbef - FileCenter_X) * scale;
  let J = (Ybef - FileCenter_Y) * scale;
  let r = Math.sqrt(Math.pow(I, 2) + Math.pow(J, 2));

  let new_angle = getAngle(r, I, J) - angle * Math.PI / 180;

  newX = r * Math.cos(new_angle) + FileCenter_X;
  newY = r * Math.sin(new_angle) + FileCenter_Y;

  return {x:newX, y:newY};
}

function LineGcode(x0, y0, x1, y1){
  //console.log(x0 + ":" + y0 + " -> " + x1 + ":" + y1);
  cmd = [];

  let point0 = getNewPoint(x0, y0);
  let point1 = getNewPoint(x1, y1);

  cmd.push("G0 X" + point0.x + " Y" + point0.y + " F" + feed);
  cmd.push(GONN);

  cmd.push("G1 X" + point1.x + " Y" + point1.y + " F" + feed);

  cmd.push(GOFF);

  return cmd;

}

function Line(x0, y0, x1, y1){
  let linesPerMM = 12;
  let gcode = [];

  for(let i = 0; i < linesPerMM; i++){
    let y = y0 - i / linesPerMM;
    let cmd = [];

    if(i % 2 == 0)//from left to right
      cmd = LineGcode(x0, y, x1, y);
    else//from right to left
      cmd = LineGcode(x1, y, x0, y);

    gcode = gcode.concat(cmd)
  }

  return gcode;
}

exports.getGcode = function(file){
  if(!file.data) return null;

  let scale = parseFloat(file.scale);
  let width = file.width * scale;
  let height = file.height * scale;

  let image = file.data.clone().scale(scale);

  FileCenter_X = file.offsetX;
  FileCenter_Y = file.offsetY;
  FileLTBT_X = FileCenter_X - file.centerX * scale;
  FileLTBT_Y = FileCenter_Y - file.centerY * scale;

  angle = file.angle;

  feed = config.getByKey("feed");

  let imageData = new ImageData(
      Uint8ClampedArray.from(image.bitmap.data),
      util.roundToDigits(width, 0), util.roundToDigits(height, 0)
  );
  util.threshold(imageData, file.threshold);

  let avg = imageData.data[0];

  GONN = "M3 S255";
  let gcode = ["$X", "G21", GOFF];
  let cmd = null;

  for(let i = 0; i < imageData.data.length; i+=4){

    if(imageData.data[i] != 0) //skip first white pixels
      continue;

    //its black now
    let startX =  (i / 4) % width;
    let startY = ((i / 4) - startX) / width;

    //i+=4; //next pixel
    while(imageData.data[i] == 0 && ((i / 4) + 1) % width != 0){ //go to last black pixel or end of line
      i+=4;
    }

    //end of black line
    let finishX = (i / 4) % width + 1;
    let finishY = ((i / 4) - finishX) / width;

    let cmd = Line(startX, height - startY, finishX, height - finishY);
    gcode = gcode.concat(cmd)

  }
  gcode.push("$X");
  return gcode;
}
