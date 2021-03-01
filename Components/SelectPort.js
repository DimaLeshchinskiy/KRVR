var React = require("react");

var ButtonLG = require("../Components/ButtonLG.js");
const serial = require('../app/singleton/serial');

class SelectPort extends React.Component{

  constructor(props){
    super(props);

    this.state = {options:[], setIndex: 0};

    this.scan = this.scan.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.renderConnectBtn = this.renderConnectBtn.bind(this);
    this.setConnection = this.setConnection.bind(this);
    this.closeConnection = this.closeConnection.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.scan();
  }

  scan(){
    serial.getPorts().then(ports => {

      let paths = [];
      for(let i = 0; i < ports.length; i++)
        paths.push(ports[i].path);


      if(ports.length == 1){
        this.setState({setIndex: "" + 1, options:paths});
        this.setConnection();
      }else{
        this.setState({options:paths});
      }

    });
  }

  handleChange(event) {
    if(event.target.value != 0 && event.target.value != this.state.setIndex){
      this.setState({setIndex: event.target.value});
      this.setConnection();
    }
    else if(event.target.value == 0)
      this.closeConnection();
  }

  setConnection(){
    let port = this.state.options[parseInt(this.state.setIndex)-1];
    serial.close().then(() => {
      serial.getConnection(port)
    });
  }

  closeConnection(){
    serial.close();
  }

  renderOptions(){
    let options = [];
    let ports = this.state.options;

    let option = React.createElement(
                    "option",
                    { key: 0, value: "0" },
                    "Port is not selected"
                  );

    options.push(option);

    for(let i = 0; i < ports.length; i++){

      option = React.createElement(
                  "option",
                  { key: i + 1, value: "" + (i + 1)},
                  ports[i]
                );

      options.push(option);
    }

    return options;
  }

  renderConnectBtn(){
    if(serial.isOpen())
      return React.createElement( ButtonLG, { color: "blue", name: "Disconnect", click: this.closeConnection });
    else
      return React.createElement( ButtonLG, { color: "blue", name: "Connect", click: this.setConnection });
  }

  render(){
    let options = this.renderOptions();

    return React.createElement("div", null,
              React.createElement(
                "select",
                { "className": "form-control", value:this.state.setIndex, onChange:this.handleChange},
                options
              ),
              this.renderConnectBtn(),
              React.createElement( ButtonLG, { color: "blue", name: "Refresh", click: this.scan })
            );
  }
}

module.exports = SelectPort;
