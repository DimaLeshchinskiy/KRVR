const FileModel = require("../model/fileModel");
const occ = require("node-occ").occ;


const materialService = require("../service/materialService");

function load(path) {

  var spawn = require('child_process').spawn,
   py    = spawn('python', ['./py/compute_input.py']),
   dataString = '';

  py.stdout.on('data', function(data){
    console.log(data);
    dataString += data.toString();
  });

  /*Once the stream is done (on 'end') we want to simply log the received data to the console.*/
  py.stdout.on('end', function(){
    console.log('Sum of numbers=',dataString);
  });

  py.stdin.write(path);

  py.stdin.end();
}

exports.getSTEP = async function(params){

  let file = new FileModel(params);

  //load(file.path);

  return file;
}
