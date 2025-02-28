import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/controls/OrbitControls.js';
import { ThreeMFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/loaders/3MFLoader.js';

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

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0xffffff, 1);
renderer.autoClear = true;
container.appendChild(renderer.domElement);

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

const loader = new ThreeMFLoader();
loader.load(
    'models/Mono.3mf',
    function (object) {
        object.scale.set(1, 1, 1);
        object.position.set(0, 0, 0);
        scene.add(object);
        console.log('Model loaded successfully!');
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error occurred:', error);
    }
);

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 2;
controls.maxDistance = 10;

function resizeRenderer() {
    const totalWidth = wrapper.clientWidth;
    const leftWidth = leftText ? leftText.offsetWidth : 0;
    const rightWidth = rightText ? rightText.offsetWidth : 0;
    const canvasWidth = totalWidth - leftWidth - rightWidth;

    renderer.setSize(canvasWidth, container.clientHeight);
    camera.aspect = canvasWidth / container.clientHeight;
    camera.updateProjectionMatrix();
}

resizeRenderer();
window.addEventListener('resize', resizeRenderer);

const observer = new MutationObserver(resizeRenderer);
[logo, topText, leftText, rightText, bottomText].forEach(element => {
    if (element) observer.observe(element, { childList: true, subtree: true, characterData: true });
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.clear();
    renderer.render(scene, camera);
}
animate();