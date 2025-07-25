/*  main.js  ──────────────────────────────────────────────────────────── */
import * as THREE from 'three';
import { GLTFLoader }        from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer }    from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }        from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass }   from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

/* ── 1. SCENE, CAMERA, RENDERER ────────────────────────────────────── */
const scene  = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0, .25, 2.2);          // camera position

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

/*  Post-processing needs correct color management  */
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping      = THREE.ACESFilmicToneMapping;

document.getElementById('navigation_tree').appendChild(renderer.domElement);

/* ── 2. ILLUMINATION ─────────────────────────────────────────── */


RectAreaLightUniformsLib.init();

/*  light area, color #00B8FF  */
const key = new THREE.RectAreaLight(0x00B8FF, 10, 5, 5);   // (color, intensity, width, height)
key.position.set(0, 7, 0);      // light area position
key.rotation.x = -Math.PI / 2;   // points downward
scene.add(key);

/* ── 3. COMPOSER + BLOOM ───────────────────────────────────────────── */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.0,     // strength  (0.8‑2.0)
    0.7,     // radius
    0.85     // threshold
);
composer.addPass(bloomPass);

/* ── 4. LOAD MODEL GLTF ──────────────────────────────────────── */

let model;
const loader = new GLTFLoader();
loader.load(
    '/docs/assets/model/platforms.gltf',
    (gltf) => {
        model = gltf.scene;
        scene.add(model);
    },
    undefined,
    (err)  => { console.error(err); }
);


/* ── 5. LOOP ───────────────────────────────────────────────────────── */

let end_angle = 157;
let actual_angle = end_angle;

function animate() {
    requestAnimationFrame(animate);

    if (model) {
        if (end_angle != actual_angle) {
            actual_angle = (end_angle > actual_angle) ? actual_angle += 1 : actual_angle -= 1;
        }
        model.rotation.y = actual_angle/100;
    }
    composer.render();
}
animate();

document.querySelector(".L").addEventListener("click", ()=>{end_angle += 45;})
document.querySelector(".R").addEventListener("click", ()=>{end_angle -= 45;})