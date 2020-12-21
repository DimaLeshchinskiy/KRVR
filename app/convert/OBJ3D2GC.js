const config = require("../singleton/config");
const drillService = require('../service/drillService');
const util = require('../utill.js');

//setup in getGcode()
var drills = [];
var maxSpeed = 0;
var feed = 0;

function getMeshGeometry(file){
  let geometry = file.data.geometry.clone();
  let toRad = Math.PI / 180;

  let scale = parseFloat(file.scale);
  let angleX = parseInt(file.angleX3D) * toRad;
  let angleY = parseInt(file.angleY3D) * toRad;
  let angleZ = parseInt(file.angleZ3D) * toRad;

  geometry.rotateX(angleX);
  geometry.rotateY(angleZ);
  geometry.rotateZ(angleY);

  geometry.translate(-file.X3D, -file.Z3D, -file.Y3D);
  console.log(-file.X3D, -file.Z3D, -file.Y3D);

  geometry.scale(scale, scale, scale);

  return geometry;
}


function getSize(geometry){
  geometry.computeBoundingBox();
  let box = geometry.boundingBox;
  console.log(box.min, box.max);

  return box;
}

function getFaces(geometry){

  let downVector = new THREE.Vector3(0, -1, 0); // vector "looks down"
  let listOfFaces = [];
  let listOfVertFaces = [];
  let listOfIgnoreFaces = [];
  let faces = geometry.faces;

  for (let i = 0; i < faces.length; i++) {
    let normalVector = faces[i].normal;
    let angle = Math.abs(downVector.angleTo(normalVector));
    if(util.rad2deg(angle) > 90)
      listOfFaces.push(faces[i]);
    else if(util.rad2deg(angle) == 90)
      listOfVertFaces.push(faces[i]);
    else
      listOfIgnoreFaces.push(faces[i]);
  }

  return [listOfFaces, listOfVertFaces, listOfIgnoreFaces];

}


function getProjections(face, vertices, step){
  let projections = [];

  let vertexA = vertices[face.a];
  let vertexB = vertices[face.b];
  let vertexC = vertices[face.c];

  let v = [vertexA, vertexB, vertexC];

  let maxY = Math.max(v[0].y, v[1].y, v[2].y);
  let height = maxY - Math.min(v[0].y, v[1].y, v[2].y);
  height = Math.abs(height);

  for (let i = 0; i < height; i += step) {
    let nowY = maxY - i;
    let projection = new Projection();

    for(let j = 0; j < v.length; j++){
      let vertex = v[j];
      let next = v[(j + 1) % 3];

      let vector = new THREE.Vector3(
                                      next.x - vertex.x,
                                      next.y - vertex.y,
                                      next.z - vertex.z
                                    );
      let intersect = new Line(vertex, vector).intersectWithPlane(nowY);

      if(intersect)
        projection.push(intersect);

      if(vertex.y <= nowY)
        projection.push(new THREE.Vector3(
                                          vertex.x,
                                          nowY,
                                          vertex.z
                                        ));
      if(next.y <= nowY)
        projection.push(new THREE.Vector3(
                                          next.x,
                                          nowY,
                                          next.z
                                        ));

      //console.log(vertex, next, intersect, vector, nowY);
    }
    //console.log(projection, face.normal);
    projections.push(projection);
  }

  return projections;
}

function changeTool(){

  let maxZ = config.getDevZ();
  let touchPlateHeight = 15; //mm
  let offset = touchPlateHeight + 5;

  let code = [
    "M5",
    "G0 Z" + maxZ,
    "G0 X0 Y0",
    "M0", //waiting for tool change

    "G0 Z" + offset + " F200",
    "G91 G38.2 Z-" + offset + " F30",
    "G92 Z" + touchPlateHeight,
    "G0 Z" + maxZ,
    "M0",
    "M3"
  ];

  return code;
}

