const config = require("../singleton/config");
const util = require("../utill");

exports.getCanvas = function(file){
  if(!file.data) return null;

  let scale = file.scale * config.getByKey("ScreenS");
  let width = file.width * scale;
  let height = file.height * scale;

  let image = file.data.clone().scale(scale);

  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;

  let imageData = new ImageData(
      Uint8ClampedArray.from(image.bitmap.data),
      util.roundToDigits(width, 0), util.roundToDigits(height, 0)
  );
  util.threshold(imageData, file.threshold);
  ctx.putImageData(imageData, 0, 0);

  var att = document.createAttribute("dataId");
  att.value = file.id;
  canvas.setAttributeNode(att);

  return canvas;
}
