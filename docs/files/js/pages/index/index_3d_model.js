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

    /* ── 2. RESPONSIVE ─────────────────────────────────────────── */

    document.querySelector(`#${container} canvas`).style.height = "100vh"
    document.querySelector(`#${container} canvas`).style.width = "100vw"

    // Ensure the canvas does not create unwanted scrollbars
    renderer.domElement.style.display = "block";

    // --- Dynamic resize to 100vw/100vh ---
    function resizeToViewport() {
        const width  = window.innerWidth;
        const height = window.innerHeight;
        if (width < 900) camera.position.set(-.01, .3, 2.3);          // camera position

        // Set renderer size to match viewport
        renderer.setSize(width, height, false);

        // Improve sharpness without killing performance (cap at 2x)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        // Update camera aspect ratio
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    // Initial call and listener
    resizeToViewport();
    window.addEventListener("resize", resizeToViewport);
    
    /* ── 3. ILLUMINATION ─────────────────────────────────────────── */
    
    RectAreaLightUniformsLib.init();
    
    /*  light area, color #00B8FF  */
    const key = new THREE.RectAreaLight(0x00B8FF, 10, 5, 5);   // (color, intensity, width, height)
    key.position.set(0, 7, 0);      // light area position
    key.rotation.x = -Math.PI / 2;   // points downward
    scene.add(key);
    
    /* ── 4. COMPOSER + BLOOM ───────────────────────────────────────────── */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.0,     // strength  (0.8‑2.0)
        0.7,     // radius
        0.85     // threshold
    );
    composer.addPass(bloomPass);
    
    /* ── 5. LOAD MODEL GLTF ──────────────────────────────────────── */
    
    let model;
    const loader = new GLTFLoader();
    loader.load(
        // '/Portfolio/assets/model/platforms.gltf',
        '/docs/assets/model/platforms.gltf',
        (gltf) => {
            model = gltf.scene;
            scene.add(model);
        },
        undefined,
        (err)  => { console.error(err); }
    );
    
    
    /* ── 6. LOOP ───────────────────────────────────────────────────────── */
    
    let end_angle = 2244;
    let actual_angle = end_angle;
    
    function animate() {
        requestAnimationFrame(animate);
    
        if (model) {
            if (end_angle != actual_angle) {
                actual_angle = (end_angle > actual_angle) ? actual_angle += 66 : actual_angle -= 66;
                document.querySelector(`#${container} .card`).style.opacity = "0";
            }
            else document.querySelector(`#${container} .card`).style.opacity = "1";

            model.rotation.y = actual_angle/10000;
        }
        composer.render();
    }
    animate();

    /* ── 7. MOVEMENT ───────────────────────────────────────────────────────── */
    
    document.querySelector(`#${container} .L`).addEventListener("click", ()=>{
        end_angle += 4488;
        img_index = (img_index !== 0) ? img_index-1 : img_index = (imgs.length-1);

        setTimeout(() => {
            if (container === "technologies") {
                document.querySelector(`#${container} .card`).textContent = imgs[img_index][0]
                document.querySelector(`#${container} .card`).insertAdjacentHTML("beforeend", `<img src="${imgs[img_index][1]}" alt=""> <p>${imgs[img_index][2]} years of experience</p>`)
            }else if (container === "projects"){
                document.querySelector(`#${container} .card`).textContent = imgs[img_index][0]
                document.querySelector(`#${container} .card`).insertAdjacentHTML("beforeend", `<img src="${imgs[img_index][1]}" alt=""> <a href="">Explore</a>`)
            }
        }, 500);
    })
    document.querySelector(`#${container} .R`).addEventListener("click", ()=>{
        end_angle -= 4488;
        img_index = (img_index !== (imgs.length-1)) ? img_index+1 : img_index = 0;

        setTimeout(() => {
            if (container === "technologies") {
                document.querySelector(`#${container} .card`).textContent = imgs[img_index][0]
                document.querySelector(`#${container} .card`).insertAdjacentHTML("beforeend", `<img src="${imgs[img_index][1]}" alt=""> <p>${imgs[img_index][2]} years of experience</p>`)
            }else if (container === "projects"){
                document.querySelector(`#${container} .card`).textContent = imgs[img_index][0]
                document.querySelector(`#${container} .card`).insertAdjacentHTML("beforeend", `<img src="${imgs[img_index][1]}" alt=""> <a href="">Explore</a>`)
            }
        }, 500);
    })
}

// name, experience, src img
const technologies = [
    ["HTML5", "assets/img/icons/HTML5.png", 4], 
    ["CSS3", "assets/img/icons/CSS3.png", 4], 
    ["JavaScript", "assets/img/icons/JavaScript.png", 4], 
    ["PHP", "assets/img/icons/PHP.png", 3], 
    ["React", "assets/img/icons/React.png", 1], 
    ["Python", "assets/img/icons/Python.png", 1], 
    ["C++", "assets/img/icons/C++.png", 1], 
    ["MySQL", "assets/img/icons/MySQL.png", 2], 
    ["SQLite", "assets/img/icons/SQLite.png", 2], 
    ["Git", "assets/img/icons/Git.png", 2], 
    ["Github", "assets/img/icons/Github.png", 2], 
    ["Blender", "assets/img/icons/Blender.png", 2], 
    ["Adobe Illustrator", "assets/img/icons/Adobe_Illustrator.png", 5], 
    ["Adobe Photoshop", "assets/img/icons/Adobe_Photoshop.png", 1], 
    ["Adobe Premiere Pro", "assets/img/icons/Adobe_Premiere_Pro.png", 2]
]
technologies.forEach(element =>{
    element.forEach((data, index)=>{
        if (index === 1) {
            const img = new Image();
            img.src = data;
        }
    })
})

add_3d_model("technologies", technologies)
document.querySelector("#technologies .card").insertAdjacentHTML("afterbegin",
    `
        ${technologies[0][0]}
        <img src="${technologies[0][1]}" alt="">
        <p>${technologies[0][2]} years of experience</p>
    `
)

// name, src img, src project
const projects = [
    ["Movi-Grip", "assets/img/icons/Movi-Grip.png"], 
    ["Ships Game", "assets/img/icons/Ships_Game.png"], 
    ["3D model", "assets/img/icons/3D_model.png"], 
    ["Web Designs", "assets/img/icons/Web_Designs.png"], 
    ["Automatic Whatsapp", "assets/img/icons/Automatic_Whatsapp.png"], 
    ["Calculators", "assets/img/icons/Calculators.png"]
]
projects.forEach(element =>{
    element.forEach((data, index)=>{
        if (index === 1) {
            const img = new Image();
            img.src = data;
        }
    })
})

add_3d_model("projects", projects)
document.querySelector("#projects .card").insertAdjacentHTML("afterbegin",
    `
        ${projects[0][0]}
        <img src="${projects[0][1]}" alt="">
        <a href="">Explore</a>
    `
)