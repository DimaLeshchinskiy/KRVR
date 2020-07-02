var React = require("react");

var ButtonLG = require("../Components/ButtonLG.js");

var fileManager = require("../app/fileManager");
var d2g = require("../app/DXF2GC");
var serial = require("../app/serial");

class Process extends React.Component{

  constructor(props){
    super(props);

    this.click = this.click.bind(this);

    this.state = {isWorking: false};

    serial.listener.on("end", () => this.setState({isWorking: false}));
  }

  click(){

    //delete from this
    let files = fileManager.getAll();

    for (var i = 0; i < files.length; i++) {
      let file = files[i];
      let gcode = d2g.getGcode(file);

      console.log(gcode);
    }

    //delete to this

    if(!serial.isOpen()){
      //showMsg("Ooops", "Port is not connected");
      return;
    }

    if(!this.state.isWorking){
      this.setState({isWorking: true});

      let files = fileManager.getAll();

      for (var i = 0; i < files.length; i++) {
        let file = files[i];
        let gcode = d2g.getGcode(file);

        console.log(gcode);

        serial.push(gcode);
      }

      serial.write();
    }else{
      serial.stop();
    }

  }

  render(){

    let name = "Start";
    let color = "blue";

    if(this.state.isWorking){
      name = "Stop";
      color = "red";
    }

    return React.createElement(
              "div",
              { "className": "content" },
              React.createElement(
                ButtonLG, { color: color, name: name, click: this.click }
              )
            );
  }
}

module.exports = Process;
