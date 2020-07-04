const React = require("react");
const { ipcRenderer } = require('electron');

class ToastContainer extends React.Component{

  constructor(props){
    super(props);

    this.toastsRef = React.createRef();

    this.showMsg = this.showMsg.bind(this);

    ipcRenderer.on('AutoUpdateMessage',
      (event, text) => this.showMsg("Auto Update", text));
  }

  showMsg(title, msg) {
    var toast = $('<div>', {
      class: 'toast'
    });

    toast.attr("data-autohide", "false");

    toast.append(this.getToastHead(title));
    toast.append(this.getToastBody(msg));

    this.toastsRef.current.appendChild(toast.get(0));

    $(toast).toast('show');
  }

  getToastHead(title) {
    var toastHead = $('<div>', {
      class: 'toast-header'
    });

    var strong = $('<strong>', {
      class: 'mr-auto text-primary',
      text: title
    });

    var small = $('<small>', {
      class: 'text-muted',
      text: "just now"
    });

    var button = $('<button>', {
      class: 'ml-2 mb-1 close',
      type: "button",
      html: "&times;"
    });
    button.attr("data-dismiss", "toast");

    toastHead.append(strong);
    toastHead.append(small);
    toastHead.append(button);
    return toastHead;
  }

  getToastBody(msg) {
    var toastBody = $('<div>', {
      class: 'toast-body',
      text: msg
    });
    return toastBody;
  }

  render(){
    return React.createElement("div", {"className": "toasts", ref:this.toastsRef});
  }
}

module.exports = ToastContainer;
