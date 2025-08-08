import {game} from "./index_game_script.js";

const wait = (t) => new Promise(resolve => setTimeout(resolve, t));

const start_logic = ()=>{
    game();
    initial_animation.remove();
    document.querySelector("header").style.visibility = "visible";
    document.querySelector("main").style.visibility = "visible";
    document.querySelector("header").style.opacity = "1";
    document.querySelector("main").style.opacity = "1";
    document.querySelector("body").style.overflowY = "visible";

    let menu_status = false;
    const menu = document.querySelector("#mobile_nav");

    document.querySelector("#icon_menu").addEventListener("click", ()=>{
        menu.style.display = "block"
        setTimeout(()=>{menu.style.right = "0vw";},1)
        menu_status = true;
    })
    document.querySelectorAll("#mobile_nav ul li a").forEach(element => {
        element.addEventListener("click", ()=>{
            if (menu_status === true) {
                menu.style.right = "-70vw";
                setTimeout(()=>{menu.style.display = "none"}, 500)
                menu_status = false;
            }
        })
    });

    document.querySelector("main").addEventListener("click", ()=>{
        if (menu_status === true) {
            menu.style.right = "-70vw";
            setTimeout(()=>{menu.style.display = "none"}, 500)
            menu_status = false;
        }
    });

    async function add_text(element, texts){
        const target = document.querySelector(`#${element}`);

        while (true) {
            for (const text of texts) {
                for (let i = 0; i <= text.length; i++) {
                    target.textContent = text.slice(0, i);
                    await wait(200);
                }

                await wait(700);

                for (let i = text.length; i >= 0; i--) {
                    target.textContent = text.slice(0, i);
                    await wait(100);
                }

                await wait(700);
            }
        }
    }
    
    const cursor = document.querySelector(".cursor");
    setInterval(() => {cursor.style.visibility = (cursor.style.visibility === "hidden") ? "visible" : "hidden";}, 800);

    setTimeout(() => {
        let texts = ["Samuel Ovalle is", "Full-stack developer"];
        add_text("my_name", texts)
    }, 3000);
}

const initial_animation = document.getElementById("initial_animation");

window.addEventListener("load", ()=>{
    initial_animation.scrollIntoView({ behavior: "auto" });
    history.scrollRestoration = "manual";
})

initial_animation.addEventListener("ended", ()=>{start_logic()});
initial_animation.addEventListener("click", ()=>{start_logic()});