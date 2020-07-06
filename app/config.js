var config = new Map();
const events = require('events');
const listener = new events.EventEmitter();

exports.listener = listener;

var MAXPWM = 255;

exports.save = save;
exports.load = load;
exports.put = put;
exports.set = set;
exports.getByKey = getByKey;
exports.getPWM = getPWM;

exports.getDevX = getDevX;
exports.getDevY = getDevY;
exports.getDevZ = getDevZ;

function save(){
  console.err("Function save in config.js is not ready");
}

function getPWM(){
  return getByKey("pwm") * (MAXPWM / 100);
}

function load(){
  put("device", null);

  put("feed", 10);
  put("pwm", 100);
  put("step", 10);

  put("darkmode", false);

  put("stickyRuler", false);
  put("stickyRulerSize", 10);

  put("ScreenS", 4.5);
}

function put(key, value){
  config.set(key, value);
}

function set(key, value){
  config.set(key, value);
  listener.emit("configUpdate", config);
}

function getByKey(key){
  return config.get(key);
}

function getDevY(){
  return config.get("device").maxY;
}

function getDevX(){
  return config.get("device").maxX;
}

function getDevZ(){
  return config.get("device").maxZ;
}
