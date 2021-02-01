const rasterGraphicFileModel = require("../model/rasterGraphicFileModel");
const Jimp = require('jimp');

exports.getRasterGraphic = async function (params){
  let file = new rasterGraphicFileModel(params);

  let image = await Jimp.read(file.path);
  image.grayscale();

  file.width = image.bitmap.width;
  file.height = image.bitmap.height;

  file.centerX = file.width / 2;
  file.centerY = file.height / 2;

  file.data = image;

  return file;
}
