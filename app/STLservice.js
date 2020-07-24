async function load(path) {

  return await new Promise( (resolve, reject) => {

    let loader = new THREE.STLLoader();

    loader.load(path, function ( geometry ) {

      let material = new THREE.MeshNormalMaterial({
  			color: 0xffffff
  		});
      let mesh = new THREE.Mesh( geometry, material );

      mesh.position.set(100, 100, 100);
      mesh.updateMatrix();
  		mesh.matrixAutoUpdate = false;

      resolve(mesh);
    });

  });
}

exports.getStl = async function(file){

  file.data = await load(file.path);

  return file;
}
