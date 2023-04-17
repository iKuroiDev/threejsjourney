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

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()


const doorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAoTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');

const brickTexture = textureLoader.load('/textures/bricks/color.jpg');
const brickAoTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg');
const brickNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const brickRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg');

const grassTexture = textureLoader.load('/textures/grass/color.jpg');
const grassAoTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg');
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg');

grassTexture.repeat.set(8,8);
grassAoTexture.repeat.set(8,8);
grassNormalTexture.repeat.set(8,8);
grassRoughnessTexture.repeat.set(8,8);

grassTexture.wrapS = THREE.RepeatWrapping;
grassAoTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassTexture.wrapT = THREE.RepeatWrapping;
grassAoTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
// Scene
const scene = new THREE.Scene();


// Fog
const fog = new THREE.Fog('#262837', 1, 15);
scene.fog = fog


/**
 * House
 */
const houseGroup = new THREE.Group();
scene.add(houseGroup);

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: brickTexture,
        aoMap: brickAoTexture,
        normalMap: brickNormalTexture,
        roughnessMap: brickRoughnessTexture
     })
)

walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = 1.25;

houseGroup.add(walls);

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({color: '#b35f45'})
)

roof.position.y = 2.5 + 0.75;
roof.rotation.y = Math.PI *0.25

houseGroup.add(roof);

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAoTexture,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture,
        normalMap: doorNormalTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1

    })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.y = 1;
door.position.z = 2.01;

houseGroup.add(door)

//Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({color: '#89c854'})
    
const bush1 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush1.scale.set(0.5,0.5,0.5);
bush1.position.set(1,0.2,2.2)

const bush2 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush2.scale.set(0.25,0.25,0.25);
bush2.position.set(1.5,0.1,2.1)

const bush3 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush3.scale.set(0.4,0.4,0.4);
bush3.position.set(-0.8,0.1,2.2)

const bush4 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
)
bush4.scale.set(0.2,0.2,0.2);
bush4.position.set(-1.1,0.05,2.4)

houseGroup.add(bush1, bush2, bush3, bush4)

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({color: '#b2b6b1'});

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const grave = new THREE.Mesh(
        graveGeometry, graveMaterial
    )

    grave.position.set(x, 0.3, z)
    grave.rotation.y = (Math.random() - 0.5) * 0.8;
    grave.rotation.z = (Math.random() - 0.5) * 0.4;

    grave.castShadow = true;

    graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map: grassTexture,
        roughnessMap: grassRoughnessTexture,
        normalMap: grassNormalTexture,
        aoMap: grassAoTexture
     })
)

floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door Light
const doorLight = new THREE.PointLight('#ff7d46', 1,7);
doorLight.position.set(0,2.2,2.7);
houseGroup.add(doorLight)

// Ghosts
const ghost1 = new THREE.PointLight('#ff00ff', 2 , 3);
const ghost2 = new THREE.PointLight('#00ffff', 2 , 3);
const ghost3 = new THREE.PointLight('#00ff00', 2 , 3);

scene.add(ghost1, ghost2, ghost3)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true;

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
renderer.shadowMap.enabled = true;

renderer.setClearColor('#262837');
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;
floor.receiveShadow = true;

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7;

// Loop function
const clock = new THREE.Clock();

let tick = () => {

    //Get delta time
    const elapsedTime = clock.getElapsedTime();

    // Update ghost
    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.z = Math.sin(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(elapsedTime * 3)

    // Update Objects
    const ghost2Angle = - elapsedTime * 0.32;
    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = - elapsedTime * 0.18;
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    // Update Objects

    // Update renderer
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}

tick();