var React = require("react");

var ButtonLG = require("../Components/ButtonLG.js");

var fileManager = require("../app/singleton/fileManager");
var flm = require("../app/service/fileService");
const serial = require('../app/singleton/serial');
const state = require('../app/singleton/state');

class Process extends React.Component{

  constructor(props){
    super(props);

    this.getPauseContent = this.getPauseContent.bind(this);
    this.getRunContent = this.getRunContent.bind(this);
    this.getStopContent = this.getStopContent.bind(this);

    this.run = this.run.bind(this);
    this.pause = this.pause.bind(this);
    this.stop = this.stop.bind(this);
    this.resume = this.resume.bind(this);

    this.state = {status: state.getStatus()};

    state.listener.on("changeStatus", (state) => this.setState({status: state}));
  }

  pause(){
    serial.sendAsync("!");
  }

  resume(){
    serial.sendAsync("~");
  }

  run(){
    state.setStatus("run");
    this.generateGCODE();
  }

  stop(){
    serial.stop();
  }

  getStopContent(){
    return React.createElement(
              "div",
              { "className": "content" },
              React.createElement(
                ButtonLG, { color: "blue", name: "GO", click: this.run }
              )
            );
  }

  getPauseContent(){
    return React.createElement(
              "div",
              { "className": "content" },
              React.createElement(
                ButtonLG, { color: "green", name: "Resume", click: this.resume }
              ),
              React.createElement(
                ButtonLG, { color: "red", name: "Stop", click: this.stop }
              )
            );
  }

  getRunContent(){
    return React.createElement(
              "div",
              { "className": "content" },
              React.createElement(
                ButtonLG, { color: "orange", name: "Pause", click: this.pause }
              ),
              React.createElement(
                ButtonLG, { color: "red", name: "Stop", click: this.stop }
              )
            );
  }

  generateGCODE(){

    //delete from this
    /*
    let files = fileManager.getAll();
    let promises = [];

    for (var i = 0; i < files.length; i++) {
      let file = files[i];
      promises.push(flm.getGcode(file));
    }

    Promise.allSettled(promises).
      then((results) => results.forEach((result) => console.log(result.value)));
    */
    //delete to this

    if(!serial.isOpen()){
      //showMsg("Ooops", "Port is not connected");
      return;
    }else{
      let files = fileManager.getAll();
      let promises = [];

      for (var i = 0; i < files.length; i++) {
        let file = files[i];
        promises.push(flm.getGcode(file));
      }

      Promise.allSettled(promises).
        then((results) => {
          results.forEach((result) => {
            serial.push(result.value);
          })
          serial.write();
      });
    }

  }

  render(){

    if(this.state.status == "run")
      return this.getRunContent();
    else if(this.state.status == "stop")
      return this.getStopContent();
    else if(this.state.status == "pause")
      return this.getPauseContent();

  }
}

module.exports = Process;
