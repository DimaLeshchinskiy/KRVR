var React = require("react");

class ToolPopover extends React.Component{
  render(){

    return React.createElement("div", {"className": "MyPopover"},
              this.props.children
            );
  }
}

module.exports = ToolPopover;
