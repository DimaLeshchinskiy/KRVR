var React = require("react");

class ButtonLG extends React.Component{
  render(){
    let classNames = ["but btn btn-sm btn-block"];

    if(this.props.color == "blue"){
      classNames.push("btn-primary");
    }else if(this.props.color == "red"){
      classNames.push("btn-danger");
    }
    else{
      classNames.push("btn-secondary");
    }

    return React.createElement(
              "div",
              { "className": "section" },
              React.createElement(
                "div",
                { "className": classNames.join(" "), onClick: this.props.click },
                this.props.name
              )
            );
  }
}

module.exports = ButtonLG;
