var React = require("react");

const drillService = require('../app/service/drillService');

class DrillLine extends React.Component{
  constructor(props){
    super(props);

    this.drill = drillService.getById(props.drillId);
    this.drillId = props.drillId;

    this.state = {inSet: this.drill.isInSet};

    this.remove = this.remove.bind(this);
    this.set = this.set.bind(this);
  }

  remove(event){
    drillService.remove(this.drillId);
    this.props.onUpdate();
  }

  set(event){
    let newVal = event.target.checked;

    this.drill.inSet(newVal);
    this.setState({inSet: newVal});
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
                  React.createElement("input", {
                    type: "checkbox",
                    "className": "form-check-input",
                    checked: this.state.inSet,
                    onChange: this.set
                  })
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
                React.createElement("img", { src: "../assets/img/close.svg", onClick: this.remove})
              )
            );
  }
}

module.exports = DrillLine;
