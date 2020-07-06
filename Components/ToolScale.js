var React = require("react");
var SliderFile = require("../Components/SliderFile.js");

var fileManager = require("../app/fileManager");

class ToolScale extends React.Component{
  constructor(props){
    super(props);

    this.renderIsSelected = this.renderIsSelected.bind(this);
    this.renderNotSelected = this.renderNotSelected.bind(this);

    this.whenChange = this.whenChange.bind(this);
  }

  whenChange(num){
    let file = fileManager.getSelected();
    file.scale = num;
    fileManager.listener.emit("update");

    this.forceUpdate();
  }

  renderNotSelected(){
    return React.createElement("div", {className:"section"},"File is not selected");
  }

  renderIsSelected(){
    return React.createElement(SliderFile,
      {
        head: "Scale",
        template: "{val}",
        min: 0.25,
        max: 4,
        step:0.25,
        value: fileManager.getSelected().scale,
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

module.exports = ToolScale;
