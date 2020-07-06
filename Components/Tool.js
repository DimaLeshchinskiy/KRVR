var React = require("react");

class Tool extends React.Component{
  render(){

    return React.createElement(
              "div",
              { "className": "tool", title: this.props.name, onClick: this.props.click},
              React.createElement(
                "div",
                { "className": "icon" },
                React.createElement("img", { src: this.props.src, alt: "" })
              )
            );
  }
}

module.exports = Tool;
