var React = require("react");

var ToolPopover = require("../Components/ToolPopover.js");

class Tool extends React.Component{
  render(){

    let popContent = [];

    if(this.props.children)
      popContent = React.createElement(ToolPopover, null, this.props.children);

    return React.createElement(
              "div",
              { "className": "tool", title: this.props.name, onClick: this.props.click},
              React.createElement(
                "div",
                { "className": "icon" },
                React.createElement("img", { src: this.props.src, alt: "" })
              ),
              popContent
            );
  }
}

module.exports = Tool;
