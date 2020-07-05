const React = require("react");

var fileManager = require("../app/fileManager");
var flm = require("../app/fileLoadModule");
var d2c = require("../app/DXF2CANVAS");
var config = require("../app/config");
var serial = require("../app/serial");

var Tool = require("../Components/Tool.js");
var ToolGrid = require("../Components/ToolGrid.js");
var ToolRotate = require("../Components/ToolRotate.js");
var ToolScale = require("../Components/ToolScale.js");
var Grid = require("../Components/Grid.js");
var Slider = require("../Components/Slider.js");

class Workspace extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      stickyGrid: false,
      stickyGridSize: 10
    };

    this.drop = this.drop.bind(this);
    this.dragEnd = this.dragEnd.bind(this);

    this.gridToggle = this.gridToggle.bind(this);
    this.gridSizeChange = this.gridSizeChange.bind(this);

    this.onZoom = this.onZoom.bind(this);
    this.onScale = this.onScale.bind(this);
    this.onRotate = this.onRotate.bind(this);

    this.onSelect = this.onSelect.bind(this);

    this.renderLaser = this.renderLaser.bind(this);

    this.spaceRef = React.createRef();
    this.workspaceRef = React.createRef();
    this.laserRef = React.createRef();

    fileManager.listener.on("update", this.onSelect);
    serial.listener.on("position", this.renderLaser);
  }

  componentDidMount() {
    this.resize(this.spaceRef.current);

    let workspace = this.workspaceRef.current;
    let body = document.body,
        html = document.documentElement;

    let height = Math.max( body.scrollHeight, body.offsetHeight,
                           html.clientHeight, html.scrollHeight, html.offsetHeight );
    workspace.style.height = (height - 50) + "px";

    setInterval(
      function(){
        console.log("test");
        serial.sendAsync("?");
      }, 3000);
  }

  componentDidUpdate() {
    this.resize(this.spaceRef.current);

    let space = this.spaceRef.current;

    while (space.childNodes.length > 1) {
        space.removeChild(space.lastChild);
    }

    let files = fileManager.getAll();
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let cnv = d2c.getCanvas(file);
      cnv.draggable = true;
      cnv.style.transform = `rotate(${file.angle}deg)`;

      let left = (file.offsetX - file.centerX * file.scale) * config.getByKey("ScreenS");
      let top = (config.getByKey("ScreenH") - (file.offsetY + file.centerY * file.scale)) * config.getByKey("ScreenS");

      if(file.equals(fileManager.getSelected())){
        cnv.classList.add("selected");
        left--;
        top--;
      }

      cnv.style.left = left + "px";
      cnv.style.top = top + "px";

      cnv.addEventListener("dragover", function(event){
        event.preventDefault();
      });

      cnv.addEventListener("dragend", this.dragEnd);

      cnv.addEventListener("click", (event) =>{
        let cnv = event.target;
        let id = cnv.getAttribute("dataId");
        let file = fileManager.getById(id);

        fileManager.select(file);
      });

      space.appendChild(cnv);
    }
  }

  gridToggle(isEnable){
    this.setState({stickyGrid: isEnable});
  }

  gridSizeChange(size){
    this.setState({stickyGridSize: size});
  }

  onZoom(){
    this.forceUpdate();
  }

  onScale(){
    this.forceUpdate();
  }

  onRotate(){
    this.forceUpdate();
  }

  onSelect(){
    this.forceUpdate();
  }

  render(){
    let classNames = ["main"];

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
                  { "className": "toolsSection" },
                  React.createElement(Tool,
                    {src: "../assets/img/grid.svg"},
                    React.createElement(ToolGrid, {change: this.gridSizeChange, toggle: this.gridToggle, def: this.state.stickyGrid, size: this.state.stickyGridSize}),
                  ),
                  React.createElement(Tool,
                    {src: "../assets/img/zoom.svg"},
                    React.createElement(Slider, {head: "Zoom", template: "{val}", min: 1, max: 2.5, step:0.5, multiply:4.5, configName:"ScreenS", change: this.onZoom})
                  ),
                  React.createElement(Tool,
                    {src: "../assets/img/scale.svg"},
                    React.createElement(ToolScale, {onScale: this.onScale})
                  ),
                  React.createElement(Tool,
                    {src: "../assets/img/rotate.svg"},
                    React.createElement(ToolRotate, {onRotate: this.onRotate})
                  )
                ),
                React.createElement(Tool,{ name: "Open Sidebar", src: "../assets/img/menu.svg", click: this.props.toggleRight}),
              ),
              React.createElement(
                "div",
                { "className": "workspace", ref:this.workspaceRef },
                React.createElement(
                  "div",
                  { "className": "space", ref:this.spaceRef },
                  React.createElement("div", { "className": "laser", ref:this.laserRef }),
                  React.createElement(Grid, { render: this.state.stickyGrid, size:this.state.stickyGridSize })
                )
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

  dragEnd(event){
    let itemX = 0;
    let itemY = 0;
    let item = event.target;

    let dom = document.getElementsByClassName("space")[0];
    let left = dom.offsetLeft - dom.parentNode.scrollLeft;
    let top = dom.offsetTop - dom.parentNode.scrollTop;

    if(this.state.stickyGrid && this.state.stickyGridSize.isPositiveNum()){
      let size = this.state.stickyGridSize;
      let scale = config.getByKey("ScreenS");

      let posX = (event.pageX - left) / scale;
      let posY = (event.pageY - top) / scale;

      itemX = Math.round(posX / size) * size * scale;
      itemY = Math.round(posY / size) * size * scale;
    }else{
      itemX = event.pageX - left;
      itemY = event.pageY - top;
    }

    let id = item.getAttribute("dataId");
    let file = fileManager.getById(id);

    let width = file.centerX * file.scale * config.getByKey("ScreenS");
    let height = file.centerY * file.scale * config.getByKey("ScreenS");

    file.offsetX = itemX / config.getByKey("ScreenS");
    file.offsetY = config.getByKey("ScreenH") - itemY / config.getByKey("ScreenS");

    itemY = itemY - height;
    itemX = itemX - width;

    item.style.top = itemY + "px";
    item.style.left = itemX + "px";

    console.log(file);

    fileManager.select(file);
  }
  resize(dom){
    let scale = config.getByKey("ScreenS");
    let height = config.getByKey("ScreenH");
    let width = config.getByKey("ScreenW");

    dom.style.minHeight = (height * scale) + "px";
    dom.style.minWidth = (width * scale) + "px";
  }

  //laser visualisation
  renderLaser(str){
    console.log(str);
    //str = <Idle|MPos:10.000,10.000,0.000|FS:0,0|Pn:XYZ>
    let pos3D = str.split("|")[1];
    //pos3D = MPos:10.000,10.000,0.000
    pos3D = pos3D.split(":")[1];
    //pos3D = 10.000,10.000,0.000
    pos3D = pos3D.split(",");

    let laser = this.laserRef.current;
    let scale = config.getByKey("ScreenS");
    let height = config.getByKey("ScreenH");

    for (var i = 0; i < pos3D.length; i++) {
      pos3D[i] = parseFloat(pos3D[i]) / scale;
    }

    let x = pos3D[0] * scale - (laser.offsetWidth / 2);
    let y = (height - pos3D[1]) * scale - (laser.offsetWidth / 2);
    let z = pos3D[2];

    laser.style.left = x + "px";
    laser.style.top = y + "px";

  }
}

module.exports = Workspace;
