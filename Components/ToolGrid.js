var React = require("react");
var Switch = require("../Components/Switch.js");

class ToolGrid extends React.Component{
  constructor(props){
    super(props);
    this.setGrid = this.setGrid.bind(this);
    this.change = this.change.bind(this);
  }

  setGrid(isEnable){
    this.props.toggle(isEnable);
  }

  change(event){
    let value = parseFloat(event.target.value);

    if(value.isPositiveNum())
      this.props.change(value);
  }

  render(){

    return React.createElement(
              "div", null,
              React.createElement(Switch, { name: "Sticky grid enable", click:this.setGrid, def:this.props.def}),

              React.createElement(
                "div",
                { "className": "section" },
                React.createElement(
                  "div",
                  { "className": "row" },
                  React.createElement(
                    "p",
                    null,
                    "Grid size"
                  ),
                  React.createElement("input", {
                    "className": "htmlForm-control htmlForm-control-sm stickyRulerSize",
                    type: "text",
                    placeholder: "Grid size",
                    onChange: this.change,
                    value: this.props.size
                  })
                )
              )
            );
  }
}

module.exports = ToolGrid;
