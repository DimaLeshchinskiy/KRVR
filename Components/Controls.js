var React = require("react");

const config = require('../app/singleton/config');
const serial = require('../app/singleton/serial');
const _state = require('../app/singleton/state');

var Slider = require("../Components/Slider.js");
var ButtonLG = require("../Components/ButtonLG.js");

class Controls extends React.Component{
  constructor(props){
    super(props);

    this.state = {isLaserOn: false};

    this.alert = () => alert("event");
    this.OnOff = this.OnOff.bind(this);
  }

  OnOff(){
    if(_state.getStatus() == "run") return;

    if(this.state.isLaserOn){
      let cmd = "M3 S" + config.getPWM();
      serial.sendAsync(cmd);
    }else{
      let cmd = "M5";
      serial.sendAsync(cmd);
    }

    this.setState({isLaserOn: !this.state.isLaserOn});
  }

  UpLf(){
    if(_state.getStatus() == "run") return;

    let step =  config.getByKey("step");
    let feed = config.getByKey("feed");
    let cmd = `$J=G91 G21 Y${step} X-${step} Z0 F`+ feed;
    serial.sendAsync(cmd);
  }

  UpRg(){
    if(_state.getStatus() == "run") return;

    let step =  config.getByKey("step");
    let feed = config.getByKey("feed");
    let cmd = `$J=G91 G21 Y${step} X${step} Z0 F`+ feed;
    serial.sendAsync(cmd);
  }

  DwLf(){
    if(_state.getStatus() == "run") return;

    let step =  config.getByKey("step");
    let feed = config.getByKey("feed");
    let cmd = `$J=G91 G21 Y-${step} X-${step} Z0 F`+ feed;
    serial.sendAsync(cmd);
  }

  DwRg(){
    if(_state.getStatus() == "run") return;

    let step =  config.getByKey("step");
    let feed = config.getByKey("feed");
    let cmd = `$J=G91 G21 Y-${step} X${step} Z0 F`+ feed;
    serial.sendAsync(cmd);
  }


  incY(){
    if(_state.getStatus() == "run") return;

    let step =  config.getByKey("step");
    let feed = config.getByKey("feed");
    let cmd = `$J=G91 G21 X0 Y${step} Z0 F`+ feed;
    serial.sendAsync(cmd);
  }

  incX(){
    if(_state.getStatus() == "run") return;

    let step =  config.getByKey("step");
    let feed = config.getByKey("feed");
    let cmd = `$J=G91 G21 X${step} Y0 Z0 F`+ feed;
    serial.sendAsync(cmd);
  }

  incZ(){
    if(_state.getStatus() == "run") return;

    let step =  config.getByKey("step");
    let feed = config.getByKey("feed");
    let cmd = `$J=G91 G21 X0 Y0 Z${step} F`+ feed;
    serial.sendAsync(cmd);
  }

  decY(){
    if(_state.getStatus() == "run") return;

    let step =  config.getByKey("step");
    let feed = config.getByKey("feed");
    let cmd = `$J=G91 G21 X0 Y-${step} Z0 F`+ feed;
    serial.sendAsync(cmd);
  }

  decX(){
    if(_state.getStatus() == "run") return;

    let step =  config.getByKey("step");
    let feed = config.getByKey("feed");
    let cmd = `$J=G91 G21 X-${step} Y0 Z0 F`+ feed;
    serial.sendAsync(cmd);
  }

  decZ(){
    if(_state.getStatus() == "run") return;

    let step =  config.getByKey("step");
    let feed = config.getByKey("feed");
    let cmd = `$J=G91 G21 X0 Y0 Z-${step} F`+ feed;
    serial.sendAsync(cmd);
  }

  unlock(){
    if(_state.getStatus() == "run") return;

    serial.sendAsync('$X');
  }

  home(){
    if(_state.getStatus() == "run") return;

    serial.sendAsync('$G28');
  }


  render(){
    let laserState = "ON";

    if(this.state.isLaserOn)
      laserState = "OFF";

    return React.createElement(
              "div",
              { "className": "content" },
              React.createElement(
                ButtonLG, { color: "blue", name: "Unlock", click: this.unlock }
              ),
              React.createElement(
                "div",
                { "className": "section" },
                React.createElement(
                  "div",
                  { "className": "column" },
                  React.createElement(
                    "div",
                    { "className": "but btn btn-primary", onClick: this.UpLf },
                    React.createElement("img", { src: "../assets/img/up-left.png" })
                  ),
                  React.createElement(
                    "div",
                    { "className": "but btn btn-primary", onClick: this.decX },
                    "-X"
                  ),
                  React.createElement(
                    "div",
                    { "className": "but btn btn-primary", onClick: this.DwLf },
                    React.createElement("img", { src: "../assets/img/dwn-left.png" })
                  )
                ),
                React.createElement(
                  "div",
                  { "className": "column" },
                  React.createElement(
                    "div",
                    { "className": "but btn btn-primary", onClick: this.incY },
                    "+Y"
                  ),
                  React.createElement(
                    "div",
                    { "className": "but btn btn-primary", onClick: this.OnOff },
                    laserState
                  ),
                  React.createElement(
                    "div",
                    { "className": "but btn btn-primary", onClick: this.decY },
                    "-Y"
                  )
                ),
                React.createElement(
                  "div",
                  { "className": "column" },
                  React.createElement(
                    "div",
                    { "className": "but btn btn-primary", onClick: this.UpRg },
                    React.createElement("img", { src: "../assets/img/up-right.png" })
                  ),
                  React.createElement(
                    "div",
                    { "className": "but btn btn-primary", onClick: this.incX },
                    "+X"
                  ),
                  React.createElement(
                    "div",
                    { "className": "but btn btn-primary", onClick: this.DwRg },
                    React.createElement("img", { src: "../assets/img/dwn-right.png" })
                  )
                ),
                React.createElement(
                  "div",
                  { "className": "column" },
                  React.createElement(
                    "div",
                    { "className": "but btn btn-primary incZ", onClick: this.incZ},
                    "+Z"
                  ),
                  React.createElement(
                    "div",
                    { "className": "but btn btn-primary decZ", onClick: this.decZ},
                    "-Z"
                  )
                )
              ),
              React.createElement(Slider,{ head: "Step", template: "{val} mm", min: 1, max: 100, step:1, configName:"step"}), //step
              React.createElement(Slider,{ head: "Feed", template: "{val} mm/min", min: 50, max: 400, step:5, configName:"feed"}), //feed
              React.createElement(Slider,{ head: "Intensity", template: "{val}%", min: 0, max: 100, step:1, configName:"pwm"}), //pwm
              React.createElement(
                ButtonLG, { color: "blue", name: "Home", click: this.home }
              ),
              React.createElement(
                ButtonLG, { color: "grey", name: "Set origin", click: this.alert }
              )
            );
  }
}

module.exports = Controls;
