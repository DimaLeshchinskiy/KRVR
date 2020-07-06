var React = require("react");
var SliderFile = require("../Components/SliderFile.js");

var fileManager = require("../app/fileManager");

class ToolRotate extends React.Component{
  constructor(props){
    super(props);

    this.renderIsSelected = this.renderIsSelected.bind(this);
    this.renderNotSelected = this.renderNotSelected.bind(this);

    this.whenChange = this.whenChange.bind(this);
  }

  whenChange(num){
    let file = fileManager.getSelected();
    file.angle = -num;
    fileManager.listener.emit("update");

    this.forceUpdate();
  }

  renderNotSelected(){
    return React.createElement("div", {className:"section"},"File is not selected");
  }

  renderIsSelected(){
    return React.createElement(SliderFile,
      {
        head: "Rotate",
        template: "{val}",
        min: 0,
        max: 360,
        step:1,
        value: -fileManager.getSelected().angle,
        change: this.whenChange
      });
  }

  render(){
    if(fileManager.getSelected())
      return this.renderIsSelected();
    else
      return this.renderNotSelected();
  }
}

module.exports = ToolRotate;
