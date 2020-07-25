const events = require('events');
const listener = new events.EventEmitter();

var selectedTool = null;

exports.listener = listener;
exports.select = select;


function select(toolId){
  if(toolId)
    listener.emit("toolChange", toolId);
}
