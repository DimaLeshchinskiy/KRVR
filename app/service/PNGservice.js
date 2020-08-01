const PNGJS = require("pngjs").PNG;
const FileModel = require("../model/fileModel");


function grayscale(png){
  let data = png.data;

  for (i = 0; i < data.length; i += 4) {
    red = data[i + 0];
    green = data[i + 1];
    blue = data[i + 2];

    let avg = 0.21 * red + 0.71 * green + 0.07 * blue;

    data[i+0] = avg;
    data[i+1] = avg;
    data[i+2] = avg;
  }

  png.data = data;

  return png;
}

exports.getPng = async function (params){
  let file = new FileModel(params);

  let png = PNGJS.sync.read(file.data);
  file.data = grayscale(png);

  file.width = png.width;
  file.height = png.height;

  file.centerX = file.width / 2;
  file.centerY = file.height / 2;

  return file;
}
