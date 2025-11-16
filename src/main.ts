import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// --- SCENE ---
const scene = new THREE.Scene();

// --- CAMERA ---
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 12; // reculé pour voir le torus + rectangle

// --- RENDERER ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- ORBIT CONTROLS (OrbitControls) ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = true;

// --- RECTANGLE (Mesh) ---
const rectangleGeometry = new THREE.BoxGeometry(5, 10, 5);
// const rectangleMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const rectangleMaterial = new THREE.MeshStandardMaterial({
    color: 0x00aa00,
    metalness: 0.2,
    roughness: 0.5,
    side: THREE.DoubleSide,
});
const rectangle = new THREE.Mesh(rectangleGeometry, rectangleMaterial);
rectangle.rotation.x = -Math.PI / 6;
scene.add(rectangle);

// --- TORUS (TorusGeometry + Mesh) ---
// Paramètres fournis : radius, tubeRadius, radialSegments, tubularSegments
{
    const radius = 7.5;           // rayon principal (distance du centre du tore au centre du tube)
    const tubeRadius = 2.0;       // rayon du tube (épaisseur du tore)
    const radialSegments = 30;    // divisions autour du cercle principal
    const tubularSegments = 100;  // divisions autour du tube

    // Nom technique : THREE.TorusGeometry
    const torusGeometry = new THREE.TorusGeometry(
        radius,
        tubeRadius,
        radialSegments,
        tubularSegments
    );

    // Utiliser un matériau réaliste pour mieux voir la forme : MeshStandardMaterial
    // Nom technique : THREE.MeshStandardMaterial
    const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0x3366ff,
        metalness: 0.2,
        roughness: 0.5,
        side: THREE.DoubleSide,
    });

    // Nom technique : THREE.Mesh (objet de rendu combinant Geometry + Material)
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);

    // Centrer le torus sur l'origine (par défaut il est centré) pour entourer le rectangle
    torus.position.set(0, 0, 0);

    // Si besoin, on peut légèrement tourner le torus pour un meilleur rendu visuel
    torus.rotation.x = Math.PI / 6;

    scene.add(torus);
}

// --- LUMIÈRES (nécessaires pour MeshStandardMaterial) ---
// Nom technique : THREE.AmbientLight, THREE.DirectionalLight
const ambient = new THREE.AmbientLight(0xffffff, 0.4); // éclairage global doux
scene.add(ambient);

const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(5, 10, 7.5);
scene.add(dir);

// --- (Optionnel) arêtes du rectangle pour bien voir les coins ---
// Nom technique : THREE.EdgesGeometry + THREE.LineSegments
{
    const edges = new THREE.EdgesGeometry(rectangleGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const edgeLines = new THREE.LineSegments(edges, lineMaterial);
    rectangle.add(edgeLines); // edges suivent le rectangle
}

// --- RENDER LOOP (plus d'animation sur le rectangle) ---
function render() {
    controls.update(); // nécessaire si enableDamping = true
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(render);

// --- RESPONSIVE ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
