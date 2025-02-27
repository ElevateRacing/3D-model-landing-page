// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Aspect ratio set later
const renderer = new THREE.WebGLRenderer();
const container = document.getElementById('canvas-container');

// Adjust renderer size to container
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add lighting (improved setup)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Slightly brighter soft light
scene.add(ambientLight);

// Fixed directional light (simulates a sun-like source)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Brighter direct light
directionalLight.position.set(5, 10, 7.5); // Fixed position above and to the side
directionalLight.target = new THREE.Object3D(); // Create a target for the light
directionalLight.target.position.set(0, 0, 0); // Point it at the origin (center of object)
scene.add(directionalLight);
scene.add(directionalLight.target); // Add target to scene

// Load the OBJ file
const loader = new THREE.OBJLoader();
loader.load(
    'FreeCad_98.obj', // Replace with your OBJ file's name
    (object) => {
        // Apply a basic material if no material is provided
        object.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Green color
            }
        });

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim; // Adjust scale to fit nicely
        object.scale.set(scale, scale, scale);
        object.position.sub(center.multiplyScalar(scale)); // Center it

        scene.add(object);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded'); // Progress
    },
    (error) => {
        console.error('An error occurred loading the OBJ:', error);
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

// Handle window resize
function resizeRenderer() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', resizeRenderer);
resizeRenderer(); // Initial call

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls
    renderer.render(scene, camera);
}
animate();