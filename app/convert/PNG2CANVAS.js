const util = require("../util");
const config = require("../singleton/config");

function getImage(file){
  let fileData = file.data;
  let width = fileData.width;
  let height = fileData.height;

  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  var imgData = ctx.createImageData(width, height);

  for (i = 0; i < fileData.data.length; i += 4) {
    let avg = fileData.data[i+0] > file.threshold? 255:0;

    imgData.data[i+0] = avg;
    imgData.data[i+1] = avg;
    imgData.data[i+2] = avg;
    imgData.data[i+3] = fileData.data[i+3];
    //console.log(fileData.data[i+3]);
  }
  ctx.putImageData(imgData, 0, 0);

  return canvas;
}

exports.getCanvas = function(file){
  if(!file.data) return null;

  let scale = file.scale * config.getByKey("ScreenS");

  let width = file.width * scale;
  let height = file.height * scale;

  //resize
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  var newCanvas = getImage(file);
  ctx.scale(scale, scale);
  ctx.drawImage(newCanvas, 0, 0);
  //end of resize

  var att = document.createAttribute("dataId");
  att.value = file.id;
  canvas.setAttributeNode(att);

  return canvas;
}
