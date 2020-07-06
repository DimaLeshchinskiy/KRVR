var React = require("react");

var SelectPort = require("../Components/SelectPort.js");
var Switch = require("../Components/Switch.js");
var ButtonDialog = require("../Components/ButtonDialog.js");

const config = require('../app/config');

class Settings extends React.Component{
  constructor(props){
    super(props);
    this.setDarkmode = this.setDarkmode.bind(this);
  }

  componentDidMount() {
    this.setDarkmode(config.getByKey("darkmode"));
  }

  setDarkmode(isDark){
    config.put("darkmode", isDark);

    if(isDark){
      document.documentElement.style.setProperty('--bg', '#484848');
      document.documentElement.style.setProperty('--bgSide', '#212121');
      document.documentElement.style.setProperty('--bgHead', '#424141');
      document.documentElement.style.setProperty('--bgContent', '#212121');
      document.documentElement.style.setProperty('--txt', '#d4cdcd');
    }else{
      document.documentElement.style.setProperty('--bg', '#ececec');
      document.documentElement.style.setProperty('--bgSide', '#FFFFFF');
      document.documentElement.style.setProperty('--bgHead', '#e5e5e5');
      document.documentElement.style.setProperty('--bgContent', '#FFFFFF');
      document.documentElement.style.setProperty('--txt', '#000000');
    }
  }

  render(){
    return React.createElement(
              "div",
              { "className": "content" },

              React.createElement(Switch,
                { name: "Darkmode enable", click:this.setDarkmode, def:config.getByKey("darkmode") }
              ),

              React.createElement(SelectPort),
              React.createElement(ButtonDialog, { color: "blue", title: "Change device model"})
            );
  }
}

module.exports = Settings;
