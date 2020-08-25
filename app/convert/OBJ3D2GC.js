const config = require("../singleton/config");

function getMeshGeometry(file){
  let geometry = file.data.geometry.clone();
  geometry.center();

  let toRad = Math.PI / 180;

  let scale = parseFloat(file.scale);
  let angleX = parseInt(file.angleX3D) * toRad;
  let angleY = parseInt(file.angleY3D) * toRad;
  let angleZ = parseInt(file.angleZ3D) * toRad;

  geometry.rotateX(angleX);
  geometry.rotateY(angleZ);
  geometry.rotateZ(angleY);

  geometry.scale(scale, scale, scale);

  return geometry;
}

function getSizeOfGeometry(geometry){

  geometry.computeBoundingBox();

  let box = geometry.boundingBox;
  console.log(box.min, box.max);

  return box;
}

async function getLayers(param){
  //box bounder
  let box = param.sizeOfMesh;

  //sizes count
  let deviceZ = config.getDevZ();
  let width = Math.abs(box.min.x) * 2;
  let height = Math.abs(box.min.z) * 2;
  let depth = Math.abs(box.min.y) * 2;

  //camera
  camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, deviceZ);
  camera.position.set(0, deviceZ, 0);
  camera.lookAt(0, 0, 0);

  //renderer
  let renderer = param.renderer;
  renderer.setSize(width, height);

  let images = [];
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
    planeGeometry.translate(0, -depth / 2, 0);

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

    images.push({
      img: img,
      imageData: getImageData(img),
      layer: i
    });
  }

  return images;
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
  let size = getSizeOfGeometry(geometry); // return Three.Box3
  let renderer = new THREE.WebGLRenderer({
    logarithmicDepthBuffer: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);

  let layers = await getLayers(
  {
    geometryBSP: new ThreeBSP(geometry),
    sizeOfMesh: size,
    renderer: renderer
  });

  console.log(layers);

  for(let i = 0; i < layers.length; i++)
    console.image(layers[i].img.src);


  return null;
}
