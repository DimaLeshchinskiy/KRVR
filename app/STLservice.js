function load(path) {

  return new Promise( (resolve, reject) => {

    const loader = new THREE.STLLoader();

    loader.load(path, function ( geometry ) {

      var material = new THREE.MeshPhongMaterial(
        { color: 0xff5533, specular: 0x111111, shininess: 200 }
      );
      var mesh = new THREE.Mesh( geometry, material );

      mesh.position.set( 0, - 0.25, 0.6 );
      mesh.rotation.set( 0, - Math.PI / 2, 0 );
      mesh.scale.set( 0.5, 0.5, 0.5 );

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      resolve(mesh);
    });

  });

}

exports.getStl = async function(file){

  mesh = await load(file.path);

  file.data = mesh;

  return file;
}
