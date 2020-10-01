var React = require("react");

const drillService = require('../app/service/drillService');
var DrillLine = require("../Components/DrillLine.js");

class ModalDrill extends React.Component{

  constructor(props){
    super(props);

    this.add = this.add.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.getDrills = this.getDrills.bind(this);
  }

  add(event) {
    let inputGroup = event.target.parentElement.parentElement;

    let radius = inputGroup.children[0].value;
    let size = inputGroup.children[1].value;

    if(size && radius)
    {
      drillService.addNew(radius, size);
      this.forceUpdate();
    }
  }

  onUpdate(){
    this.forceUpdate();
  }

  getDrills(){
    let drills = drillService.getAll();
    let reactArr = [];


    for (var i = 0; i < drills.length; i++) {
      reactArr.push(
        React.createElement(
          DrillLine,
          {key: drills[i].id, drillId: drills[i].id, onUpdate: this.onUpdate}
        ));
    }

    return reactArr;
  }

  getHeader(){

    let list = ["In set", "Radius", "Size"];

    let header = [];
    for(let i = 0; i < list.length; i++)
      header.push(
        React.createElement(
          "th",
          {key: i},
          list[i]
        )
      );

    return header;

  }

  render(){
    let header = this.getHeader();
    let drills = this.getDrills();

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
                      { "className": "input-group input-group-sm mb-3" },
                      React.createElement("input", { type: "text", "className": "form-control", placeholder: "Radius", "aria-describedby": "basic-addon2" }),
                      React.createElement("input", { type: "text", "className": "form-control", placeholder: "Length", "aria-describedby": "basic-addon2" }),
                      React.createElement(
                        "div",
                        { "className": "input-group-append", onClick:this.add},
                        React.createElement(
                          "button",
                          { "className": "btn btn-outline-primary", type: "button"},
                          "Add"
                        )
                      )
                    ),

                    React.createElement(
                      "div",
                      { "className": "tablewrapper"},
                      React.createElement(
                        "table",
                        null,
                        React.createElement("thead", null,
                          React.createElement("tr", null, header)
                        ),
                        React.createElement("tbody", null, drills)
                      )
                    )





                  ),
                  React.createElement(
                    "div",
                    { "className": "modal-footer" },
                    React.createElement(
                      "button",
                      { type: "button", "className": "btn btn-secondary", "data-dismiss": "modal" },
                      "Close"
                    )
                  )
                )
              )
            );
  }
}

module.exports = ModalDrill;
