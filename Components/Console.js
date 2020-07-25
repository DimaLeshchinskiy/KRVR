var React = require("react");

const serial = require('../app/singleton/serial');

var Filter = require("../Components/Filter.js");
var ConsoleOutput = require("../Components/ConsoleOutput.js");
var ConsoleInput = require("../Components/ConsoleInput.js");

class Console extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      filter: "all",
      logs: []
    };

    this.changeFilter = this.changeFilter.bind(this);
    this.clear = this.clear.bind(this);
    this.log = this.log.bind(this);

    serial.listener.on("log", (msg, type) => this.log(msg, type));
  }

  log(msg, type){
    if(!Array.isArray(msg))
      msg = msg.trim();
    if(!msg) return;

    let logs = this.state.logs;
    logs.push({msg: msg, type: type});

    this.setState({logs: logs});
  }

  changeFilter(newFilter){
    this.setState({filter: newFilter});
  }

  clear(){
    this.setState({logs: []});
  }

  render(){
    return React.createElement(
              "div",
              { "className": "content" },
              React.createElement(
                ConsoleOutput, { logs: this.state.logs, filter: this.state.filter }
              ),
              React.createElement(
                "div",
                { "className": "section" },
                React.createElement(
                  ConsoleInput, { clear: this.clear})
              ),
              React.createElement(
                "div",
                { "className": "section" },
                React.createElement(Filter,{ setFilter: this.changeFilter, filter: this.state.filter})
              )
            );
  }
}

module.exports = Console;
