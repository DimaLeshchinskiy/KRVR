const React = require("react");

var Tab = require("../Components/Tab.js");

var Settings = require("../Components/Settings.js");
var FileManager = require("../Components/FileManager.js");
var Controls = require("../Components/Controls.js");
var Console = require("../Components/Console.js");
var Process = require("../Components/Process.js");
var ToolsManager = require("../Components/ToolsManager.js");

const leftTabs = [{name: "Settings", item: Settings},
                  {name: "Tools", item: ToolsManager},
                  {name: "File Manager", item: FileManager},
                  {name: "Process", item: Process}];

const rightTabs = [{name: "Virtual Pendant", item: Controls},
                   {name: "Console", item: Console}];


class SideBar extends React.Component{

  constructor(props) {
    super(props);
  }

  renderTabs(type){
    let tabs = [];

    if(type == "right"){
      for (var i = 0; i < rightTabs.length; i++) {
        let name = rightTabs[i].name;
        let item = rightTabs[i].item;
        tabs.push(React.createElement(Tab, {name:name, key:i}, item));
      }
    }else{
      for (var i = 0; i < leftTabs.length; i++) {
        let name = leftTabs[i].name;
        let item = leftTabs[i].item;
        tabs.push(React.createElement(Tab, {name:name, key:i}, item));
      }
    }

    return tabs;
  }

  render(){
    let classNames = ["sidebar"];

    if(this.props.isOpen){
      classNames.push("sidebarOpen");
    }

    if(this.props.type == "right"){
      classNames.push("sidebarRight");
    }else{
      classNames.push("sidebarLeft");
    }

    let tabs = this.renderTabs(this.props.type);

    return React.createElement("div",{ "className": classNames.join(" ") }, tabs);
  }
}

module.exports = SideBar;