function cutHead(fromY, sizeGeometry){
  let gcode = [];
  let drill = drills[0];
  let toY = sizeGeometry.max.y;

  if(fromY <= toY)
    return gcode;

  gcode.push(`GO X${sizeGeometry.min.x} Y${sizeGeometry.min.z} Z${fromY} F${maxSpeed}`);//go to start point

  for(let y = fromY - drill.size; y > toY; y -= drill.size ){
    gcode.push(`G1 Z${y} F${feed}`); // go down to startpoint
    for(let z = sizeGeometry.min.z; z <=  sizeGeometry.max.z; z += drill.size / 2){
      gcode.push(`G1 X${sizeGeometry.max.x} F${feed}`);
      gcode.push(`G1 X${sizeGeometry.min.x} F${maxSpeed}`);
      gcode.push(`G1 Y${z + drill.size / 2} F${feed}`);
    }
    gcode.push(`GO X${sizeGeometry.min.x} Y${sizeGeometry.min.z} F${maxSpeed}`);//go to start point
  }

  gcode.push(`G1 Z${toY} F${feed}`); // go down to startpoint
  for(let z = sizeGeometry.min.z; z <=  sizeGeometry.max.z; z += drill.size / 2){
    gcode.push(`G1 X${sizeGeometry.max.x} F${feed}`);
    gcode.push(`G1 X${sizeGeometry.min.x} F${maxSpeed}`);
    gcode.push(`G1 Y${z + drill.size / 2} F${feed}`);
  }

  gcode.push(`GO Z${fromY} F${maxSpeed}`);//go up

  return gcode;
}

function cutLines(lines, fromZ, drillN){
  //console.log(lines.length == 0 || drills[drillN] == null, drillN, lines.length);
  if(lines.length == 0 || drills[drillN] == null)
    return [];

  let drill = drills[drillN];
  let tooShortLines = [];
  let gcode = [];

  if(drillN > 0)
    gcode = gcode.concat(changeTool()); // set next the biggest except first

  for(let i = 0; i < lines.length; i++){
    let p1 = lines[i].p1;
    let p2 = lines[i].p2;
    let len = Math.abs(p1.x - p2.x); //z and y are same

    //console.log(lines[i], len, drill.radius, len < drill.radius);

    if(len < drill.radius)
      tooShortLines.push(lines[i]);
    else{
      gcode.push(`GO X${p1.x} Y${p1.z} Z${fromZ} F${maxSpeed}`);//go to start point
      gcode.push(`G1 Z${p1.y} F${feed}`); //go down to start point
      gcode.push(`G1 X${p2.x} Y${p2.z} Z${p2.y} F${feed}`); //make line
      gcode.push(`G0 Z${fromZ} F${maxSpeed}`); //go up
      gcode.push(`GO X${p1.x} Y${p1.z} F${maxSpeed}`); //go back to start point
    }
  }

  return gcode.concat(cutLines(
                                tooShortLines,
                                fromZ,
                                drillN + 1
                              ));
}

function cutVericalFaces(faces, vertices, drill, fromZ){
  let gcode = [];

  for(let i = 0; i < faces.length; i++){
    let face = faces[i];
    let vertexA = vertices[face.a];
    let vertexB = vertices[face.b];
    let vertexC = vertices[face.c];

    let v = [vertexA, vertexB, vertexC];

    let maxX = Math.max(v[0].x, v[1].x, v[2].x);
    let minX = Math.min(v[0].x, v[1].x, v[2].x);
    let maxY = Math.max(v[0].y, v[1].y, v[2].y);
    let minY = Math.min(v[0].y, v[1].y, v[2].y);
    let maxZ = Math.max(v[0].z, v[1].z, v[2].z);
    let minZ = Math.min(v[0].z, v[1].z, v[2].z);

    gcode.push(`GO Z${fromZ} F${maxSpeed}`);//go to start point
    gcode.push(`GO X${minX} Y${minZ} F${maxSpeed}`);//go to start point

    for(let y = maxY - drill.size; y > minY; y -= drill.size ){
      gcode.push(`G1 Z${y} F${feed}`); // go down to startpoint
      gcode.push(`G1 X${maxY} Y${maxZ} F${feed}`);
      gcode.push(`G1 X${minX} Y${minZ} F${maxSpeed}`);
    }

    gcode.push(`G1 Z${minY} F${feed}`); // go down to startpoint
    gcode.push(`G1 X${maxY} Y${maxZ} F${feed}`);

    gcode.push(`GO Z${fromZ} F${maxSpeed}`);//go up

  }

  return gcode;

}

