const React = require("react");

var fileManager = require("../app/fileManager");
var config = require("../app/config");
var _state = require("../app/state");

var Grid = require("../Components/Grid.js");

class ThreeDimensions extends React.Component{

  constructor(props) {
    super(props);
    this.spaceRef = React.createRef();

    this.meshes = [];

    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onMousePick = this.onMousePick.bind(this);
    this.update = this.update.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.renderFiles = this.renderFiles.bind(this);
    this.generateWorkspace = this.generateWorkspace.bind(this);
    this.generateLaser = this.generateLaser.bind(this);

    this.camera = null;
    this.controls = null;
    this.scene = null;
    this.renderer = null;
    this.raycaster = null;
    this.mouse = null;

    this.meshWorkspace = null; //workspace mesh
    this.meshLaser = null; //laser mesh

    this.textureWorkspace = new THREE.TextureLoader().load('https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80')
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    console.log("mount");
    let root = this.spaceRef.current;

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xcccccc);

		this.renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		root.appendChild(this.renderer.domElement);

		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 200000);
		this.camera.position.set(0, 900, 900);

		// this.controls

		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

		this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		this.controls.dampingFactor = 0.05;

		this.controls.screenSpacePanning = false;

		this.controls.minDistance = 600;
		this.controls.maxDistance = 1900;

		this.controls.maxPolarAngle = Math.PI / 2;

		// workspace
    this.generateWorkspace();
		this.scene.add(this.meshWorkspace);

		//laser
    this.generateLaser();
    this.scene.add(this.meshLaser);

    //files
    this.renderFiles();

		// lights
		var light = new THREE.DirectionalLight(0xffffff);
		light.position.set(1, 1, 1);
		this.scene.add(light);

		var light = new THREE.DirectionalLight(0xffffff);
		light.position.set(-1, -1, -1);
		this.scene.add(light);

		var light = new THREE.AmbientLight(0xffffff);
		this.scene.add(light);

		window.addEventListener('resize', this.onWindowResize, false);
    root.addEventListener( 'mouseup', this.onMousePick, false );

    this.animate();

    config.listener.on("configUpdate", this.update);
    _state.listener.on("change", this.update);
    fileManager.listener.on("update", this.onSelect);
  }

  componentDidUpdate() {
    //files
    this.renderFiles();

    // workspace
    this.scene.remove(this.meshWorkspace);
    this.generateWorkspace();
		this.scene.add(this.meshWorkspace);

    // laser
    this.scene.remove(this.meshLaser);
    this.generateLaser();
		this.scene.add(this.meshLaser);

  }

  render(){
    return React.createElement("div",{"className": "space3D", ref:this.spaceRef });
  }

  generateWorkspace(){
    let width = config.getDevX() * config.getByKey("ScreenS");
    let height = config.getDevY() * config.getByKey("ScreenS");

    let x = config.getDevX() / 2 * config.getByKey("ScreenS");
    let y = -config.getDevY() / 2 * config.getByKey("ScreenS");

    var geometryWorkspace = new THREE.BoxGeometry(width, 10, height);
		var materialWorkspace = new THREE.MeshLambertMaterial({
			map: this.textureWorkspace
		});
		var meshWorkspace = new THREE.Mesh(geometryWorkspace, materialWorkspace);

		meshWorkspace.position.set(x, 0, y);
		meshWorkspace.updateMatrix();
		meshWorkspace.matrixAutoUpdate = false;

    this.meshWorkspace = meshWorkspace;
  }

  generateLaser(){
    let toolHeight = 100;

    let x = _state.getX() * config.getByKey("ScreenS");
    let y = -_state.getY() * config.getByKey("ScreenS");
    let z = _state.getZ() * config.getByKey("ScreenS")  + toolHeight / 2;

    var geometryLaser = new THREE.BoxGeometry(20, toolHeight, 20);
		var materialLaser = new THREE.MeshLambertMaterial({
			color: 0x000000
		});
		var meshLaser = new THREE.Mesh(geometryLaser, materialLaser);

		meshLaser.position.set(x, z, y);
		meshLaser.updateMatrix();
		meshLaser.matrixAutoUpdate = false;

    this.meshLaser = meshLaser;
  }

  onWindowResize() {
    let root = this.spaceRef.current;

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

  onMousePick(event) {
    if(event.button != 2) return;

    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	  this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    this.raycaster.setFromCamera( this.mouse, this.camera );

  	let intersect = this.raycaster.intersectObjects( this.meshes )[0];

    if(intersect){
      let id = intersect.object.userData.id;
      let file = fileManager.getById(id);
      fileManager.select(file);
    }
	}

	animate() {
    if(!this._isMounted) return;
		requestAnimationFrame(this.animate);
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	}

  update(){
    if(!this._isMounted) return;
    this.forceUpdate();
  }

  onSelect(){
    if(!this._isMounted) return;
    this.forceUpdate();
  }

  renderFiles(){
    this.meshes = [];

    //file render
    let files = fileManager.getAll();
    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      let mesh = {};
      if(file.extension == "stl")
        mesh = file.data;
      else continue;

      this.meshes.push(mesh);

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

      this.scene.add(mesh);
    }

  }
}

module.exports = ThreeDimensions;
