var flm = require("../app/fileLoadModule");
var d2c = require("../app/DXF2CANVAS");

//grid visualisation
function renderGrid(){

  let size = getStickyRulerSize();
  let scale = config.getByKey("ScreenS");
  let height = config.getByKey("ScreenH");
  let width = config.getByKey("ScreenW");

  let canvas = document.getElementById("grid");
  let ctx = canvas.getContext("2d");

  canvas.width = width * scale;
  canvas.height = height * scale;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#80e5ff";

  //horizontal
  for(let i = size * scale; i < height * scale; i+= size * scale){
    ctx.moveTo(0, i);
    ctx.lineTo(width * scale, i);
  }

  //vertical
  for(let i = size * scale; i < width * scale; i+= size * scale){
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height * scale);
  }

  ctx.stroke();
}

function clearGrid(){
  let canvas = document.getElementById("grid");
  let ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//tool visualisation
let laser = document.getElementsByClassName("laser")[0];
let scale = config.getByKey("ScreenS");
const deltaTime = 0.01;

function parseGcode(code){
  let arr = code.split(" ");
  let map = new Map();

  for (var i = 0; i < arr.length; i++) {
    map.set(arr[i].charAt(0), parseFloat(arr[i].substring(1)));
  }

  return map;
}

function jump(map){
  state.setX(map.get("X"));
  state.setY(map.get("Y"));
  renderLaser();
}

async function moveTo(map, jog){
  x0 = state.getX();
  y0 = state.getY();
  velocity = (map.get("F") + 50) / 60; // mm/sec

  dx = 0;
  dy = 0;

  if(jog){
    dx = map.get("X") + x0;
    dy = map.get("Y") + y0;
  }else{
    dx = map.get("X");
    dy = map.get("Y");
  }

  s = Math.sqrt(Math.pow(dx - x0, 2) + Math.pow(dy - y0, 2));
  t = s / velocity; // sec

  xVelocity = (dx - x0) / (t / deltaTime);
  yVelocity = (dy - y0) / (t / deltaTime);

  /*console.log(`${x0} ${y0} ${dx} ${dy} ${velocity} ${xVelocity} ${yVelocity} ${s} ${t}`);
  console.log(`${scale}`);
  console.log(map);*/

  for(let i = 0; i < parseInt(t / deltaTime); i++){
      state.addX(xVelocity);
      state.addY(yVelocity);

      renderLaser();

      await sleep(1000 * deltaTime);
  }

  state.setX(dx);
  state.setY(dy);

  renderLaser();
}

function getAngle(radius, I, J){
  angle = Math.acos(-I / radius);

  if(I <= 0 && J <= 0)
    return angle;
  else if(I >= 0 && J <= 0)
    return Math.PI - angle;
  else if(I <= 0 && J >= 0)
    return 2 * Math.PI - angle;
  else if(I >= 0 && J >= 0)
    return Math.PI + angle;

}

function getAngleBetween(startAngle, endAngle){
    if(startAngle >= endAngle)
      return startAngle - endAngle;
    else
      return 2 * Math.PI - (endAngle - startAngle);
}

async function arcTo(map){
  x0 = state.getX();
  y0 = state.getY();
  velocity = (map.get("F") + 50) / 60; // mm/sec

  I = map.get("I");
  J = map.get("J");

  cx = x0 + I;
  cy = y0 + J;

  dx = map.get("X");
  dy = map.get("Y");

  radius = Math.sqrt(Math.pow(J, 2) + Math.pow(I, 2));
  startAngle = getAngle(radius, I, J);
  endAngle = getAngle(radius, cx - dx, cy - dy);

  angle = getAngleBetween(startAngle, endAngle);
  w = velocity / radius;

  t = angle / w; // sec

  console.log(`${x0} ${y0} ${dx} ${dy}`);
  console.log(`${cx} ${cy} ${I} ${J}`);
  console.log(`${w} ${startAngle} ${endAngle} ${angle} ${radius} ${t}`);
  console.log(map);

    //G2 X10 Y20 I-10 J0 F10

  angleVelocity = angle / (t / deltaTime);

  for(let i = 0; i < parseInt(t / deltaTime); i++){
      startAngle -= angleVelocity;

      newX = radius * Math.cos(startAngle) + cx;
      newY = radius * Math.sin(startAngle) + cy;

      state.setX(newX);
      state.setY(newY);

      renderLaser();

      await sleep(1000 * deltaTime);
  }

  state.setX(dx);
  state.setY(dy);

  renderLaser();
}

function laserHome(){
  state.setX(0);
  state.setY(0);

  renderLaser();
}

serial.listener.on("gcodeSend", (code) => {
  map = parseGcode(code);

  console.log(code);

  if(code.includes("$J")){
    moveTo(map, true);
    return;
  }

  if(code.includes("$H")){
    laserHome();
    return;
  }

  switch(map.get("G")){
    case 0:
    case 1:
      moveTo(map, false);
      break;
    case 2:
      arcTo(map);
      break;
  }


});

function renderLaser(){

  y = scale * (config.getByKey("ScreenH") - state.getY()) - 2;
  x = scale * state.getX() - 2 ;

  laser.style.top = y + "px";
  laser.style.left = x + "px";

  state.print();
}

// File load and control
var ghostEle;

$('#main').on(
  'dragover',
  function(e) {
    e.preventDefault();
    e.stopPropagation();
  }
);
$('#main').on(
  'dragenter',
  function(e) {
    e.preventDefault();
    e.stopPropagation();
  }
);

$('#main').on(
  'drop',
  function(e) {
    if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
      e.preventDefault();
      e.stopPropagation();

      let filesDropped = e.originalEvent.dataTransfer.files;
      for (let i = 0; i < filesDropped.length; i++) {
        if (flm.setPath(filesDropped[i].path)) {
          file = flm.getFile();
          let cnv = d2c.getCanvas(file);
          cnv.draggable = true;

          cnv.addEventListener("dragstart", dragStart);

          cnv.addEventListener("dragover", function(event){
            event.preventDefault();
          });

          cnv.addEventListener("dragend", dragEnd);


          $(".space").append(cnv);
          files.push(file);
        }
      }
      console.log(files);
    }
  }
);

