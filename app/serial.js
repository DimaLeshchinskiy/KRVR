const SerialPort = require('serialport');
const events = require('events');
const Readline = SerialPort.parsers.Readline;
const parser = new Readline();
const listener = new events.EventEmitter();

buffer = [];
connection = {};

exports.listener = listener;

exports.send = sendToArduino;
exports.write = writeToArduino;
exports.stop = stop;
exports.push = pushToBuffer;
exports.close = closeConnection;
exports.getConnection = getConnection;
exports.isOpen = isOpen;
exports.getPorts = getPortsAvailable;

exports.sendAsync = sendToArduinoAsync;

function isOpen(){
  return connection && connection.isOpen;
}

function pushToBuffer(data){
  buffer = buffer.concat(data);
}

function stop(){
  buffer = ["M1"];
  listener.emit("log", "Stop", "input");
  listener.emit("end");
}

function sendToArduino(data){
  if(!isOpen()){
    //showMsg("Ooops", "Port is not connected");
    console.log(data + " test");
    return;
  }

  pushToBuffer([data]);
  writeToArduino();
}

function sendToArduinoAsync(cmd){
  if(!isOpen()){
    //showMsg("Ooops", "Port is not connected");
    console.log(data + " test");
    return;
  }

  if(!connection || !connection.isOpen) return;

  if(cmd){
    connection.write(cmd + "\n");
  }
}

function writeToArduino(){
  if(!connection || !connection.isOpen) return;

  let data = buffer.shift();

  if(data){
    listener.emit("log", data, "input");

    connection.write(data + "\n");
  }else{
    listener.emit("end");
  }
}

async function closeConnection(){
  if(!connection) return;

  buffer = [];

  if(connection.isOpen){
    await connection.flush();
    await connection.close();
    listener.emit("log", "Connection is closed", "msg");
  }
}

async function getPortsAvailable(){
  return await SerialPort.list();
}

function getConnection(port){
  connection = new SerialPort(port, {
    autoOpen: false,
    baudRate: 115200
  });

  connection.pipe(parser);

  connection.open(function(){
    listener.emit("log", "Port " + port + " is open", "msg");
    buffer = ["$X"];
  });

}


parser.on('data', function(data) {
  if(data.includes("MPos")){
    listener.emit("position", data);
  }
  else if(data.includes("Grbl")){
    listener.emit("log", data, "msg");
    writeToArduino();
  }
  else if(data.includes("ok")){
    writeToArduino();
  }
  else if(data.includes("error")){
    listener.emit("log", data, "error");
    writeToArduino();
  }
  else if(data.includes("ALARM")){
    listener.emit("log", data, "error");
  }else{
    listener.emit("log", data, "msg");
  }
});
