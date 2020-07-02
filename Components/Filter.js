var React = require("react");

const filtersObjs = [{display: "All", param: "all"},
                     {display: "Message", param: "msg"},
                     {display: "Input", param: "input"},
                     {display: "Error", param: "error"}];

class Filter extends React.Component{
  constructor(props){
    super(props);

    this.renderFilters = this.renderFilters.bind(this);
  }

  onChange(param){
    this.props.setFilter(param);
  }

  renderFilters(){
    let filters = [];

    let filterActual = this.props.filter;

    for (var i = 0; i < filtersObjs.length; i++) {
      let display = filtersObjs[i].display;
      let param = filtersObjs[i].param;
      let checked = false;
      let classNames = ["btn btn-secondary btn-sm"];

      if(param == filterActual){
        checked = true;
        classNames.push("active");
      }

      filters.push(React.createElement(
                      "label",
                      { key: i, "className": classNames.join(" "), onClick: this.onChange.bind(this, param)},
                      React.createElement("input", { type: "radio", name: "options", id: "option" + i, defaultChecked: checked }),
                      display
                    ));
    }

    return filters;

  }

  render(){

    let filters = this.renderFilters();

    return React.createElement(
              "div",
              { "className": "btn-group btn-group-toggle", "data-toggle": "buttons" },
              filters
            );
  }
}

module.exports = Filter;
