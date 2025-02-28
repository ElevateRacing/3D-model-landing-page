// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const container = document.getElementById('canvas-container');
const leftText = document.getElementById('left-text');
const rightText = document.getElementById('right-text');
const topText = document.getElementById('top-text');
const bottomText = document.getElementById('bottom-text');
const logo = document.getElementById('logo');
const wrapper = document.getElementById('wrapper');

// Initial renderer size
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0xffffff, 1); // White background
renderer.autoClear = true;
container.appendChild(renderer.domElement);

// Add balanced lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight1.position.set(5, 10, 5);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight2.position.set(-5, 5, -5);
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight3.position.set(0, -5, 5);
scene.add(directionalLight3);

const pointLight = new THREE.PointLight(0xffffff, 0.3, 50);
pointLight.position.set(0, 5, 5);
scene.add(pointLight);

// Load the 3MF file (replacing OBJLoader with ThreeMFLoader)
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js'; // Add this import

const loader = new ThreeMFLoader();
loader.load(
    'Mono.3mf', // Update to your .3mf file name
    (object) => {
        object.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xb0b0b0,
                    metalness: 0.9,
                    roughness: 0.3
                });
            }
        });

        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        object.scale.set(scale, scale, scale);
        object.position.sub(center.multiplyScalar(scale));

        scene.add(object);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
        console.error('An error occurred loading the 3MF:', error);
    }
);

// Position camera
camera.position.z = 5;

// Add OrbitControls for interaction
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 2;
controls.maxDistance = 10;

// Handle resize based on surrounding elements
function resizeRenderer() {
    const totalWidth = wrapper.clientWidth;
    const leftWidth = leftText ? leftText.offsetWidth : 0;
    const rightWidth = rightText ? rightText.offsetWidth : 0;
    const canvasWidth = totalWidth - leftWidth - rightWidth;

    // Update renderer and camera
    renderer.setSize(canvasWidth, container.clientHeight);
    camera.aspect = canvasWidth / container.clientHeight;
    camera.updateProjectionMatrix();
}

// Initial resize and listen for changes
resizeRenderer();
window.addEventListener('resize', resizeRenderer);

// Watch for content changes in all text/logo elements
const observer = new MutationObserver(resizeRenderer);
[logo, topText, leftText, rightText, bottomText].forEach(element => {
    if (element) observer.observe(element, { childList: true, subtree: true, characterData: true });
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.clear();
    renderer.render(scene, camera);
}
animate();