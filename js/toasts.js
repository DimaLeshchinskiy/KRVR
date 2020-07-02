function showMsg(title, msg) {

  var toast = $('<div>', {
    class: 'toast'
  });

  toast.attr("data-autohide", "false");

  toast.append(getToastHead(title));
  toast.append(getToastBody(msg));

  toast.appendTo(".toasts");

  $(toast).toast('show');
}

function getToastHead(title) {
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

function getToastBody(msg) {
  var toastBody = $('<div>', {
    class: 'toast-body',
    text: msg
  });
  return toastBody;
}
