const events = require('events');
const listener = new events.EventEmitter();

var manager = [];
var selectedFile = null;

exports.push = push;
exports.remove = remove;
exports.getById = getById;
exports.getAll = getAll;
exports.getLast = getLast;
exports.listener = listener;
exports.select = select;
exports.getSelected = getSelected;
exports.unselect = unselect;

function remove(file){
  for (var i = 0; i < manager.length; i++) {
    if(manager[i].equals(file)){
      manager.splice(i, 1);
      break;
    }
  }

  listener.emit("update");
}

function select(file){
  if(file)
    selectedFile = file;

  listener.emit("update");
}

function unselect(){
  selectedFile = null;
}

function getSelected(){
  return selectedFile;
}

function push(file){
  manager.push(file);
}

function getById(id){
  let file = {};

  for(let i = 0; i < manager.length; i++){
    if(manager[i].id == id){
      file = manager[i];
      break;
    }
  }

  return file;
}

function getAll(){
  return manager;
}

function getLast(){
  return manager[manager.length - 1];
}
