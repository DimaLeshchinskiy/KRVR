const config = require("../singleton/config");
const drillService = require('../service/drillService');

function getMeshGeometry(file){
  let geometry = file.data.geometry.clone();
  geometry.center();
  geometry.computeBoundingBox();

  let box = geometry.boundingBox;
  let zOffset = Math.abs(box.min.z) - file.Z3D;

  let toRad = Math.PI / 180;

  let scale = parseFloat(file.scale);
  let angleX = parseInt(file.angleX3D) * toRad;
  let angleY = parseInt(file.angleY3D) * toRad;
  let angleZ = parseInt(file.angleZ3D) * toRad;

  geometry.rotateX(angleX);
  geometry.rotateY(angleZ);
  geometry.rotateZ(angleY);

  geometry.translate(0, zOffset, 0);

  geometry.scale(scale, scale, scale);

  return geometry;
}

function getSize(geometry){
  let box = geometry.boundingBox;
  console.log(box.min, box.max);

  return {
    width: Math.abs(box.min.x) * 2,
    height: Math.abs(box.min.z) * 2
  };
}

function compareLayer(l1, l2){
  console.log("compare");

  if(l1 == null || l2 == null)
    return false;

  let res = l2.bsp.subtract(l1.bsp);

  return res.tree.allPolygons().length == 0;
}

async function getLayers(param){
  let width = param.size.width;
  let height = param.size.height;
  let depth = param.size.depth;

  //camera
  /*camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, depth + 1);
  camera.position.set(0, depth + 1, 0);
  camera.lookAt(0, 0, 0);

  //renderer
  let renderer = param.renderer;
  renderer.setSize(width, height);*/

  let layers = [];
  let step = param.step;

  for(let i = depth; i >= 0; i -= step)
  {
    //scene
    /*let scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFF0000);*/

    //mesh
    let planeGeometry = new THREE.BoxGeometry(width, step, height);
    planeGeometry.center();
    planeGeometry.translate(0, i, 0);

    let planeBSP = new ThreeBSP(planeGeometry);
    planeBSP = planeBSP.intersect(param.geometryBSP);

    //let mesh = planeBSP.toMesh();
    if(layers.length > 1 && planeBSP.tree.allPolygons().length == 0) break; //exit if result is empty
    //scene.add(mesh);

    //render
    /*renderer.render(scene, camera);
    let img = await loadImage(renderer.domElement.toDataURL());
    img.width = width;
    img.height = height;*/

    let newLayer = {
      /*img: img,
      imageData: getImageData(img),*/
      from: i + step/2,
      z: i,
      to: i - step/2,
      bsp: planeBSP
    };

    if(compareLayer(layers[layers.length - 1], newLayer)){ //check if previous layer has same geometry
      layers[layers.length - 1].to = i - step/2;
    }
    else{
      layers.push(newLayer);
    }
  }

  return layers;
}

function loadImage(src){
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  })
}

function getImageData(img){
  let canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  // Copy the image contents to the canvas
  let ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  return ctx.getImageData(0, 0, img.width, img.height);
}

function getPointsFromEmptyLayer(drills, startPoint, finishPoint){
  let step = drills[0].radius * 2; //drill move to right
  let points = [];

  for(let i = startPoint.y; i >= finishPoint.y; i -= step){
    points.push({x: startPoint.x, y: i, radius: drills[0].radius});
    points.push({x: finishPoint.x, y: i, radius: drills[0].radius});
  }

  return points;
}

function getPointsFromLayer(layer, drills, drillIndex, startPoint, finishPoint){
  let drill = new Drill(drills[drillIndex].radius);//actual drill
  drill.translate(startPoint.x, layer.z, startPoint.y);//move drill to start

  let step = drill.radius * 2; //drill move to right step

  let points = [];
  let layerBSP = layer.bsp;

  for(let i = startPoint.y; i >= finishPoint.y; i -= step){
    for(let j = startPoint.x; j <= finishPoint.x; j += step){

      let res = drill.bsp().intersect(layerBSP);

      if(res.tree.allPolygons().length == 0) {//have to cut there
        points.push({x: j, y: i, radius: drill.radius});
      }
      else if(drills.length > drillIndex + 1){ //if is smaller drill in set
        let newStart = {
          x: j - drill.radius,
          y: i + drill.radius
        }; //for next tool
        let newFinish = {
          x: j + drill.radius,
          y: i - drill.radius
        }; //for next tool

        let new_layer = { //smaller bsp for optimisation
          bsp: res, //magic is here:)
          z: layer.z
        };

        let pointsSmallerDrill = getPointsFromLayer(new_layer, drills, drillIndex + 1, newStart, newFinish);
        points = points.concat(pointsSmallerDrill);
      }

      drill.translate(step, 0, 0);

    }
    drill.translate(0, 0, -step);
    drill.translate(-(drill.x - finishPoint.x), 0, 0);//move to finishX
    drill.translate(-finishPoint.x * 2, 0, 0);//move to startX
  }

  return points;
}

