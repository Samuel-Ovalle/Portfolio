/*  index_3d_model.js  ──────────────────────────────────────────────────────────── */
import * as THREE from 'three';
import { GLTFLoader }        from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer }    from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }        from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass }   from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

function add_3d_model(container) {
    /* ── 1. SCENE, CAMERA, RENDERER ────────────────────────────────────── */
    const scene  = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    camera.position.set(-.01, .3, 2.1);          // camera position
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    /*  Post-processing needs correct color management  */
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping      = THREE.ACESFilmicToneMapping;
    
    document.getElementById(container).insertAdjacentHTML("afterbegin", 
        `
        <div class="card"></div>
        <div class="row L">
            <svg class="row_svg" id="row_l" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82.6 56.86">
                <polyline points="77.1 5.5 59.2 26.89 41.3 48.29 23.4 26.89 5.5 5.5" fill="none" stroke="#3fb1e6" stroke-linecap="round" stroke-miterlimit="10" stroke-width="11"/>
            </svg>
        </div>
        <div class="row R">
            <svg class="row_svg" id="row_r" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82.6 56.86">
                <polyline points="77.1 5.5 59.2 26.89 41.3 48.29 23.4 26.89 5.5 5.5" fill="none" stroke="#3fb1e6" stroke-linecap="round" stroke-miterlimit="10" stroke-width="11"/>
            </svg>
        </div>
        `
    )
    document.getElementById(container).appendChild(renderer.domElement);

    
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
    
    let end_angle = 22.5;
    let actual_angle = end_angle;
    
    function animate() {
        requestAnimationFrame(animate);
    
        if (model) {
            if (end_angle != actual_angle) {
                actual_angle = (end_angle > actual_angle) ? actual_angle += 1 : actual_angle -= 1;
                document.querySelector(`#${container} .card`).style.opacity = "0";
            }
            else document.querySelector(`#${container} .card`).style.opacity = "1";
            model.rotation.y = actual_angle/100;
        }
        composer.render();
    }
    animate();
    
    document.querySelector(`#${container} .L`).addEventListener("click", ()=>{end_angle += 45;})
    document.querySelector(`#${container} .R`).addEventListener("click", ()=>{end_angle -= 45;})
}

add_3d_model("technologies")
add_3d_model("projects")