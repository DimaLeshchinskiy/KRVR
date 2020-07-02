var React = require("react");

class FileCanvas extends React.Component{
  constructor(props){
    super(props);

    this.state = {
                  file: this.props.file,
                  canvas: this.props.canvas
                 };

  }

  render(){
    return React.createElement(this.state.canvas, null);
  }
}

module.exports = FileCanvas;
