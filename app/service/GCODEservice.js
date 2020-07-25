const FileModel = require("../model/fileModel");

exports.getGcode = async function(params){
  let file = new FileModel(params);

  file.data = file.data.split("\n");

  return file;
}
