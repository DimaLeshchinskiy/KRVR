var React = require("react");

var ButtonLG = require("../Components/ButtonLG.js");
const serial = require('../app/singleton/serial');

class ButtonDialog extends React.Component{

  constructor(props){
    super(props);

    this.onClick = this.onClick.bind(this);

  }

  onClick(){
    $(".modal_" + this.props.selector).modal('show');
  }

  render(){
    return React.createElement("div", null,
              React.createElement(ButtonLG, { color: this.props.color, name: this.props.title, click: this.onClick }),
              React.createElement(this.props.modal, {title: this.props.title, selector: this.props.selector}, this.props.children)
          );
  }
}

module.exports = ButtonDialog;
