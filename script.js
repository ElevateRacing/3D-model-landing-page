// script.js
const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Restrict zoom
controls.minDistance = 5; // Minimum zoom distance
controls.maxDistance = 20; // Maximum zoom distance

const loader = new THREE.OBJLoader();
loader.load('FreeCad_98.obj', function (object) {
    scene.add(object);
    const boundingBox = new THREE.Box3().setFromObject(object);
    const center = boundingBox.getCenter(new THREE.Vector3());
    object.position.sub(center);
    camera.position.z = boundingBox.getSize(new THREE.Vector3()).length() * 1.5;
    controls.update();
});

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', onWindowResize, false);

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
