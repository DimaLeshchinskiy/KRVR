var Switch = require("../Components/Switch.js");

const config = require('../app/singleton/config');
var fileManager = require("../app/singleton/fileManager");

class ToolMaterial extends React.Component{
  constructor(props){
    super(props);
    this.renderIsSelected = this.renderIsSelected.bind(this);
    this.renderMsg = this.renderMsg.bind(this);

    this.change = this.change.bind(this);
  }

  change(event){
    let value = parseFloat(event.target.value);

    if(value.isPositiveNum()){
      if(config.getDevZ() < value)
        value = parseInt(config.getDevZ());

      let file = fileManager.getSelected();
      file.material.depth = value;

      fileManager.listener.emit("update");

      this.forceUpdate();
    }
  }


    renderMsg(msg){
      return React.createElement("div", {className:"section"},msg);
    }

    renderIsSelected(){
      return React.createElement(
                "div", null,
                React.createElement(
                  "div",
                  { "className": "section" },
                  React.createElement(
                    "div",
                    { "className": "row" },
                    React.createElement(
                      "p",
                      null,
                      "Material depth: "
                    ),
                    React.createElement("input", {
                      "className": "htmlForm-control htmlForm-control-sm stickyRulerSize",
                      type: "text",
                      placeholder: "Depth",
                      onChange: this.change,
                      value: fileManager.getSelected().material.depth
                    })
                  )
                )
              );
    }

  render(){
    if(!config.getDevZ())
      return this.renderMsg("Device is not support Z axis. Change device is settings.");

    if(fileManager.getSelected())
      return this.renderIsSelected();
    else
      return this.renderMsg("File is not selected");
  }
}

module.exports = ToolMaterial;
