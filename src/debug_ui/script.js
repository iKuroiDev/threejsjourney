import * as THREE from 'three';
import GUI from 'lil-gui';
import {gsap, Power4, Bounce} from 'gsap';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

// Define canvas object
const canvas = document.querySelector('.webgl');

// Define window size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Debug
const gui = new GUI();

const parameters = {
    spin: () => {
        gsap.to(cube1.rotation, { duration: 1, y: cube1.rotation.y + Math.PI * 2 })
    },
    jump: () => {
        gsap.to(cube1.position, {duration: 0.8, y: 1, ease: Power4.easeNone});
        gsap.to(cube1.position, {delay: 0.8, duration: 1, y: 0, ease: Bounce.easeOut });
    }
}

// Scene
const scene = new THREE.Scene();

// Objects - geometries
const cube1 = new THREE.Mesh(
	new THREE.BoxGeometry(1,1,1),
	new THREE.MeshBasicMaterial({color: 0xff0000})
)
scene.add(cube1); 

// debug
gui.add(cube1.position, 'x', -3, 3, 0.01);
gui.add(cube1.position, 'z', -3, 3, 0.01);

gui.add(cube1.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('elevation');

gui.add(cube1, 'visible');

gui.add(cube1.material, 'wireframe')

gui.addColor(cube1.material, 'color');

gui.add(parameters, 'spin');
gui.add(parameters, 'jump');


// Camera
const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height);
camera.position.z = 4;
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