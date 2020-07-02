var React = require("react");

class ConsoleOutput extends React.Component{
  constructor(props){
    super(props);

    this.renderList = this.renderList.bind(this);
    this.consoleRef = React.createRef();
  }

  componentDidUpdate(){
    let myconsole = this.consoleRef.current;
    myconsole.parentNode.scrollTop = myconsole.parentNode.scrollHeight;
  }

  renderList(){
    let list = [];

    let filter = this.props.filter;

    for (var i = 0; i < this.props.logs.length; i++) {
      let msg = this.props.logs[i].msg;
      let type = this.props.logs[i].type;

      let classNames = ["list-group-item"];

      if(type == "error")
        classNames.push("list-group-item-danger");
      else if(type == "input")
        classNames.push("list-group-item-warning");
      else if(type == "msg")
        classNames.push("list-group-item-light");

      if(filter == "all" || filter == type)
        list.push(React.createElement("li", {key:i, "className": classNames.join(" ") }, msg));
    }

    return list;
  }

  render(){
    let list = this.renderList();

    return React.createElement(
              "div",
              { "className": "output" },
              React.createElement("ul", { "className": "list-group", ref:this.consoleRef }, list)
            );
  }
}

module.exports = ConsoleOutput;