function dragStart(event){
  ghostEle = document.createElement('div');
  ghostEle.classList.add('ghostElement');
  ghostEle.style.height = event.target.height + "px";
  ghostEle.style.width = event.target.width + "px";
  document.body.appendChild(ghostEle);
  event.dataTransfer.setDragImage(ghostEle, 0, 0);
}

function dragEnd(event){
  document.body.removeChild(ghostEle);

  let itemX = 0;
  let itemY = 0;
  let item = event.target;

  let dom = document.getElementsByClassName("space")[0];
  let left = dom.offsetLeft;
  let top = dom.offsetTop;

  if(config.getByKey("stickyRuler") && getStickyRulerSize().isPositiveNum()){
    let size = getStickyRulerSize();
    let scale = config.getByKey("ScreenS");

    posX = (event.pageX - left) / scale;
    posY = (event.pageY - top) / scale;

    itemX = Math.round(posX / size) * size * scale;
    itemY = Math.round(posY / size) * size * scale;
  }else{
    itemX = event.pageX - left;
    itemY = event.pageY - top;
  }

  item.style.top = itemY + "px";
  item.style.left = itemX + "px";

  let path = item.getAttribute("datapath");
  let file = {};

  for(let i = 0; i < files.length; i++){
    if(files[i].path == path){
      file = files[i];
      break;
    }
  }

  screenY = config.getByKey("ScreenH");
  screenS = config.getByKey("ScreenS");

  itemY = screenS * (-file.height + screenY) - itemY;

  file.offsetX = itemX / file.scale;
  file.offsetY = itemY / file.scale;

  console.log(file);
}
