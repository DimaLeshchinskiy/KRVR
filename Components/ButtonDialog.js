var React = require("react");

var ButtonLG = require("../Components/ButtonLG.js");
var Modal = require("../Components/Modal.js");
const serial = require('../app/serial');

class ButtonDialog extends React.Component{

  constructor(props){
    super(props);

    this.onClick = this.onClick.bind(this);

  }

  onClick(){
    $(".modal").modal('show');
  }

  render(){
    return React.createElement("div", null,
              React.createElement(ButtonLG, { color: this.props.color, name: this.props.title, click: this.onClick }),
              React.createElement(Modal, {title: this.props.title}, this.props.children)
          );
  }
}

module.exports = ButtonDialog;