function getPoints(params){
  let layer = params.layer;
  let drills = params.drills;
  let size = params.size;

  let startPoint = {
    x: -(size.width / 2),
    y: size.height / 2
  };
  let finishPoint = {
    x: size.width / 2,
    y: -(size.height / 2)
  };

  if(layer.bsp.tree.allPolygons().length == 0){
    layer.isEmpty = true;
    return getPointsFromEmptyLayer(drills, startPoint, finishPoint);
  }
  else{
    return getPointsFromLayer(layer, drills, 0, startPoint, finishPoint);
  }
}

function getStartPoint(drillRadius, size){
  return {
    x: -(size.width / 2) + drillRadius,
    y: size.height / 2 - drillRadius
  };
}

function getLine(p1, p2, params){
  cmd = [];

  let maxZ = config.getDevZ();
  //let z = params.z - params.zOffset;

  let point0 = {
    x: p1.x - params.xOffset,
    y: p1.y - params.yOffset
  };

  let point1 = {
    x: p2.x - params.xOffset,
    y: p2.y - params.yOffset
  };

  cmd.push("G0 X" + point0.x + " Y" + point0.y + " F" + params.feed); //go to start point
  cmd.push("G1 Z" + params.z + " F" + params.feed); //go max down

  cmd.push("G1 X" + point1.x + " Y" + point1.y + " F" + params.feed); //go to end point
  cmd.push("G1 Z" + maxZ + " F" + params.feed); //go max up

  return cmd;
}

function connectPointsToLines(points){
  let lines = [];

  let pointFrom = points[0];
  let y = pointFrom.y;
  let radius = pointFrom.radius;
  let endLine = false;

  for(let i = 1; i < points.length; i++){
    if(y != points[i].y || radius != points[i].radius){
      lines.push({
        p1: pointFrom,
        p2: points[i - 1],
        radius: radius
      });

      pointFrom = points[i];
      y = pointFrom.y;
      radius = pointFrom.radius;

      endLine = true;
    }else{
      endLine = false;
    }
  }

  if(!endLine)
    lines.push({
      p1: pointFrom,
      p2: pointFrom,
      radius: radius
    });

  return lines;
}

function getGcodeFromLines(lines, z, params){
  let gcode = [];
  for(let i = 0; i < lines.length; i++){
    let code = getLine(lines[i].p1, lines[i].p2,
      {
        z:z,
        xOffset: params.xOffset,
        yOffset: params.yOffset,
        feed: params.feed
      });
    gcode = gcode.concat(code);
  }
  return gcode;
}

function calculateGcode(lines, params){
  let gcode = [];

  let height = params.layerFrom - params.layerTo;
  let fullCountOfLayer = 1; //layer.from and to todo
  if(height > params.drillLen)
    fullCountOfLayer = (height - (height % params.drillLen)) / params.drillLen;

  for(let j = fullCountOfLayer; j > 0; j--){
    let z = j * params.drillLen + params.layerTo;
    gcode = gcode.concat(getGcodeFromLines(lines, z, params));
  }

  if(height % params.drillLen){
    let z = params.layerTo;
    gcode = gcode.concat(getGcodeFromLines(lines, z, params));
  }

  return gcode;
}

function checkGeometryPosition(geometry){
  let box = geometry.boundingBox;
  return (box.min.y >= 0);
}

exports.getGcode = async function(file){
  let step = 1;
  let geometry = getMeshGeometry(file);

  if(!checkGeometryPosition(geometry))
    return [];

  let size = getSize(geometry);
  size.depth = file.material.depth;

  /*let renderer = new THREE.WebGLRenderer({
    logarithmicDepthBuffer: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);*/

  let layers = await getLayers(
  {
    geometryBSP: new ThreeBSP(geometry),
    size: size,
    //renderer: renderer,
    step: step,
    zOffset: file.Z3D
  });

  /*for(let i = 0; i < layers.length; i++)
    console.image(layers[i].img.src);*/

  let drills = drillService.getSortedSet();

  for(let j = 0; j < layers.length; j++){
    let points = getPoints({layer:layers[j], drills:drills, size: size});
    //console.log(points);
    if(points.length == 0)
      continue;

    layers[j].lines = connectPointsToLines(points);
    //console.log(layers[j].lines);
  }

  let gcode = [];
  console.log("debug");

  for(let i = 0; i < drills.length; i++){
    let drill = drills[i];
    for(let j = 0; j < layers.length; j++){
      let layer = layers[j];
      let lines = [];

      for(let k = 0; k < layer.lines.length; k++)
        if(layer.lines[k].radius == drill.radius)
          lines.push(layer.lines[k]);

      let code = calculateGcode(lines, {
                                          xOffset: file.X3D,
                                          yOffset: file.Y3D,
                                          drillLen: drill.size,
                                          layerFrom:  layer.from,
                                          layerTo:  layer.to,
                                          layerZ:  layer.z,
                                          feed: config.getByKey("feed")
                                        });
      gcode = gcode.concat(code);
    }
  }

  console.log(gcode);

  return gcode;
}


class Drill{
  constructor(radius){
    this.geometry= new THREE.BoxGeometry(radius * 2, 10, radius * 2);
    this.geometry.center();

    this.radius = radius;
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  translate(x, y, z){
    this.geometry.translate(x, y, y);

    this.x += x;
    this.y += y;
    this.z += z;
  }

  bsp(){
    return new ThreeBSP(this.geometry);
  }

  mesh(){
    return new THREE.Mesh(this.geometryCut);
  }
}
