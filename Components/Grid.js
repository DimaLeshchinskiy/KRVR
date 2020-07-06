var React = require("react");

var config = require("../app/config");

class Grid extends React.Component{

  constructor(props) {
    super(props);
    this.clearGrid = this.clearGrid.bind(this);
    this.renderGrid = this.renderGrid.bind(this);

    this.gridRef = React.createRef();
  }

  componentDidUpdate() {
    let cnv = this.gridRef.current;

    if(!this.props.render){
      this.clearGrid(cnv);
    }else{
      this.renderGrid(cnv);
    }
  }

  render(){
    return React.createElement("canvas", { id: "grid", ref:this.gridRef });
  }

  renderGrid(canvas){
    let size = this.props.size;
    let scale = config.getByKey("ScreenS");
    let height = config.getDevY();
    let width = config.getDevX();

    let ctx = canvas.getContext("2d");

    canvas.width = width * scale;
    canvas.height = height * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#80e5ff";

    //horizontal
    for(let i = size * scale; i < height * scale; i+= size * scale){
      ctx.moveTo(0, i);
      ctx.lineTo(width * scale, i);
    }

    //vertical
    for(let i = size * scale; i < width * scale; i+= size * scale){
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height * scale);
    }

    ctx.stroke();
  }

  clearGrid(canvas){
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

}

module.exports = Grid;
