var React = require("react");

var Tool = require("../Components/Tool.js");

var toolManager = require("../app/toolManager");

class ToolsList extends React.Component{
  constructor(props){
    super(props);

    this.state = {toolId:null, toogle:true};

    this.get2D = this.get2D.bind(this);
    this.get3D = this.get3D.bind(this);
    this.getClose = this.getClose.bind(this);

    this.toogle = this.toogle.bind(this);

    this.onRotateClick = this.onRotateClick.bind(this);
    this.onZoomClick = this.onZoomClick.bind(this);
    this.onScaleClick = this.onScaleClick.bind(this);
    this.onGridClick = this.onGridClick.bind(this);
  }

  toogle(){
    this.setState({toogle: !this.state.toogle});
    //toogle = true = open
  }

  getClose(){
    return React.createElement(
              "div",
              { "className": "toolsSection closeSection" },
              React.createElement("div", { "className": "toolsSectionToogle", onClick:this.toogle},
                React.createElement("img", {src: "../assets/img/arr-right.png"})
              )
            );
  }

  get2D(){
    return React.createElement(
              "div",
              { "className": "toolsSection" },
              React.createElement("div", null,
                React.createElement(Tool, {src: "../assets/img/grid.svg", click: this.onGridClick}),
                React.createElement(Tool, {src: "../assets/img/zoom.svg", click: this.onZoomClick}),
                React.createElement(Tool, {src: "../assets/img/scale.svg", click: this.onScaleClick}),
                React.createElement(Tool, {src: "../assets/img/rotate.svg", click: this.onRotateClick})
              ),
              React.createElement("div", { "className": "toolsSectionToogle", onClick:this.toogle},
                React.createElement("img", {src: "../assets/img/arr-left.png"})
              )
            );
  }

  get3D(){
    return React.createElement(
              "div",
              { "className": "toolsSection" },
              React.createElement("div", null,
              React.createElement(Tool, {src: "../assets/img/grid.svg", click: this.onGridClick}),
              React.createElement(Tool, {src: "../assets/img/zoom.svg", click: this.onZoomClick}),
              React.createElement(Tool, {src: "../assets/img/scale.svg", click: this.onScaleClick}),
              React.createElement(Tool, {src: "../assets/img/rotate.svg", click: this.onRotateClick})
              ),
              React.createElement("div", { "className": "toolsSectionToogle", onClick:this.toogle},
                React.createElement("img", {src: "../assets/img/arr-left.png"})
              )
            );
  }

  render(){

    if(!this.state.toogle)
      return this.getClose();
    if(this.props.dimension == "3d")
      return this.get3D();
    else
      return this.get2D();
  }

  onZoomClick(){
    toolManager.select("zoom");
  }

  onScaleClick(){
    toolManager.select("scale");
  }

  onRotateClick(){
    toolManager.select("rotate");
  }

  onGridClick(){
    toolManager.select("grid");
  }
}

module.exports = ToolsList;
