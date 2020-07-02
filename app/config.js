var config = new Map();

var MAXPWM = 255;

exports.save = save;
exports.load = load;
exports.put = put;
exports.getByKey = getByKey;
exports.getPWM = getPWM;

function save(){
  console.err("Function save in config.js is not ready");
}

function getPWM(){
  return getByKey("pwm") * (MAXPWM / 100);
}

function load(){
  put("feed", 10);
  put("pwm", 100);
  put("step", 10);

  put("darkmode", false);

  put("stickyRuler", false);
  put("stickyRulerSize", 10);

  put("ScreenH", 140);
  put("ScreenW", 220);
  put("ScreenS", 4.5);
}

function put(key, value){
  config.set(key, value);
}

function getByKey(key){
  return config.get(key);
}