exports.getGcode = async function(file){
  //global
  drills = drillService.getSortedSet();
  maxSpeed = config.getMaxFeed();
  feed = config.getByKey("feed");

  console.log("Computing...");
  let geometry = getMeshGeometry(file);
  let stepY = 0.5;
  let stepZ = 1;

  if(geometry.type == "BufferGeometry")
    geometry = new THREE.Geometry().fromBufferGeometry( geometry );

  geometry.computeFaceNormals();
  console.log(geometry);

  let [faces, vertFaces, ignoreFaces] = getFaces(geometry);
  console.log(faces, vertFaces, ignoreFaces);

  let allProjections = [];
  for(let i = 0; i < faces.length; i++){
    let projections = getProjections(faces[i], geometry.vertices, stepY);
    allProjections = allProjections.concat(projections);
  }
  console.log(allProjections);

  console.log("Generating gcode...");
  let gcode = [];
  let material = file.material;
  let geometryBox = getSize(geometry);
  
  //nejdriv horni zbytecny material
  gcode = gcode.concat(changeTool()); // set the biggest
  gcode = gcode.concat(cutHead(
                                material.depth,
                                geometryBox
                             ));

  //naklonene povrchy
  let lines = [];
  for(let i = 0; i < allProjections.length; i++){
    lines = lines.concat(allProjections[i].getLines(stepZ));
  }

  gcode = gcode.concat(cutLines(
                                lines,
                                geometryBox.max.y,
                                0
                              ));

  //pote vertikalni hrany
  gcode = gcode.concat(cutVericalFaces(
                                vertFaces,
                                geometry.vertices,
                                drillService.getLongest(),
                                geometryBox.max.y
                              ));

  //pote plochu...
  //...zatim seru

  console.log("Finish");
  console.log(gcode);
  return gcode;
}

class Line{
  constructor(point, vector){
    this.vector = vector;
    this.point = point;
  }

  intersectWithLine(line){
    //xz dimension; y is same
    let v = line.vector;
    let p = this.vector;
    let A = line.point;
    let Z = this.point;

    let t = (Z.z - A.z) / v.z;

    if(0 <= t && t <= 1)
      return new THREE.Vector3(
        A.x + v.x * t,
        Z.y,
        Z.z,
      );
    else
      return null;
  }

  intersectWithPlane(height){
    let t = (height - this.point.y) / this.vector.y;

    if(0 <= t && t <= 1)
      return new THREE.Vector3(
        this.point.x + this.vector.x * t,
        this.point.y + this.vector.y * t,
        this.point.z + this.vector.z * t,
      );
    else
      return null;
  }
}

class Projection{

  constructor(){
    this.vertices = [];
  }

  isInside(vertex){
    for(let i = 0; i < this.vertices.length; i++)
      if(
        this.vertices[i].x == vertex.x &&
        this.vertices[i].y == vertex.y &&
        this.vertices[i].z == vertex.z
      )
        return true;

    return false;
  }

  push(vertex){
    if(!this.isInside(vertex))
      this.vertices.push(vertex);
  }

  getY(){
    return this.vertices[0].y;
  }

  getBox(){
    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let minZ = Number.MAX_SAFE_INTEGER;
    let maxZ = Number.MIN_SAFE_INTEGER;

    for(let i = 0; i < this.vertices.length; i++){
      minX = Math.min(this.vertices[i].x, minX);
      maxX = Math.max(this.vertices[i].x, maxX);
      minZ = Math.min(this.vertices[i].z, minZ);
      maxZ = Math.max(this.vertices[i].z, maxZ);
    }

    return [minX, maxX, minZ, maxZ];
  }

  getEdges(){
    let edges = [];

    for(let i = 0; i < this.vertices.length - 1; i++){
      for(let j = i + 1; j < this.vertices.length; j++){
        let vector = new THREE.Vector3(
          this.vertices[j].x - this.vertices[i].x,
          this.vertices[j].y - this.vertices[i].y,
          this.vertices[j].z - this.vertices[i].z,
        );
        let point = this.vertices[i];
        edges.push(new Line(point, vector));
      }
    }

    return edges;
  }

  getLines(step){
    let vector = new THREE.Vector3(1, 0, 0);
    let [minX, maxX, minZ, maxZ] = this.getBox();
    let edges = this.getEdges();
    let lines = [];

    for(let i = minZ; i < maxZ; i += step){
      let point = new THREE.Vector3(minX, this.getY(), i);
      let line = new Line(point, vector);
      let intersections = [];

      for(let j = 0; j < edges.length; j++){
        let intersection = line.intersectWithLine(edges[j]);

        if(intersection)
          intersections.push(intersection);
      }

      intersections.sort(function(vertexA, vertexB){
        if (vertexA.x > vertexB.x) return 1;
        if (vertexB.x > vertexA.x) return -1;
        return 0;
      });

      lines.push({p1: intersections[0], p2: intersections[intersections.length - 1]});
    }

    return lines;
  }

}
