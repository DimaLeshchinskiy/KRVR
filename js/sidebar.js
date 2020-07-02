const d2g = require("../app/DXF2GC");

$(".tab .head").click(trigTab);
$(".tab .but.start").click(start);
$(".tab .btn.clearConsole").click(clearConsole);
$(".tab .btn.sendToSerial").click(sendToSerial);
$(".tab .btn-group > .btn").click(setFilter);

$(".tab .btn.incY").click(incY);
$(".tab .btn.incX").click(incX);
$(".tab .btn.decX").click(decX);
$(".tab .btn.decY").click(decY);
$(".tab .btn.UpLf").click(UpLf);
$(".tab .btn.UpRg").click(UpRg);
$(".tab .btn.DwLf").click(DwLf);
$(".tab .btn.DwRg").click(DwRg);
$(".tab .btn.unlock").click(unlock);
$(".tab .btn.home").click(home);
$(".tab .btn.OnOff").click(OnOff);

serial.listener.on("end", function(){

  var btn = $(".tab .but.start");
  btn.unbind();
  btn.text("Start");
  btn.addClass("btn-primary");
  btn.removeClass("btn-danger");
  btn.click(start);
});

serial.listener.on("log", (msg, type) => log(msg, type));

function OnOff(){
  if($(this).attr("datastate") == "off"){
    $(this).attr("datastate", "on");
    $(this).text("OFF");
    cmd = "M3 S" + getPWM();
    send(cmd);
  }else{
    $(this).attr("datastate", "off");
    $(this).text("ON");
    cmd = "M5";
    send(cmd);
  }
}

function UpLf(){
  step =  getStep();
  feed = getFeed();
  cmd = `$J=G91 G21 Y${step} X-${step} F`+ feed;
  send(cmd);
}

function UpRg(){
  step = getStep();
  feed = getFeed();
  cmd = `$J=G91 G21 Y${step} X${step} F`+ feed;
  send(cmd);
}

function DwLf(){
  step =  getStep();
  feed = getFeed();
  cmd = `$J=G91 G21 Y-${step} X-${step} F`+ feed;
  send(cmd);
}

function DwRg(){
  step =  getStep();
  feed = getFeed();
  cmd = `$J=G91 G21 Y-${step} X${step} F`+ feed;
  send(cmd);
}


function incY(){
  step =  getStep();
  feed = getFeed();
  cmd = `$J=G91 G21 X0 Y${step} F`+ feed;
  send(cmd);
}

function incX(){
  step = getStep();
  feed = getFeed();
  cmd = `$J=G91 G21 X${step} Y0 F`+ feed;
  send(cmd);
}

function decY(){
  step =  getStep();
  feed = getFeed();
  cmd = `$J=G91 G21 X0 Y-${step} F`+ feed;
  send(cmd);
}

function decX(){
  step =  getStep();
  feed = getFeed();
  cmd = `$J=G91 G21 X-${step} Y0 F`+ feed;
  send(cmd);
}

function unlock(){
  send('$X');
}

function home(){
  cmd = '$H';
  send(cmd);
}


function setFilter(){
  val = $(this).text().trim();
  console.log(val);

  if(val == "All")
    $(".output .list-group>*").show();
  else if(val == "Error"){
    $(".output .list-group>*").hide();
    $(".output .list-group>*[data-type=error]").show();
  }
  else if(val == "Msg"){
    $(".output .list-group>*").hide();
    $(".output .list-group>*[data-type=msg]").show();
  }
  else if(val == "Input"){
    $(".output .list-group>*").hide();
    $(".output .list-group>*[data-type=input]").show();
  }
}

function getFilter(){
  return $(".tab .btn-group > .btn.active").text().trim();
}

function clearConsole(){
  $(".output .list-group").empty();
}

function sendToSerial(){

    let cmd = $( this ).closest(".input-group").find("input").val();
    send(cmd);
}

function send(data){
  if(!serial.isOpen()){
    showMsg("Ooops", "Port is not connected");
    return;
  }

  serial.push([data]);
  serial.write();
}

function start(){

  if(!serial.isOpen()){
    showMsg("Ooops", "Port is not connected");
    return;
  }

  $(this).unbind();
  $(this).text("Stop");
  $(this).removeClass("btn-primary");
  $(this).addClass("btn-danger");
  $(this).click(stop);

  for (var i = 0; i < files.length; i++) {
    let file = files[i];
    let gcode = d2g.getGcode(file);

    serial.push(gcode);
  }


  serial.write();

}

function stop(){
  serial.stop();

  $(this).unbind();
  $(this).text("Start");
  $(this).addClass("btn-primary");
  $(this).removeClass("btn-danger");
  $(this).click(start);
}

//Tab open on load
function openTab(){
  $(".tab[data-trig=open] .content").each((index, item)=>{
    $(item).slideDown("fast");
  });
}

//Tab open
function trigTab(event) {
  var tab = $(this).closest(".tab");
  var content = tab.find(".content");
  var trig = tab.attr("data-trig");

  //toogle
  if (trig == "close")
    trig = "open";
  else
    trig = "close";

  tab.attr("data-trig", trig);

  //do
  if (trig == "close") {
    $(content).slideUp("fast");
  } else {
    $(content).slideDown("fast");
  }
}


//Sidebar open

function openNav() {
  document.getElementById("mySidebar").style.width = "350px";
  document.getElementById("main").style.marginLeft = "350px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

function trigNav() {
  var trig = $(".sidebar").attr("data-status");
  //toogle
  if (trig == "close")
    trig = "open";
  else
    trig = "close";

  $(".sidebar").attr("data-status", trig);

  //do
  if (trig == "close") {
    closeNav();
  } else {
    openNav();
  }
}

//print to console
function log(msg, type){

  if(!Array.isArray(msg))
    msg = msg.trim();

  if(!msg) return;

  myconsole = document.getElementsByClassName("list-group")[0];

  var node = document.createElement("li");
  node.classList.add("list-group-item");

  if(type == "error")
    node.classList.add("list-group-item-danger");
  else if(type == "input")
    node.classList.add("list-group-item-warning");
  else if(type == "msg")
    node.classList.add("list-group-item-light");

  node.setAttribute("data-type", type);

  node.innerHTML = msg;

  myconsole.appendChild(node);

  if(getFilter().toLowerCase() != type && getFilter().toLowerCase() != "all")
    $(node).hide();

  myconsole.parentNode.scrollTop = myconsole.parentNode.scrollHeight;
}
