const PNGJS = require("pngjs").PNG;

function grayscale(png){
  let data = png.data;

  for (i = 0; i < data.length; i += 4) {
    red = data[i + 0];
    green = data[i + 1];
    blue = data[i + 2];

    avg = 0.21 * red + 0.71 * green + 0.07 * blue;

    data[i+0] = avg;
    data[i+1] = avg;
    data[i+2] = avg;
  }

  png.data = data;

  return png;
}

exports.getPng = async function (file){
  let png = PNGJS.sync.read(file.data);
  file.data = grayscale(png);

  file.width = png.width;
  file.height = png.height;

  //file.scale = 1/4.5;

  file.centerX = file.width / 2;
  file.centerY = file.height / 2;

  return file;
}
