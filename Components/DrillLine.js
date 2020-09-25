var React = require("react");

const drillService = require('../app/service/drillService');

class DrillLine extends React.Component{
  constructor(props){
    super(props);

    this.drill = drillService.getById(props.drillId);
    this.drillId = props.drillId;
  }

  render(){
    return React.createElement(
              "tr",
              null,
              React.createElement(
                "td",
                null,
                React.createElement(
                  "div",
                  { "class": "form-check form-check-inline" },
                  React.createElement("input", { type: "checkbox", "className": "form-check-input", id: "exampleCheck1" })
                )
              ),
              React.createElement(
                "td",
                null,
                React.createElement(
                  "p",
                  null,
                  this.drill.radius + " mm"
                )
              ),
              React.createElement(
                "td",
                null,
                React.createElement(
                  "p",
                  null,
                  this.drill.size + " mm"
                )
              ),
              React.createElement(
                "td",
                null,
                React.createElement("img", { src: "../assets/img/close.svg" })
              )
            );
  }
}

module.exports = DrillLine;
