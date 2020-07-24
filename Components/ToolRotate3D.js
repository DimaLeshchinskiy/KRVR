var React = require("react");
var SliderFile = require("../Components/SliderFile.js");

var fileManager = require("../app/fileManager");

class ToolRotate3D extends React.Component{
  constructor(props){
    super(props);

    this.renderIsSelected = this.renderIsSelected.bind(this);
    this.renderNotSelected = this.renderNotSelected.bind(this);

    this.whenChangeX = this.whenChangeX.bind(this);
    this.whenChangeY = this.whenChangeY.bind(this);
    this.whenChangeZ = this.whenChangeZ.bind(this);
  }

  whenChangeX(num){
    let file = fileManager.getSelected();
    file.angleX3D = -num;
    fileManager.listener.emit("update");

    this.forceUpdate();
  }
  whenChangeY(num){
    let file = fileManager.getSelected();
    file.angleY3D = -num;
    fileManager.listener.emit("update");

    this.forceUpdate();
  }
  whenChangeZ(num){
    let file = fileManager.getSelected();
    file.angleZ3D = -num;
    fileManager.listener.emit("update");

    this.forceUpdate();
  }

  renderNotSelected(){
    return React.createElement("div", {className:"section"},"File is not selected");
  }

  renderIsSelected(){
    return React.createElement("div", null,
              React.createElement(SliderFile,
                {
                  head: "Rotate X 3D",
                  template: "{val}",
                  min: 0,
                  max: 360,
                  step:1,
                  value: -fileManager.getSelected().angleX3D,
                  change: this.whenChangeX
                }),
              React.createElement(SliderFile,
                {
                  head: "Rotate Y 3D",
                  template: "{val}",
                  min: 0,
                  max: 360,
                  step:1,
                  value: -fileManager.getSelected().angleY3D,
                  change: this.whenChangeY
                }),
              React.createElement(SliderFile,
                {
                  head: "Rotate Z 3D",
                  template: "{val}",
                  min: 0,
                  max: 360,
                  step:1,
                  value: -fileManager.getSelected().angleZ3D,
                  change: this.whenChangeZ
                })
            );
  }

  render(){
    if(fileManager.getSelected())
      return this.renderIsSelected();
    else
      return this.renderNotSelected();
  }
}

module.exports = ToolRotate3D;
