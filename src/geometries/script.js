import * as THREE from 'three';
import { BufferAttribute } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 3, 3, 3),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
)

mesh.position.x = -2
mesh.rotation.z = 0.5;
scene.add(mesh)

// creating a custom geometry
// Create an empty BufferGeometry
const geometry = new THREE.BufferGeometry()

const count = 150;
const positionsArray = new Float32Array(count * 3 * 3);
for(let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = (Math.random() -0.5);
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionsAttribute);

const customMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true}));
scene.add(customMesh)

const sphereGeometry = new THREE.SphereGeometry(1);
const sphereMesh = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true}));
sphereMesh.position.x = 2;
sphereMesh.rotation.z = -0.8;
scene.add(sphereMesh);


// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 2
camera.position.y = 2
camera.position.z = 2
camera.lookAt(mesh.position)
scene.add(camera)

const controls = new OrbitControls(camera, canvas);

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
})

window.addEventListener('dblclick', () => {
    if(!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
})

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphereMesh.rotation.y = elapsedTime * 0.25;
    customMesh.rotation.x = elapsedTime * 0.25;
    mesh.rotation.y = elapsedTime * 0.25;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()