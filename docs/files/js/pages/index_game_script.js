export const game = () => {
    async function update_frame() {
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

        ship_1.move(ship_1.direction);
        ship_2.move(ship_2.direction);
        ship_3.move(ship_3.direction);
        ship_4.move(ship_4.direction);
    }

    const canvas = document.getElementById("back_game");
    const ctx = canvas.getContext("2d");

    const window_height = window.innerHeight;
    const window_width = window.innerWidth;

    const cell_size = window_width/25;
    const panel_cell = cell_size/2;
    // x panel_cell = 50
    // y panel_cell = 24


    canvas.height = window_height;
    canvas.width = window_width;

    class ship {
        constructor(ship, height, width, x, y, direction, movement, angle, status, color) {
            this.ship = ship;
            this.height = height;
            this.width = width;
            this.x = x;
            this.y = y;
            this.direction = direction;
            this.movement = movement;
            this.angle = angle;
            this.status = status;

            this.color = color;
        }
        move(dt){
            let directions = [0, 1, 2, 3];

            if (this.movement !== 0) {
                this.movement = this.movement-1
                switch (this.direction) {
                    case 0:
                        if (this.y < 2) this.movement = 0;
                        else this.y = this.y - 1;
                        this.ship.style.top = `${(panel_cell*this.y)-(this.height/2)}px`
                        
                        break;
                    case 1:
                        if (this.x > Math.floor(window_width/panel_cell)-2) this.movement = 0;
                        else this.x = this.x + 1;
                        this.ship.style.left = `${(panel_cell*this.x)-(this.width/2)}px`
                        
                        break;
                    case 2:
                        if (this.y > Math.floor(window_height/panel_cell)-1) this.movement = 0;
                        else this.y = this.y + 1;
                        this.ship.style.top = `${(panel_cell*this.y)-(this.height/2)}px`
                        
                        break;
                    case 3:
                        if (this.x < 2) this.movement = 0;
                        else this.x = this.x - 1;
                        this.ship.style.left = `${(panel_cell*this.x)-(this.width/2)}px`

                        break;
                }
            }
            if (this.movement === 0) {
                if (dt<2) directions.splice(dt+2, 1);
                else directions.splice(dt-2, 1);

                if (this.y < 2) directions.splice(directions.indexOf(0), 1);
                if (this.x > (window_width/panel_cell) - 2) directions.splice(directions.indexOf(1), 1);
                if (this.y > (window_height/panel_cell) - 3) directions.splice(directions.indexOf(2), 1);
                if (this.x < 2) directions.splice(directions.indexOf(4), 1);

                this.movement = Math.floor(Math.random() * 4) + 2;
                this.direction = directions[Math.floor(Math.random() * directions.length)];
                let last_direction = dt;
                let actual_direction = this.direction;
                let deference = actual_direction-last_direction;
                
                if (deference === -1 || deference === 3) this.angle = this.angle - 90;
                if (deference === 1 || deference === -3) this.angle = this.angle + 90;
                this.ship.style.transform = `rotate(${this.angle}deg)`
            }

            let h 
            // x y
            let start_node = [3,3];
            let end_node = [30,15];
            let current_node = [3,3];
            
            let open_list = [
                [current_node[0]+1, current_node[1]],
                [current_node[0]-1, current_node[1]],
                [current_node[0], current_node[1]+1],
                [current_node[0], current_node[1]-1],
            ];
            let closed_list = [];
            

        }
    }

    const all_ships = document.querySelectorAll(".ship")

    let ship_1 = new ship(all_ships[0], all_ships[0].height, all_ships[0].width, 3, 3, 1, 0, -90, true, "#00f0ff");
    let ship_2 = new ship(all_ships[1], all_ships[1].height, all_ships[1].width, 47, 3, 3, 0, 90, true, "#ff0000");
    let ship_3 = new ship(all_ships[2], all_ships[2].height, all_ships[2].width, 3, 22, 1, 0, -90, true, "#6600ff");
    let ship_4 = new ship(all_ships[3], all_ships[3].height, all_ships[3].width, 47, 22, 3, 0, 90, true, "#ffff00");

    update_frame()
    setInterval(() => {update_frame()}, 100);
}

