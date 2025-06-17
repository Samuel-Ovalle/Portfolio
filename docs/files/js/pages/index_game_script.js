export const game = () => {
    const wait = (t) => new Promise(resolve => setTimeout(resolve, t));

    async function update_frame() {
        
    }

    const canvas = document.getElementById("back_game");
    const ctx = canvas.getContext("2d");

    const window_height = window.innerHeight;
    const window_width = window.innerWidth;

    const cell_size = window_width/25;
    const panel_cell = cell_size/2;

    canvas.height = window_height;
    canvas.width = window_width;

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

    // class ship {
    //     constructor(ship, height, width, x, y, direction, status) {
    //         this.ship = ship;
    //         this.height = height;
    //         this.width = width;
    //         this.x = x;
    //         this.y = y;
    //         this.status = status;
    //         this.direction = direction;
    //     }
    // }

    // const all_ships = document.querySelectorAll(".ship")

    // let ship_1 = new ship(all_ships[0], all_ships[0].height, all_ships[0].width, 3, 3, "right", true);
    // let ship_2 = new ship(all_ships[1], all_ships[1].height, all_ships[1].width, 47, 3, "left", true);
    // let ship_3 = new ship(all_ships[2], all_ships[2].height, all_ships[2].width, 3, 22, "right", true);
    // let ship_4 = new ship(all_ships[3], all_ships[3].height, all_ships[3].width, 47, 22, "left", true);
}

