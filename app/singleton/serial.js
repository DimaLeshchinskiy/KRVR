const SerialPort = require('serialport');
const events = require('events');
const Readline = SerialPort.parsers.Readline;
const parser = new Readline();
const listener = new events.EventEmitter();

const _state = require('../singleton/state');

buffer = [];
asyncReqCount = 0;
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
  if(!isOpen()) return;
  if(!connection || !connection.isOpen) return;

  buffer = [];
  listener.emit("log", "Stop", "input");
  listener.emit("end");

  _state.setStatus("stop");

  let buf = new Buffer(1);
  buf[0] = 0x18;
  connection.write(buf);
  connection.write("\n");
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
    return;
  }

  if(!connection || !connection.isOpen) return;

  if(cmd){
    stateChange(cmd);
    asyncReqCount++;
    connection.write(cmd + "\n");
  }
}

function writeToArduino(){
  if(!connection || !connection.isOpen) return;
  if(_state.getStatus() != "run") return;

  let data = buffer.shift();

  if(data && data.trim()){
    console.log(data);
    listener.emit("log", data, "input");
    stateChange(data);
    connection.write(data + "\n");
  }else{
    listener.emit("end");
  }
}

function stateChange(cmd){
  if(cmd == "M0" || cmd == "!")
    _state.setStatus("pause");
  else if(cmd == "M30")
    _state.setStatus("stop");
  else if(cmd == "~")
    _state.setStatus("run");

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
  /*if(data.includes("MPos")){
    listener.emit("position", data);
  }*/
  if(data.includes("Grbl")){
    listener.emit("log", data, "msg");
    writeToArduino();
  }
  else if(data.includes("ok")){
    /*console.log(asyncReqCount);
    if(asyncReqCount){
      asyncReqCount--;
    }else{
      listener.emit("log", data, "msg");
      writeToArduino();
    }*/

    listener.emit("log", data, "msg");
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
