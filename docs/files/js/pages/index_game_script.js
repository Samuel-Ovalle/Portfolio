export const game = () => {
    const wait = (t) => new Promise(resolve => setTimeout(resolve, t));

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

        ctx.fillStyle = "#00f0ff";
        ctx.fillRect((panel_cell*ship_1.x)-(ship_1.height/2), (panel_cell*ship_1.y)-(ship_1.height/2), 10, 10); 
        ctx.fillStyle = "#ff0000";
        ctx.fillRect((panel_cell*ship_2.x)-(ship_2.height/2), (panel_cell*ship_2.y)-(ship_2.height/2), 10, 10);
        ctx.fillStyle = "#6600ff";
        ctx.fillRect((panel_cell*ship_3.x)-(ship_3.height/2), (panel_cell*ship_3.y)-(ship_3.height/2), 10, 10);
        ctx.fillStyle = "#ffff00";
        ctx.fillRect((panel_cell*ship_4.x)-(ship_4.height/2), (panel_cell*ship_4.y)-(ship_4.height/2), 10, 10);

    }

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
        
    }

    const all_ships = document.querySelectorAll(".ship")

    let ship_1 = new ship(all_ships[0], all_ships[0].height, all_ships[0].width, 3, 3, "right", true);
    let ship_2 = new ship(all_ships[1], all_ships[1].height, all_ships[1].width, 47, 3, "left", true);
    let ship_3 = new ship(all_ships[2], all_ships[2].height, all_ships[2].width, 3, 22, "right", true);
    let ship_4 = new ship(all_ships[3], all_ships[3].height, all_ships[3].width, 47, 22, "left", true);

    setInterval(() => {
        update_frame()
    }, 100);
}

