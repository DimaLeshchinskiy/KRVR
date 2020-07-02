var React = require("react");

class Switch extends React.Component{
  constructor(props){
    super(props);

    this.state = {isOn:this.props.def};

    this.toggle = this.toggle.bind(this);
  }

  toggle(){
    let newState = !this.state.isOn;

    this.props.click(newState);

    this.setState({isOn:newState});
  }

  render(){
    return React.createElement(
              "div",
              { "className": "section" },
              React.createElement(
                "div",
                { "className": "row" },
                React.createElement(
                  "p",
                  null,
                  this.props.name
                ),
                React.createElement(
                  "div",
                  { "className": "custom-control custom-switch switch", onClick:this.toggle },
                  React.createElement("input", { type: "checkbox", "className": "custom-control-input", readOnly:true, checked: this.state.isOn }),
                  React.createElement("label", { "className": "custom-control-label"})
                )
              )
            );
  }
}

module.exports = Switch;
