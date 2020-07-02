var React = require("react");

class Example extends React.Component{
  render(){
    return React.createElement("div",{ "className": "App" },
              React.createElement("h1",null," Hello, World! ")
            );
  }
}

module.exports = Example;
