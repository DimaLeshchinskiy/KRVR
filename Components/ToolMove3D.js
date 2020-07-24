var React = require("react");
var SliderFile = require("../Components/SliderFile.js");

var fileManager = require("../app/fileManager");
var config = require("../app/config");

class ToolMove3D extends React.Component{
  constructor(props){
    super(props);

    this.renderIsSelected = this.renderIsSelected.bind(this);
    this.renderNotSelected = this.renderNotSelected.bind(this);

    this.whenChangeX = this.whenChangeX.bind(this);
    this.whenChangeY = this.whenChangeY.bind(this);
    this.whenChangeZ = this.whenChangeZ.bind(this);

    this.update = this.update.bind(this);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    config.listener.on("configUpdate", this.update);
  }

  update(){
    if(!this._isMounted) return;
    this.forceUpdate();
  }

  whenChangeX(num){
    let file = fileManager.getSelected();
    file.X3D = -num;
    fileManager.listener.emit("update");

    this.forceUpdate();
  }
  whenChangeY(num){
    let file = fileManager.getSelected();
    file.Y3D = -num;
    fileManager.listener.emit("update");

    this.forceUpdate();
  }
  whenChangeZ(num){
    let file = fileManager.getSelected();
    file.Z3D = -num;
    fileManager.listener.emit("update");

    this.forceUpdate();
  }

  renderNotSelected(){
    return React.createElement("div", {className:"section"},"File is not selected");
  }

  renderIsSelected(){
    let zControl = null;
    if(config.getDevZ())
      zControl = React.createElement(SliderFile,
                  {
                    head: "Move Z 3D",
                    template: "{val}",
                    min: 0,
                    max: config.getDevZ(),
                    step:1,
                    value: -fileManager.getSelected().Z3D,
                    change: this.whenChangeZ
                  });

    return React.createElement("div", null,
              React.createElement(SliderFile,
                {
                  head: "Move X 3D",
                  template: "{val}",
                  min: 0,
                  max: config.getDevX(),
                  step:1,
                  value: -fileManager.getSelected().X3D,
                  change: this.whenChangeX
                }),
              React.createElement(SliderFile,
                {
                  head: "Move Y 3D",
                  template: "{val}",
                  min: 0,
                  max: config.getDevY(),
                  step:1,
                  value: -fileManager.getSelected().Y3D,
                  change: this.whenChangeY
                }),
              zControl
            );
  }

  render(){
    if(fileManager.getSelected())
      return this.renderIsSelected();
    else
      return this.renderNotSelected();
  }
}

module.exports = ToolMove3D;
