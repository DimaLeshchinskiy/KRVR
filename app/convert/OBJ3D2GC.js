const config = require("../singleton/config");

function getDepthMap(file){
  let root = document.createElement("div");

  let width = config.getDevX() * config.getByKey("ScreenS");
  let height = config.getDevY() * config.getByKey("ScreenS");
  let deviceZ = config.getDevZ() * config.getByKey("ScreenS");

  //scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFF0000);

  renderer = new THREE.WebGLRenderer({
    logarithmicDepthBuffer: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  root.appendChild(renderer.domElement);

  //mesh
  let geometry = file.data.geometry;
	geometry.center();

	let material = new THREE.MeshDepthMaterial();
	let mesh = new THREE.Mesh(geometry, material);
  let toRad = Math.PI / 180;

  let scale = parseFloat(file.scale);
  let angleX = parseInt(file.angleX3D) * toRad;
  let angleY = parseInt(file.angleY3D) * toRad;
  let angleZ = parseInt(file.angleZ3D) * toRad;
  let x3D = -parseInt(file.X3D) * config.getByKey("ScreenS");
  let y3D = parseInt(file.Y3D) * config.getByKey("ScreenS");
  let z3D = -parseInt(file.Z3D) * config.getByKey("ScreenS");
  mesh.scale.set(scale, scale, scale);
  mesh.rotation.set(angleX, angleZ, angleY);
  mesh.position.set(x3D, z3D, y3D);
  mesh.updateMatrix();
  scene.add(mesh);

  //camera
  camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, deviceZ);
  camera.position.set(width / 2, deviceZ + 1, height / -2);
  camera.lookAt(width / 2, 0,  height / -2);

  //render
  let img = new Image();
  renderer.render(scene, camera);
  img.src = renderer.domElement.toDataURL();

  return img;
}


exports.getGcode = function(file){

  let depthMap = getDepthMap(file);

  console.log(depthMap);

  return null;
}
