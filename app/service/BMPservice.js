const FileModel = require("../model/fileModel");
const Jimp = require('jimp');

exports.getBmp = async function (params){
  let file = new FileModel(params);

  let image = await Jimp.read(file.path);
  image.grayscale();

  file.width = image.bitmap.width;
  file.height = image.bitmap.height;

  file.centerX = file.width / 2;
  file.centerY = file.height / 2;

  file.data = image;

  return file;
}
