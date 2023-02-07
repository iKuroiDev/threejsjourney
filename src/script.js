import * as THREE from 'three';

const canvas = document.querySelector('.webgl');

const scene = new THREE.Scene();

const sizes = {
    width:800,
    height: 600
}

// Objects
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color: 0xff0000});
const cubeMesh = new THREE.Mesh(geometry, material);

scene.add(cubeMesh);

// Camera
const camera = new THREE.PerspectiveCamera(75,sizes.width / sizes.height);
camera.position.z = 3;
camera.position.x = 1;
scene.add(camera);

canvas.height = sizes.height;
canvas.width = sizes.width;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.render(scene, camera);