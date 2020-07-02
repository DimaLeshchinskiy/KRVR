const React = require("react");

var SideBar = require("../Components/SideBar.js");
var Workspace = require("../Components/Workspace.js");

class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      leftisOpen: false,
      rightisOpen: false
    };

    this.toggleLeft = this.toggleLeft.bind(this);
    this.toggleRight = this.toggleRight.bind(this);
  }

  toggleLeft(e) {
    e.preventDefault();
    this.setState({leftisOpen: !this.state.leftisOpen});
  }

  toggleRight(e) {
    e.preventDefault();
    this.setState({rightisOpen: !this.state.rightisOpen});
  }

  render(){
    return React.createElement(
              "div",
              null,
              React.createElement(SideBar, {type:"left", isOpen: this.state.leftisOpen}),
              React.createElement(Workspace, {
                                                isLeftOpen: this.state.leftisOpen,
                                                isRightOpen: this.state.rightisOpen,
                                                toggleLeft: this.toggleLeft,
                                                toggleRight: this.toggleRight
                                              }),
              React.createElement(SideBar, {type:"right", isOpen: this.state.rightisOpen}),
          );
  }
}

module.exports = App;
