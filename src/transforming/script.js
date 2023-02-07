import * as THREE from 'three';

const canvas = document.querySelector('.webgl');

const scene = new THREE.Scene();

const sizes = {
    width:800,
    height: 600
}

// Objects

const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0xff0000})
)

cube1.position.x = -2;

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0x00ff00})
)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0x0000ff})
)

cube3.position.x = 2;

group.add(cube1, cube2, cube3);

group.position.y = 1;
group.scale.y = 2;
group.rotation.z = Math.PI * 0.25;
// Camera
const camera = new THREE.PerspectiveCamera(75,sizes.width / sizes.height);
camera.position.z = 3;

// camera.lookAt(cubeMesh.position);

scene.add(camera);

canvas.height = sizes.height;
canvas.width = sizes.width;

//Axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.render(scene, camera);