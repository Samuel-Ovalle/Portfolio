import {game} from "../pages/index_game_script.js";

const wait = (t) => new Promise(resolve => setTimeout(resolve, t));

const start_logic = ()=>{
    initial_animation.remove();
    document.querySelector("main").style.display = "block";
    // document.querySelector("body").style.overflowY = "visible";


    async function add_text(text, element, waiting_time) {
        const target = document.querySelector(`#${element}`);
        let current = "";

        for (let i = 0; i < text.length; i++) {
            current += text[i];
            target.innerHTML = `${current}`;
            await wait(waiting_time);
        }
        const cursor = document.querySelector(".cursor");
        setInterval(() => {
            cursor.style.visibility = (cursor.style.visibility === "hidden") ? "visible" : "hidden";
        }, 800);
    }
    
    let texts = ["Samuel Ovalle is"];
    add_text(texts[0], "my_name", 200);
    
    game();
    // game_canvas();
}

async function game_canvas (){
    const canvas = document.getElementById("back_game");
    const ctx = canvas.getContext("2d");

    const window_height = window.innerHeight;
    const window_width = window.innerWidth;

    const cell_size = window_width/25;
    const panel_cell = cell_size/2;

    canvas.height = window_height;
    canvas.width = window_width;

    class ship {
        constructor(ship, height, width, x, y, direction, status) {
            this.ship = ship;
            this.height = height;
            this.width = width;
            this.x = x;
            this.y = y;
            this.status = status;
            this.direction = direction;
        }
        move(dt){
            let dy = ["top", "bottom"]
            let dx = ["left", "right"]

            if (this.y === 1) dy = dy = ["bottom"]
            if (this.y === Math.floor(window_height/panel_cell) - 1) dy = ["top"]

            if (this.x === 1) dx = ["right"]        
            if (this.x === Math.floor(window_width/panel_cell) - 1) dx = ["left"]
            
            let directions = dy.includes(dt) ? [dt, ...dx]
            : dx.includes(dt) ? [dt, ...dy]
            : [...dy, ...dx];
            
            let option_to_turn = Math.floor(Math.random() * directions.length) + 1;
            
            switch (directions[option_to_turn-1]) {
                case "top":
                    this.y = this.y - 1;
                    this.direction = "top"
                    this.ship.style.transform = "rotate(180deg)"
                    this.ship.style.top = `${(panel_cell*this.y)-(this.height/2)}px`
                    
                    break;
                case "left":
                    this.x = this.x - 1;
                    this.direction = "left"
                    this.ship.style.transform = "rotate(90deg)"
                    this.ship.style.left = `${(panel_cell*this.x)-(this.width/2)}px`

                    break;
                case "right":
                    this.x = this.x + 1;
                    this.direction = "right"
                    this.ship.style.transform = "rotate(-90deg)"
                    this.ship.style.left = `${(panel_cell*this.x)-(this.width/2)}px`
                    
                    break;
                case "bottom":
                    this.y = this.y + 1;
                    this.direction = "bottom"
                    this.ship.style.transform = "rotate(0deg)"
                    this.ship.style.top = `${(panel_cell*this.y)-(this.height/2)}px`
                    break;
            }
        }
    }

    const update_frame = ()=>{
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#00e2e1";
        ctx.lineWidth = .6;
        for (let x = 0; x <= canvas.width; x += cell_size) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += cell_size) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }


        // ship_1.move(ship_1.direction)
        // ship_2.move(ship_2.direction)
        // ship_3.move(ship_3.direction)
        // ship_4.move(ship_4.direction)


        let height
        let width
        // x, y, width, height
        if (ship_1.direction == "top" || ship_1.direction == "bottom") {height = ship_1.height; width = ship_1.width}
        else if (ship_1.direction == "left" || ship_1.direction == "right") {height = ship_1.width; width = ship_1.height}
        ctx.fillStyle = "#00f0ff";
        ctx.fillRect((panel_cell*ship_1.x)-(ship_1.height/2), (panel_cell*ship_1.y)-(ship_1.height/2), width, height); 

        if (ship_2.direction == "top" || ship_2.direction == "bottom") {height = ship_2.height; width = ship_2.width}
        else if (ship_2.direction == "left" || ship_2.direction == "right") {height = ship_2.width; width = ship_2.height}
        ctx.fillStyle = "#ff0000";
        ctx.fillRect((panel_cell*ship_2.x)-(ship_2.height/2), (panel_cell*ship_2.y)-(ship_2.height/2), width, height);

        if (ship_3.direction == "top" || ship_3.direction == "bottom") {height = ship_3.height; width = ship_3.width}
        else if (ship_3.direction == "left" || ship_3.direction == "right") {height = ship_3.width; width = ship_3.height}
        ctx.fillStyle = "#6600ff";
        ctx.fillRect((panel_cell*ship_3.x)-(ship_3.height/2), (panel_cell*ship_3.y)-(ship_3.height/2), width, height);

        if (ship_4.direction == "top" || ship_4.direction == "bottom") {height = ship_4.height; width = ship_4.width}
        else if (ship_4.direction == "left" || ship_4.direction == "right") {height = ship_4.width; width = ship_4.height}
        ctx.fillStyle = "#ffff00";
        ctx.fillRect((panel_cell*ship_4.x)-(ship_4.height/2), (panel_cell*ship_4.y)-(ship_4.height/2), width, height);
    }

    const all_ships = document.querySelectorAll(".ship")

    let ship_1 = new ship(all_ships[0], all_ships[0].height, all_ships[0].width, 3, 3, "right", true);
    let ship_2 = new ship(all_ships[1], all_ships[1].height, all_ships[1].width, 47, 3, "left", true);
    let ship_3 = new ship(all_ships[2], all_ships[2].height, all_ships[2].width, 3, 22, "right", true);
    let ship_4 = new ship(all_ships[3], all_ships[3].height, all_ships[3].width, 47, 22, "left", true);
    
    let i = true
    update_frame()
    while(i == true){
        update_frame()
        await wait(100)
    }
}

const initial_animation = document.getElementById("initial_animation");
initial_animation.addEventListener("ended", ()=>{start_logic()});
initial_animation.addEventListener("click", ()=>{start_logic()});