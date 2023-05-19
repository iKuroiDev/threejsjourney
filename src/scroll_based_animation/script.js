import * as THREE from 'three';
import gsap from 'gsap';
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

const parameters = {
    materialColor: '#96c5fe'
}

gui.addColor(parameters, "materialColor").onChange(() => {
    material.color.set(parameters.materialColor);
    particlesMaterial.color.set(parameters.materialColor)
});

// Texture loader
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("../gradients/3.jpg")
gradientTexture.magFilter = THREE.NearestFilter;

const particleTexture = textureLoader.load('../particles/9.png');


// Scene
const scene = new THREE.Scene();

// Materials
const material = new THREE.MeshToonMaterial({ color: parameters.materialColor, gradientMap: gradientTexture} );

// Objects - geometries
const objectDistance = 4;

const torusMesh = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)

const coneMesh = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)

coneMesh.position

const torusKnotMesh = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

torusMesh.position.y = -objectDistance * 0;
coneMesh.position.y = - objectDistance * 1;
torusKnotMesh.position.y = - objectDistance * 2;

torusMesh.position.x = 2;
coneMesh.position.x = -2
torusKnotMesh.position.x = 2;

scene.add(torusKnotMesh, torusMesh, coneMesh)

const sectionMeshes = [torusMesh, coneMesh, torusKnotMesh]

// Particles
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for(let i =0; i < particlesCount; i++) {
    positions[i*3+0] = (Math.random() - 0.5) * 10;
    positions[i*3+1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionMeshes.length;
    positions[i*3+2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.3,
    alphaMap: particleTexture,
    transparent: true
})

const particles = new THREE.Points(particlesGeometry,particlesMaterial)

scene.add(particles);

// Lights

const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
directionalLight.position.set(1,1,0);
scene.add(directionalLight);

// Camera

const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height);
camera.position.z = 4;
cameraGroup.add(camera);


// Update render on screen resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
})

// Renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas, alpha:true});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// Loop function
const clock = new THREE.Clock();
let previousTime = 0

// Scroll

let scrollY = window.scrollY
let currentSection = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    const newSection = Math.round(scrollY / sizes.height);
    if(newSection != currentSection) {
        currentSection = newSection;

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3', 
            }
            
        )
    }
})

// Cursor
const cursor = {}
cursor.x = 0;
cursor.y = 0;

window.addEventListener('mousemove', (event) => {
    // divides by viewport width and height to get a value from 0 to 1
    // subtracts 0.5 from both, so it reaches positive and negative values
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
})

let tick = () => {

    //Get delta time
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    camera.position.y = - scrollY / sizes.height * objectDistance

     const parallaxX = cursor.x * 0.5;
     const parallaxY = cursor.y * 0.5;
     cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 4 * deltaTime; 
     cameraGroup.position.y += (-parallaxY - cameraGroup.position.y) * 4 * deltaTime;

    // Update Objects
    for(const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }  

    particles.rotation.y += deltaTime * 0.02;

    // Update renderer
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}

tick();