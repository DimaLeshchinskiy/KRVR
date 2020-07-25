var React = require("react");

const config = require('../app/singleton/config');

class SliderFile extends React.Component{
  constructor(props){
    super(props);

    let value = this.props.value || 0;

    this.slide = this.slide.bind(this);
    this.input = this.input.bind(this);
    this.change = this.change.bind(this);
  }

  slide(event){
    this.change(event.target.value);
  }

  input(event){
    let value = event.target.value.replace(/[^\d.]/g, '');
    if(value)
      value = parseFloat(value);
    else
      value = 0;
    this.change(value);
  }

  change(num){
    this.props.change(num);
  }


  render(){
    let value = this.props.value;
    let displayVal = this.props.template.replace("{val}", value);

    return React.createElement(
              "div",
              null,
              React.createElement("p", null, this.props.head + ":"),
              React.createElement(
                "div",
                { "className": "section" },
                React.createElement(
                  "div",
                  { "className": "row counter" },
                  React.createElement(
                    "input", { type: "text", value: displayVal, onChange: this.input,}
                  ),
                  React.createElement("input", { type: "range", "className": "custom-range", onChange: this.slide, min: this.props.min, max: this.props.max, step: this.props.step, value: value })
                )
              )
            );
  }
}

module.exports = SliderFile;
