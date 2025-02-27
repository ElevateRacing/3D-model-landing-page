// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Aspect ratio set later
const renderer = new THREE.WebGLRenderer();
const container = document.getElementById('canvas-container');

// Adjust renderer size to container
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add enhanced lighting setup
// Ambient light for base illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Soft base light
scene.add(ambientLight);

// Multiple directional lights for even coverage
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.7); // Primary light
directionalLight1.position.set(5, 10, 5); // Above and to the side
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5); // Secondary light
directionalLight2.position.set(-5, 5, -5); // Opposite direction
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3); // Fill light
directionalLight3.position.set(0, -5, 5); // From below
scene.add(directionalLight3);

// Optional: Add a point light for extra brightness
const pointLight = new THREE.PointLight(0xffffff, 0.5, 50); // Omni-directional light
pointLight.position.set(0, 5, 5); // Near the object
scene.add(pointLight);

// Load the OBJ file
const loader = new THREE.OBJLoader();
loader.load(
    'FreeCad_98.obj', // Replace with your OBJ file's name
    (object) => {
        // Apply a material with better light response
        object.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: 0x00ff00, // Green color
                    roughness: 0.7,  // Less shiny, more diffuse
                    metalness: 0.1   // Slight reflectivity
                });
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