/*  index_3d_model.js  ──────────────────────────────────────────────────────────── */
import * as THREE from 'three';
import { GLTFLoader }        from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer }    from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }        from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass }   from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

function add_3d_model(container, imgs) {
    /* ── 1. SCENE, CAMERA, RENDERER ────────────────────────────────────── */
    const scene  = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-.01, .3, 2.1);          // camera position
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    /*  Post-processing needs correct color management  */
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping      = THREE.ACESFilmicToneMapping;

    let img_index = 0;
    
    document.getElementById(container).insertAdjacentHTML("afterbegin", 
        `
        <div class="card">
        </div>
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
        '/Portfolio/assets/model/platforms.gltf',
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
    
    document.querySelector(`#${container} .L`).addEventListener("click", ()=>{
        end_angle += 45;
        img_index = (img_index !== 0) ? img_index-1 : img_index = (imgs.length-1);

        setTimeout(() => {
            if (container === "technologies") {
                document.querySelector(`#${container} .card`).textContent = imgs[img_index][0].replace(/_/g, " ");
                document.querySelector(`#${container} .card`).insertAdjacentHTML("beforeend", `<img src="assets/img/icons/${imgs[img_index][0]}.png" alt=""> <p>${imgs[img_index][1]} years of experience</p>`)
            }else if (container === "projects"){
                document.querySelector(`#${container} .card`).textContent = imgs[img_index].replace(/_/g, " ");
                document.querySelector(`#${container} .card`).insertAdjacentHTML("beforeend", `<img src="assets/img/icons/${imgs[img_index]}.png" alt=""> <a href="">Explore</a>`)
            }
        }, 500);
    })
    document.querySelector(`#${container} .R`).addEventListener("click", ()=>{
        end_angle -= 45;
        img_index = (img_index !== (imgs.length-1)) ? img_index+1 : img_index = 0;

        setTimeout(() => {
            if (container === "technologies") {
                document.querySelector(`#${container} .card`).textContent = imgs[img_index][0].replace(/_/g, " ");
                document.querySelector(`#${container} .card`).insertAdjacentHTML("beforeend", `<img src="assets/img/icons/${imgs[img_index][0]}.png" alt=""> <p>${imgs[img_index][1]} years of experience</p>`)
            }else if (container === "projects"){
                document.querySelector(`#${container} .card`).textContent = imgs[img_index].replace(/_/g, " ");
                document.querySelector(`#${container} .card`).insertAdjacentHTML("beforeend", `<img src="assets/img/icons/${imgs[img_index]}.png" alt=""> <a href="">Explore</a>`)
            }
        }, 500);
    })
}

let technologies = [["HTML5", 4], ["CSS3", 4], ["JavaScript", 4], ["PHP", 3], ["React", 1], ["Python", 1], ["C++ (CPlusPlus)", 1], ["MySQL", 2], ["SQLite", 2], ["Git", 2], ["Github", 2], ["Blender", 2], ["Adobe_Illustrator", 5], ["Adobe_Photoshop", 1], ["Adobe_Premiere_Pro", 2]]
add_3d_model("technologies", technologies)
document.querySelector("#technologies .card").insertAdjacentHTML("afterbegin",
    `
        ${technologies[0][0].replace(/_/g, " ")}
        <img src="assets/img/icons/${technologies[0][0]}.png" alt="">
        <p>${technologies[0][1]} years of experience</p>
    `
)

let projects = ["Movi-Grip", "Ships_Game", "3D_model", "Web_Designs", "Automatic_Whatsapp", "Calculators"]
add_3d_model("projects", projects)
document.querySelector("#projects .card").insertAdjacentHTML("afterbegin",
    `
        ${projects[0].replace(/_/g, " ")}
        <img src="assets/img/icons/${projects[0]}.png" alt="">
        <a href="">Explore</a>
    `
)