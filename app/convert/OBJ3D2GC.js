const config = require("../singleton/config");

function getMeshGeometry(file){
  let geometry = file.data.geometry.clone();
  geometry.center();
  geometry.computeBoundingBox();

  let box = geometry.boundingBox;
  let zOffset = Math.abs(box.min.z);

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

function getSize(file){

  let geometry = getMeshGeometry(file);

  let box = geometry.boundingBox;
  console.log(box.min, box.max);

  return {
    width: Math.abs(box.min.x) * 2,
    height: Math.abs(box.min.z) * 2,
    depth: file.material.depth
  };
}

function compareLayer(l1, l2){
  console.log("compare");

  for(let i = 0; i < l1.imageData.data.length; i++)
    if(l1.imageData.data[i] != l2.imageData.data[i])
      return false;

  return true;
}

async function getLayers(param){
  let width = param.size.width;
  let height = param.size.height;
  let depth = param.size.depth;

  //camera
  camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, depth + 1);
  camera.position.set(0, depth + 1, 0);
  camera.lookAt(0, 0, 0);

  //renderer
  let renderer = param.renderer;
  renderer.setSize(width, height);

  let layers = [];
  let step = 0.1;

  for(let i = depth; i >= 0; i -= step)
  {
    //scene
    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFF0000);

    //mesh
    let planeGeometry = new THREE.BoxGeometry(width, step, height);
    planeGeometry.center();
    planeGeometry.translate(0, i, 0);

    let planeBSP = new ThreeBSP(planeGeometry);
    planeBSP = planeBSP.subtract(param.geometryBSP);

    let mesh = planeBSP.toMesh();
    if(mesh.geometry.vertices.length == 0) break; //exit if result mesh is empty

    scene.add(mesh);

    //render
    renderer.render(scene, camera);
    let img = await loadImage(renderer.domElement.toDataURL());
    img.width = width;
    img.height = height;

    let newLayer = {
      img: img,
      imageData: getImageData(img),
      layer: i
    };

    if(layers.length > 0 && compareLayer(layers[layers.length - 1], newLayer)){ //check if previous layer has same geometry
      layers[layers.length - 1].layer = i;
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

exports.getGcode = async function(file){

  let geometry = getMeshGeometry(file);
  let size = getSize(file);
  let renderer = new THREE.WebGLRenderer({
    logarithmicDepthBuffer: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);

  let layers = await getLayers(
  {
    geometryBSP: new ThreeBSP(geometry),
    size: size,
    renderer: renderer
  });

  console.log(layers);

  for(let i = 0; i < layers.length; i++)
    console.image(layers[i].img.src);

  gcode = [];

  return gcode;
}
