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

function LineGcode(x0, y0, x1, y1){
  //console.log(x0 + ":" + y0 + " -> " + x1 + ":" + y1);
  cmd = [];

  let point0 = getNewPoint(x0, y0);
  let point1 = getNewPoint(x1, y1);

  //cmd.push(GOFF);

  cmd.push("G0 X" + point0.x + " Y" + point0.y + " F" + feed);
  cmd.push(GONN);

  cmd.push("G1 X" + point1.x + " Y" + point1.y + " F" + feed);

  cmd.push(GOFF);

  return cmd;

}


function roundNumber(num) {
    //return util.roundToDigits(num, 2);
    return num;
}

function getImage(fileData){
  let width = fileData.width;
  let height = fileData.height;

  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  var imgData = ctx.createImageData(width, height);

  let count = 0;

  for (i = 0; i < fileData.data.length; i += 4) {
    imgData.data[i+0] = fileData.data[i+0];
    imgData.data[i+1] = fileData.data[i+1];
    imgData.data[i+2] = fileData.data[i+2];
    imgData.data[i+3] = fileData.data[i+3];

    if(fileData.data[i+0]) count++;
  }

  console.log(i + " " + count);
  ctx.putImageData(imgData, 0, 0);

  return canvas;
}

exports.getGcode = function(file){
  if(!file.data) return null;

  let scale = file.scale;
  let width = file.width * scale;
  let height = file.height * scale;

  FileCenter_X = file.offsetX;
  FileCenter_Y = file.offsetY;
  FileLTBT_X = FileCenter_X - file.centerX * scale;
  FileLTBT_Y = FileCenter_Y - file.centerY * scale;

  angle = file.angle;

  feed = config.getByKey("feed");

  //resize
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  var newCanvas = getImage(file.data);
  ctx.scale(scale, scale);
  ctx.drawImage(newCanvas, 0, 0);
  //end of resize

  let imageData = ctx.getImageData(0, 0, width, height);

  let avg = imageData.data[0];
  let startX = 0;
  let startY = 0;
  let finishX = 0;
  let finishY = 0;

  GONN = "M3 S255";
  let gcode = ["$X", "G21", GOFF];
/*
  for(let i = 4; i < imageData.data.length; i+=4){

    if((i / 4) % width == 0){
      finishX = width - 1;
      finishY = (i / 4) / finishX;

      if(avg > 0){
        GONN = "M3 S" + avg;
        cmd = LineGcode(startX, height - startY, finishX, height - finishY);
        gcode = gcode.concat(cmd)
      }

      startX = 0;
      startY = finishY + 1;
      avg = imageData.data[i + 4];
      i+=4;

    }else if(avg != imageData.data[i]){
      prev = i / 4 - 1;
      finishX = prev - parseInt(prev / width, 10) * width - 1;
      finishY = parseInt(prev / width, 10);

      if(avg > 0){
        GONN = "M3 S" + avg;
        cmd = LineGcode(startX, height - startY, finishX, height - finishY);
        gcode = gcode.concat(cmd)
      }

      startX = finishX + 1;
      startY = finishY;
      avg = imageData.data[i];
    }

  }
  */
  for(let i = 4; i < imageData.data.length; i+=4){

    if((i / 4) % width == 0){
      finishX = width - 1;
      finishY = (i / 4) / finishX;

      if(avg > 60){
        GONN = "M3 S255";
        cmd = LineGcode(startX, height - startY, finishX, height - finishY);
        gcode = gcode.concat(cmd)
      }

      startX = 0;
      startY = finishY + 1;
      avg = imageData.data[i + 4];
      i+=4;

    }else if(avg != imageData.data[i]){
      prev = i / 4 - 1;
      finishX = prev - parseInt(prev / width, 10) * width - 1;
      finishY = parseInt(prev / width, 10);

      if(avg > 60){
        GONN = "M3 S255";
        cmd = LineGcode(startX, height - startY, finishX, height - finishY);
        gcode = gcode.concat(cmd)
      }

      startX = finishX;
      startY = finishY;
      avg = imageData.data[i];
    }

  }
  gcode.push("$X");
  return gcode;
}
