const React = require("react");

var fileManager = require("../app/fileManager");
var dxf2c = require("../app/DXF2CANVAS");
var png2c = require("../app/PNG2CANVAS");
var config = require("../app/config");
var _state = require("../app/state");

var Grid = require("../Components/Grid.js");

class TwoDimensions extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      stickyGrid: config.getByKey("stickyRuler"),
      stickyGridSize: config.getByKey("stickyRulerSize")
    };

    this.onSelect = this.onSelect.bind(this);

    this.dragEnd = this.dragEnd.bind(this);

    this.renderLaser = this.renderLaser.bind(this);

    this.spaceRef = React.createRef();
    this.laserRef = React.createRef();
  }

  componentDidMount() {
    this._isMounted = true;
    this.setState({
      stickyGrid: config.getByKey("stickyRuler"),
      stickyGridSize: config.getByKey("stickyRulerSize")
    });

    this.resize(this.spaceRef.current);

    fileManager.listener.on("update", this.onSelect);
    _state.listener.on("change", this.renderLaser);
    config.listener.on("configUpdate", (new_config)=>{
      if(!this._isMounted) return;

      let bool = new_config.get("stickyRuler");
      let num = new_config.get("stickyRulerSize");
      this.setState({stickyGrid: bool, stickyGridSize: num});
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate() {
    this.resize(this.spaceRef.current);

    let space = this.spaceRef.current;

    while (space.childNodes.length > 2) {
        space.removeChild(space.lastChild);
    }

    let files = fileManager.getAll();
    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      let cnv = {};
      if(file.extension == "dxf")
        cnv = dxf2c.getCanvas(file);
      else if(file.extension == "png")
        cnv = png2c.getCanvas(file);

      cnv.draggable = true;
      cnv.style.transform = `rotate(${file.angle}deg)`;

      let left = (file.offsetX - file.centerX * file.scale) * config.getByKey("ScreenS");
      let top = (config.getDevY() - (file.offsetY + file.centerY * file.scale)) * config.getByKey("ScreenS");

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

  onSelect(){
    this.forceUpdate();
  }

  render(){
    return React.createElement(
            "div",
            { "className": "space", ref:this.spaceRef },
            React.createElement(Grid, { render: this.state.stickyGrid, size:this.state.stickyGridSize }),
            React.createElement("div", { "className": "laser", ref:this.laserRef })
          );
  }

  resize(dom){
    let scale = config.getByKey("ScreenS");
    let height = config.getDevY();
    let width = config.getDevX();

    dom.style.minHeight = (height * scale) + "px";
    dom.style.minWidth = (width * scale) + "px";
  }

  //laser visualisation
  renderLaser(pos3D){
    if(!this._isMounted) return;

    let laser = this.laserRef.current;
    let scale = config.getByKey("ScreenS");
    let height = config.getDevY();

    let x = pos3D[0] * scale - (laser.offsetWidth / 2);
    let y = (height - pos3D[1]) * scale - (laser.offsetWidth / 2);
    let z = pos3D[2];

    laser.style.left = x + "px";
    laser.style.top = y + "px";

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
      file.offsetY = config.getDevY() - itemY / config.getByKey("ScreenS");

      itemY = itemY - height;
      itemX = itemX - width;

      item.style.top = itemY + "px";
      item.style.left = itemX + "px";

      console.log(file);

      fileManager.select(file);
    }
}

module.exports = TwoDimensions;
