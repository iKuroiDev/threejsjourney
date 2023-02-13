import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

// Define canvas object
const canvas = document.querySelector('.webgl');

// Define window size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


// Scene
const scene = new THREE.scene();

// Objects - geometries

// Camera
const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height);
camera.position.z = 2;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);

// Update render on screen resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
})

// Renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// Loop function
const clock = new THREE.Clock();

let tick = () => {

    //Get delta time
    const elapsedTime = clock.getElapsedTime();

    // Update Objects

    // Update renderer
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}

tick();

