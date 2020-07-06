var React = require("react");
var Slider = require("../Components/Slider.js");

class ToolZoom extends React.Component{
  constructor(props){
    super(props);

    this.onZoom = this.onZoom.bind(this);
  }

  onZoom(num){
  }

  render(){
    return React.createElement(Slider,
      {
        head: "Zoom",
        template: "{val}",
        min: 1,
        max: 2.5,
        step:0.5,
        multiply:4.5,
        configName:"ScreenS",
        change: this.onZoom
      });
  }
}

module.exports = ToolZoom;
