const FileModel = require("../model/fileModel");

async function load(path) {

  return await new Promise( (resolve, reject) => {

    let loader = new THREE.STLLoader();

    loader.load(path, function ( geometry ) {

      geometry.center();

      let material = new THREE.MeshNormalMaterial({
  			color: 0xffffff
  		});
      let mesh = new THREE.Mesh( geometry, material );

      mesh.position.set(0, 0, 0);
      mesh.updateMatrix();
  		mesh.matrixAutoUpdate = false;

      resolve(mesh);
    });

  });
}

exports.getStl = async function(params){

  let file = new FileModel(params);

  let mesh = await load(file.path);
  mesh.userData.id = file.id;
  file.data = mesh;

  return file;
}
