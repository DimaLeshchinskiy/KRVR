var React = require("react");

class Tab extends React.Component{
  constructor(props){
    super(props);

    this.state = {open:true};

    this.click = this.click.bind(this);
  }

  click(e){
    this.setState({open: !this.state.open});
  }

  render(){
    let classNames = ["tab"];

    if(this.state.open){
      classNames.push("open");
    }

    return React.createElement(
              "div",
              { "className": classNames.join(" ")},
              React.createElement(
                "div",
                { "className": "head", onClick: this.click },
                React.createElement("div", { "className": "icon" }),
                React.createElement(
                  "div",
                  null,
                  this.props.name
                )
              ),
              React.createElement(this.props.children, null)
            );
  }
}

module.exports = Tab;
