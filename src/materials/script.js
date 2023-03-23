import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

const gui = new GUI();

// Textures

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader()

const colorTexture = textureLoader.load('/door/color.jpg');
const alphaTexture = textureLoader.load('/door/alpha.jpg');
const ambientOcclusionTexture = textureLoader.load('/door/ambientOcclusion.jpg');
const heightTexture = textureLoader.load('/door/height.jpg');
const metalnessTexture = textureLoader.load('/door/metalness.jpg');
const normalTexture = textureLoader.load('/door/normal.jpg');
const roughnessTexture = textureLoader.load('/door/roughness.jpg');
const matcapTexture = textureLoader.load('/matcaps/3.png');
const gradientTexture = textureLoader.load('/gradients/5.jpg');

// follows a specific order
const environmentTexture = cubeTextureLoader.load([
    '/environmentMaps/1/px.jpg',
    '/environmentMaps/1/nx.jpg',
    '/environmentMaps/1/py.jpg',
    '/environmentMaps/1/ny.jpg',
    '/environmentMaps/1/pz.jpg',
    '/environmentMaps/1/nz.jpg',
])
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;

// Define canvas object
const canvas = document.querySelector('.webgl');

// Define window size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


// Scene
const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

const pointLight = new THREE.PointLight(0xffffff, 0.5)

pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

scene.add(pointLight, ambientLight)
// Objects - geometries
// const material = new THREE.MeshBasicMaterial();
// material.transparent = true;
// material.map = colorTexture;
// material.alphaMap = alphaTexture;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// const material = new THREE.MeshToonMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color('red')
// material.gradientMap = gradientTexture;

// const material = new THREE.MeshStandardMaterial();
// material.metalness = 0.45;
// material.roughness = 0.65;
// material.map = colorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.05
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.normalScale.set(0.4,0.4);
// material.alphaMap = alphaTexture;
// material.transparent=true;

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = environmentTexture

gui.add(material, 'displacementScale').step(0.01).min(0).max(1)


gui.add(material, 'metalness')
    .min(0)
    .max(1)
    .step(0.01);

gui.add(material, 'roughness')
    .min(0)
    .max(1)
    .step(0.01);


const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    material
)

sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))

sphere.position.x = -1.5;

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1, 64, 64),
    material
);

plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    material
)

torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))

torus.position.x = 1.5;

scene.add(sphere, plane, torus);

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

    // sphere.rotation.y = elapsedTime * 0.5
    // plane.rotation.y = elapsedTime * 0.5
    // torus.rotation.y = elapsedTime * 0.5

    // sphere.rotation.x = elapsedTime * 0.2
    // plane.rotation.x = elapsedTime * 0.2
    // torus.rotation.x = elapsedTime * 0.2

    // Update renderer
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}

tick();