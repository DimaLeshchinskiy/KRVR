var React = require("react");
var SliderFile = require("../Components/SliderFile.js");

var fileManager = require("../app/singleton/fileManager");

class FileProperty extends React.Component{
  constructor(props){
    super(props);

    this.whenChange = this.whenChange.bind(this);

  }


  whenChange(num){
    let file = this.props.file;
    file.threshold = num;
    fileManager.listener.emit("update");

    this.forceUpdate();
  }


  render(){

    return React.createElement(SliderFile,
      {
        head: "Threshold",
        template: "{val}",
        min: 0,
        max: 255,
        step:1,
        value: this.props.file.threshold,
        change: this.whenChange
      });
  }
}

module.exports = FileProperty;
