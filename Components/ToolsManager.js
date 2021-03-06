var React = require("react");

var toolManager = require("../app/singleton/toolManager");

var ToolGrid = require("../Components/ToolGrid.js");
var ToolRotate = require("../Components/ToolRotate.js");
var ToolScale = require("../Components/ToolScale.js");
var ToolZoom = require("../Components/ToolZoom.js");

var ToolRotate3D = require("../Components/ToolRotate3D.js");
var ToolScale3D = require("../Components/ToolScale3D.js");
var ToolMove3D = require("../Components/ToolMove3D.js");
var ToolMaterial = require("../Components/ToolMaterial.js");

const toolIds = [
                  {toolId:"grid", component: ToolGrid},
                  {toolId:"rotate", component: ToolRotate},
                  {toolId:"scale", component: ToolScale},
                  {toolId:"zoom", component: ToolZoom},
                  {toolId:"scale3D", component: ToolScale3D},
                  {toolId:"rotate3D", component: ToolRotate3D},
                  {toolId:"move3D", component: ToolMove3D},
                  {toolId:"material3D", component: ToolMaterial}

                ];

class ToolsManager extends React.Component{
  constructor(props){
    super(props);

    this.state = {toolId:null};

    this.getToolSetup = this.getToolSetup.bind(this);

    toolManager.listener.on("toolChange", (tool) =>{
      this.setState({toolId: tool});
    });
  }

  getToolSetup() {
    let toolId = this.state.toolId;

    if(!toolId)
      return React.createElement("p", {"className": "align-items-center"},
          "Tool is not selected"
      );
    else{
      for (var i = 0; i < toolIds.length; i++) {
        if(toolIds[i].toolId == toolId)
          return React.createElement(toolIds[i].component);
      }
    }
  }

  render(){

    let toolSetup = this.getToolSetup();

    return  React.createElement(
              "div",
              { "className": "content" },
              toolSetup
            );
  }
}

module.exports = ToolsManager;
