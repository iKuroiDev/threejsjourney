import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

// Define canvas object
const canvas = document.querySelector('.webgl');

// Debug UI
const gui = new GUI();

// Define window size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Textures
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/particles/8.png');

// Scene
const scene = new THREE.Scene();

// Objects - geometries

const particlesGeometry = new THREE.SphereGeometry(1,32,32);

// const cube = new THREE.Mesh(new THREE.BoxGeometry, new THREE.MeshBasicMaterial());
// scene.add(cube)
// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.2,
    sizeAttenuation: true,
    color: 'yellow',
    transparent: true,
    alphaMap: particleTexture,
    // alphaTest: 0.01,
    // depthTest: false
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,

    
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
// scene.add(particles)

// Custom Geometry
const customGeometry = new THREE.BufferGeometry();
const count = 20000;

const colors = new Float32Array(count * 3);
const positionsArray = new Float32Array(count * 3 );

for (let i = 0; i < count *3 ; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
}


const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
customGeometry.setAttribute('position', positionsAttribute);
customGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
const customMesh = new THREE.Points(customGeometry, particlesMaterial);
scene.add(customMesh)


// Camera
const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height);
camera.position.z = 3;
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
    // customMesh.rotation.y = elapsedTime * 0.2;
    for ( let i = 0; i<count; i++) {
        const i3 = i * 3;

        const x = customGeometry.attributes.position.array[i3];
        customGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
    }

    customGeometry.attributes.position.needsUpdate = true;

    controls.update();
    // Update renderer
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}

tick();