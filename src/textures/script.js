import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

// Textures
const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => console.log('load');
loadingManager.onProgress = () => console.log('progress');
loadingManager.onError = () => console.log('error');

const textureLoader = new THREE.TextureLoader(loadingManager);
const checkerTexture = textureLoader.load('/minecraft.png')
const colorTexture = textureLoader.load('/door/color.jpg');
const alphaTexture = textureLoader.load('/door/alpha.jpg');
const heightTexture = textureLoader.load('/door/height.jpg');
const normalTexture = textureLoader.load('/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('/door/ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/door/roughness.jpg');

checkerTexture.magFilter = THREE.NearestFilter;

// Define canvas object
const canvas = document.querySelector('.webgl');

// Define window size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


// Scene
const scene = new THREE.Scene();

// Objects - geometries
const cube1 = new THREE.Mesh(
	new THREE.BoxGeometry(1,1,1),
	new THREE.MeshBasicMaterial({map: checkerTexture})
)
const cube2 = new THREE.Mesh(
	new THREE.BoxGeometry(1,1,1),
	new THREE.MeshBasicMaterial({map: colorTexture})
)

cube1.position.x = -1;
cube2.position.x = 1;
scene.add(cube1, cube2);

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