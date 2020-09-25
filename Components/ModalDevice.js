var React = require("react");

const deviceService = require('../app/service/deviceService');
const config = require('../app/singleton/config');

class ModalDevice extends React.Component{

  constructor(props){
    super(props);

    let device = config.getByKey("device");

    this.state = {
      id: device.id,
      maxX: device.maxX,
      maxY: device.maxY,
      maxZ: device.maxZ
    };

    this.save = this.save.bind(this);
    this.input = this.input.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getDevices = this.getDevices.bind(this);
  }

  save(event) {
    let id = this.state.id;
    let device = deviceService.getById(id);

    device.maxX = this.state.maxX;
    device.maxY = this.state.maxY;
    device.maxZ = this.state.maxZ;

    config.set("device", device);
  }

  input(event) {
    if(deviceService.isOriginal(this.state.id))
      return;

    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  onChange(event){
    let id = event.target.selectedIndex;
    let device = deviceService.getById(id);

    this.setState({
      id: device.id,
      maxX: device.maxX,
      maxY: device.maxY,
      maxZ: device.maxZ
    });
  }

  getDevices(){
    let devices = deviceService.getAll();
    let reactArr = [];

    for (var i = 0; i < devices.length; i++) {

      reactArr.push(
        React.createElement(
          "option",
          {key: devices[i].id, value: devices[i].id},
          devices[i].name
        ));
    }

    return reactArr;
  }

  render(){
    let devices = this.getDevices();

    return React.createElement(
              "div",
              { "className": "modal fade modal_" + this.props.selector, "data-backdrop": false, id: "exampleModalCenter", tabIndex: "-1", role: "dialog", "aria-labelledby": "exampleModalCenterTitle", "aria-hidden": "true" },
              React.createElement(
                "div",
                { "className": "modal-dialog modal-dialog-centered", role: "document" },
                React.createElement(
                  "div",
                  { "className": "modal-content" },
                  React.createElement(
                    "div",
                    { "className": "modal-header" },
                    React.createElement(
                      "h5",
                      { "className": "modal-title", id: "exampleModalLongTitle" },
                      this.props.title
                    ),
                    React.createElement(
                      "button",
                      { type: "button", "className": "close", "data-dismiss": "modal", "aria-label": "Close" },
                      React.createElement(
                        "span",
                        { "aria-hidden": "true" },
                        "×"
                      )
                    )
                  ),
                  React.createElement(
                    "div",
                    { "className": "modal-body" },
                    React.createElement(
                      "div",
                      { "className": "form-group" },
                      React.createElement(
                        "label",
                        { "htmlFor": "exampleFormControlSelect1" },
                        "Choose preset:"
                      ),
                      React.createElement(
                        "select",
                        { "className": "form-control", value:this.state.id , onChange: this.onChange },
                        devices
                      )
                    ),
                    React.createElement(
                      "div",
                      { "className": "Size" },
                      React.createElement(
                        "label",
                        null,
                        "X"
                      ),
                      React.createElement("input", { type: "text", "className":"form-control", value:this.state.maxX, onChange: this.input, name:"maxX" }),
                      React.createElement(
                        "label",
                        null,
                        "Y"
                      ),
                      React.createElement("input", { type: "text", "className":"form-control", value:this.state.maxY, onChange: this.input, name:"maxY" }),
                      React.createElement(
                        "label",
                        null,
                        "Z"
                      ),
                      React.createElement("input", { type: "text","className":"form-control", value:this.state.maxZ, onChange: this.input, name:"maxZ" })
                    )
                  ),
                  React.createElement(
                    "div",
                    { "className": "modal-footer" },
                    React.createElement(
                      "button",
                      { type: "button", "className": "btn btn-secondary", "data-dismiss": "modal" },
                      "Close"
                    ),
                    React.createElement(
                      "button",
                      { type: "button", "className": "btn btn-primary", "data-dismiss": "modal", onClick: this.save },
                      "Save changes"
                    )
                  )
                )
              )
            );
  }
}

module.exports = ModalDevice;
