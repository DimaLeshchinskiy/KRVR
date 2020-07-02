var React = require("react");

class ButtonToogle extends React.Component{
  render(){
    let classNames = ["but btn"];

    if(this.props.color == "blue"){
      classNames.push("btn-primary");
    }else{
      classNames.push("btn-secondary");
    }

    return React.createElement(
              "div",
              { "className": classNames.join(" "), onClick: this.props.click  },
              this.props.name
            );
  }
}

module.exports = ButtonToogle;
