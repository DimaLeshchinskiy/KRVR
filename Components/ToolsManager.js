var React = require("react");

var toolManager = require("../app/toolManager");

var ToolGrid = require("../Components/ToolGrid.js");
var ToolRotate = require("../Components/ToolRotate.js");
var ToolScale = require("../Components/ToolScale.js");
var ToolZoom = require("../Components/ToolZoom.js");

const toolIds = [
                  {toolId:"grid", component: ToolGrid},
                  {toolId:"rotate", component: ToolRotate},
                  {toolId:"scale", component: ToolScale},
                  {toolId:"zoom", component: ToolZoom}
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
