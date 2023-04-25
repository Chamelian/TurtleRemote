var RAWheading = await fetch("./heading.json").then((response) => {return response.text()})
var RAWcoords = await fetch("./coords.json").then((response) => {return response.text()})
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js"
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

var heading = RAWheading.split('"')[1].split('')
var coords = JSON.parse(RAWcoords)
var fuel_level
var turtle_pos = Object.keys(coords).find(key => coords[key] === 'Self')
var turtle_pos_temp = turtle_pos.split(',')
turtle_pos = []
for (let i=0; i < turtle_pos_temp.length; i++) {
  turtle_pos.push(parseInt(turtle_pos_temp[i]))
}
// Pre-Loaders
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xffffff)
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement)
const geometry = new THREE.BoxGeometry();
const WireGeo = new THREE.EdgesGeometry(geometry)
camera.position.set(parseInt(turtle_pos[0])+1,parseInt(turtle_pos[1])+1,parseInt(turtle_pos[2])+1)
// swicth target to turtle
controls.target.set(parseInt(turtle_pos[0]),parseInt(turtle_pos[1]),parseInt(turtle_pos[2]))
controls.update()
blockdata()
renderArrow()

// Cube-Data relations function
// Write new blocks here
function blockdata() {
  for (let coord in coords) {
    if (coords[coord] == 'minecraft:dirt') {
      var color = 0x4d442c
    } else if (coords[coord] == 'minecraft:stone') {
      var color = 0x303138
    } else if (coords[coord] == "minecraft:grass_block") {
      var color = 0x30ad25
    } else if (coords[coord] == 'Self') {
      var color = 'red'
    } else {
      var color = 'purple'
    }
    let pos = coord.split(',')
    createCube(geometry, color, pos[0],pos[1],pos[2])
  }
}

// Arrow rendering function
function renderArrow() {
  if (heading[1] == 'x') {
    if (heading[0] == '+') {
      createArrow(turtle_pos[0], turtle_pos[1], turtle_pos[2], 0xffff00, 1,0,0)
    } else if (heading[0] == '-') {
      createArrow(turtle_pos[0], turtle_pos[1], turtle_pos[2], 0xffff00, -1,0,0)
    }
  } else if (heading[1] == 'z') {
    if (heading[0] == '+') {
      createArrow(turtle_pos[0], turtle_pos[1], turtle_pos[2], 0xffff00, 0,0,1)
    } else if (heading[0] == '-') {
      createArrow(turtle_pos[0], turtle_pos[1], turtle_pos[2], 0xffff00, 0,0,-1)
    }
  }
}

// Arrow creation function
function createArrow(posX,posY,posZ, color, dirX,dirY,dirZ) {
  const dir = new THREE.Vector3(dirX,dirY,dirZ)
  dir.normalize()
  const position = new THREE.Vector3(posX,posY,posZ)
  const arrowHelper = new THREE.ArrowHelper(dir, position, 1, color, 1, .5)
  arrowHelper.name = 'ArrowHelper'
  scene.add(arrowHelper)
}

// Data updater function
function updater() {
  var InitialCoords = eval(JSON.stringify(RAWcoords))
  setInterval(function () {
    fetch('./coords.json').then(function (response) {
      return response.text()
    }).then(function (data) {
      if (data != InitialCoords) {
        scene.remove.apply(scene, scene.children)
        geometry.dispose()
        coords = JSON.parse(data.valueOf())
        // get turtle position from fetch data and re-render arrow
        turtle_pos = Object.keys(coords).find(key => coords[key] === 'Self')
        turtle_pos_temp = turtle_pos.split(',')
        turtle_pos = []
        for (let i=0; i < turtle_pos_temp.length; i++) {
          turtle_pos.push(parseInt(turtle_pos_temp[i]))
        }

        renderArrow()
        blockdata()
        render()

        InitialCoords = data.valueOf()
      }
    }).catch(function (error) {
      console.log(error)
    })
    fetch('./heading.json').then(function (response) {
      return response.text()
    }).then(function (data) {
      if (data != heading) {
        scene.remove(scene.getObjectByProperty('name', 'ArrowHelper'))
        geometry.dispose()
        heading = data.split('"')[1].split('')

        renderArrow()
        render()
      }
    }).catch(function (error) {
      console.log(error)
    })
    fetch('./fuelLevel.json').then(function (response) {
      return response.text()
    }).then(function (data) {
      fuel_level = data
    }).catch(function (error) {
      console.log(error)
    })
    document.getElementById('coords').innerHTML = turtle_pos + ' ' + heading + ' ' + fuel_level
  }, 1 * 1000)
}

// Cube creation function
function createCube(geometry, color, x,y,z) {
  const material = new THREE.MeshBasicMaterial({
    color: color,
    opacity: .5,
    transparent: true,
  })
  const WireMat = new THREE.LineBasicMaterial({
    color:color,
    opacity: 1,
    transparent: true,
  })
  const cube = new THREE.Mesh(geometry, material)
  const wireframe = new THREE.LineSegments(WireGeo, WireMat)

  scene.add(cube)
  scene.add(wireframe)
  cube.position.set(x,y,z)
  wireframe.position.set(x,y,z)

  return cube
}

function render() {
  controls.target.set(parseInt(turtle_pos[0]),parseInt(turtle_pos[1]),parseInt(turtle_pos[2]))
  renderer.render(scene, camera);
};

render()

controls.addEventListener('change', render)

updater()