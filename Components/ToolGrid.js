var React = require("react");
var Switch = require("../Components/Switch.js");

const config = require('../app/singleton/config');

class ToolGrid extends React.Component{
  constructor(props){
    super(props);
    this.setGrid = this.setGrid.bind(this);
    this.change = this.change.bind(this);
  }

  setGrid(isEnable){
    config.set("stickyRuler", isEnable);
    this.forceUpdate();
  }

  change(event){
    let value = parseFloat(event.target.value);

    if(value.isPositiveNum()){
      config.set("stickyRulerSize", value);
      this.forceUpdate();
    }
  }

  render(){

    return React.createElement(
              "div", null,
              React.createElement(Switch, { name: "Sticky grid enable", click:this.setGrid, def:config.getByKey("stickyRuler")}),

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
                    value: config.getByKey("stickyRulerSize")
                  })
                )
              )
            );
  }
}

module.exports = ToolGrid;
