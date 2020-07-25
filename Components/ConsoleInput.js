var React = require("react");

const serial = require('../app/singleton/serial');

class ConsoleInput extends React.Component{
  constructor(props){
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.send = this.send.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  send() {
    serial.send(this.state.value);
  }

  render(){
    return React.createElement(
              "div",
              { "className": "input-group" },
              React.createElement("input", { type: "text", "className": "form-control form-control-sm", placeholder: "Gcode", onChange: this.handleChange}),
              React.createElement(
                "div",
                { "className": "input-group-append", id: "button-addon4" },
                React.createElement(
                  "button",
                  { "className": "btn btn-outline-secondary btn-sm", type: "button", onClick: this.send},
                  "Send"
                ),
                React.createElement(
                  "button",
                  { "className": "btn btn-outline-secondary btn-sm", type: "button", onClick: this.props.clear},
                  "Clear"
                )
              )
            );
  }
}

module.exports = ConsoleInput;
