const React = require("react");

var fileManager = require("../app/fileManager");
var flm = require("../app/fileLoadModule");
var d2c = require("../app/DXF2CANVAS");
var config = require("../app/config");

var TwoDimensions = require("../Components/TwoDimensions.js");
var ThreeDimensions = require("../Components/ThreeDimensions.js");

var ToolsList = require("../Components/ToolsList.js");
var Tool = require("../Components/Tool.js");
var Grid = require("../Components/Grid.js");

class Workspace extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      dimension:"2d"
    };

    this.drop = this.drop.bind(this);

    this.onDimensionChange = this.onDimensionChange.bind(this);

    this.workspaceRef = React.createRef();
  }

  componentDidMount() {
    let workspace = this.workspaceRef.current;
    let body = document.body,
        html = document.documentElement;

    let height = Math.max( body.scrollHeight, body.offsetHeight,
                           html.clientHeight, html.scrollHeight, html.offsetHeight );
    workspace.style.height = (height - 50) + "px";
  }

  getDimension(){
    if(this.state.dimension == "2d")
      return React.createElement(TwoDimensions);
    else
      return React.createElement(ThreeDimensions);
  }

  onDimensionChange(evt){
    let dimension = evt.target.getAttribute("data");
    if(dimension)
      this.setState({dimension:dimension});
  }

  render(){
    let classNames = ["main"];

    let dimension = this.getDimension();

    if(this.props.isLeftOpen){
      classNames.push("openLeft");
    }

    if(this.props.isRightOpen){
      classNames.push("openRight");
    }

    return React.createElement(
              "div",
              { "className": classNames.join(" "), onDragOver: this.dragOver, onDragEnter: this.dragEnter, onDrop: this.drop },
              React.createElement(
                "div",
                { "className": "tools" },
                React.createElement(Tool,{ name: "Open Sidebar", src: "../assets/img/menu.svg", click: this.props.toggleLeft}),
                React.createElement(
                  "div",
                  { "className": "btn-group btn-group-toggle dimensionSelect", "data-toggle": "buttons" },
                  React.createElement(
                    "label",
                    { "className": "btn btn-sm btn-outline-primary active", data:"2d", onClick: this.onDimensionChange},
                    React.createElement("input", { type: "radio", name: "options", id: "option1", autoComplete: "off", defaultChecked: true }),
                    "2D"
                  ),
                  React.createElement(
                    "label",
                    { "className": "btn btn-sm btn-outline-primary", data:"3d", onClick: this.onDimensionChange},
                    React.createElement("input", { type: "radio", name: "options", id: "option2", autoComplete: "off" }),
                    "3D"
                  )
                ),
                React.createElement(Tool,{ name: "Open Sidebar", src: "../assets/img/menu.svg", click: this.props.toggleRight}),
              ),
              React.createElement(ToolsList, {dimension: this.state.dimension}),
              React.createElement(
                "div",
                { "className": "workspace", ref:this.workspaceRef },
                dimension
              )
            );
  }

  dragOver(e){
    e.preventDefault();
    e.stopPropagation();
  }

  dragEnter(e){
    e.preventDefault();
    e.stopPropagation();
  }

  drop(e){
    if (e.dataTransfer && e.dataTransfer.files.length) {
      e.preventDefault();
      e.stopPropagation();

      let filesDropped = e.dataTransfer.files;
      for (let i = 0; i < filesDropped.length; i++) {
        if (flm.setPath(filesDropped[i].path)) {
          let file = flm.getFile();

          fileManager.push(file);
        }
      }

      fileManager.select(fileManager.getAll()[0]);

      console.log(fileManager.getAll());
      this.forceUpdate();
    }
  }

}

module.exports = Workspace;
