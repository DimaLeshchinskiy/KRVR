var React = require("react");

var fileManager = require("../app/fileManager");

class FileManager extends React.Component{
  constructor(props){
    super(props);

    this.onDelete = this.onDelete.bind(this);
    this.onFileSelect = this.onFileSelect.bind(this);
    this.onSelect = this.onSelect.bind(this); // on FileManager Selecet event
    this.getItems = this.getItems.bind(this);

    fileManager.listener.on("update", this.onSelect);
  }

  onSelect(){
    this.forceUpdate();
  }

  getItems() {
    let list = [];
    let files = fileManager.getAll();
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let classActive = "";

      if(file.equals(fileManager.getSelected()))
        classActive = "active";

      list.push(
            React.createElement("li",{"dataid": file.id, key:file.id, onClick:this.onFileSelect, "className": "list-group-item d-flex justify-content-between align-items-center " + classActive },
                file.path,
                React.createElement("button", {onClick:this.onDelete, "className":"btn btn-sm btn-danger", "type":"button"}, "Delete")
            ));
    }

    if(list.length == 0){
      list.push(
        React.createElement("li", {key: "empty", "className": "list-group-item justify-content-between align-items-center"},
            "No file is there :("
        ));
    }

    return list;
  }

  onDelete(e){
    let target = e.target;
    let fileId = target.parentNode.getAttribute("dataid");
    let file = fileManager.getById(fileId);
    fileManager.remove(file);
  }

  onFileSelect(e){
    let target = e.target;
    let fileId = target.getAttribute("dataid");
    let file = fileManager.getById(fileId);
    fileManager.select(file);
  }

  render(){

    let fileItems = this.getItems();
    return  React.createElement(
              "div",
              { "className": "content" },
              React.createElement("ul",{ "className": "list-group filesList" }, fileItems)
            );
  }
}

module.exports = FileManager;
