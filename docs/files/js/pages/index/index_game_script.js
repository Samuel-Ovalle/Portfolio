export const game = () => {
    class ship {
        constructor(ship, angle, direction, status, color, index) {
            this.ship = ship;
            this.angle = angle;
            this.direction = direction;
            this.status = status;
            this.color = color;
            this.index = index;

            this.height = cell_size*1.4;
            this.ship.style.height = `${this.height}px`;
            this.width = this.ship.width;
            switch (index) {
                case 1:
                    this.x = 3;
                    this.y = 4;
                    this.end_node = [this.x+2, this.y];
                    break;
                case 2:
                    this.x = map_width-3;
                    this.y = 4;
                    this.end_node = [this.x-2, this.y];
                    break;
                case 3:
                    this.x = 3;
                    this.y = map_height-4;
                    this.end_node = [this.x+6, this.y];
                    break;
                case 4:
                    this.x = map_width-3;
                    this.y = map_height-4;
                    this.end_node = [this.x-6, this.y];
                    break;
            }
            
            this.movement_map = [];
            this.movement_index = 0;
            
            this.movement_history = [];
            this.movement_history_index = 0;
            
            this.start_position = [this.x, this.y];
            this.start_node = [];
        }
        start_ship(){
            this.ship.style.left = `${(this.x*panel_cell)-(this.width/2)}px`
            this.ship.style.top = `${(this.y*panel_cell)-(this.height/2)}px`
            setTimeout(() => {this.ship.style.transition = "all .3s ease"}, 1000);
        }
        update_movement(){
            this.movement_map = [];
            this.movement_index = 0;

            // unidirectional unit vector (UUV)
            const UUV = (x, y) => [
                node(x, y-1),
                node(x+1, y),
                node(x, y+1),
                node(x-1, y)
            ];
            const node = (x, y)=>{
                let cost_g = Math.abs(x-this.start_node[0])+Math.abs(y-this.start_node[1]);
                let cost_h = Math.abs(x-this.end_node[0])+Math.abs(y-this.end_node[1]);
                let cost_f = cost_g + cost_h;
                let index = node_index_counter++;
                let father = 0;
                let node = {x, y, cost_g, cost_h, cost_f, index, father};
                return node;
            }

            this.start_node = [this.x, this.y];
            let open_list = [];
            let closed_list = [];
            let node_index_counter = 0;
            let movement_counter = 0;

            open_list.push(node(this.start_node[0], this.start_node[1]));
            open_list[0].cost_f = 0;
            while (open_list.length > 0 || movement_counter < 3) {
                movement_counter++
                if (open_list.length == 0) {
                    this.status = false;
                    this.ship.remove();
                    break;
                }

                let current_node = open_list.reduce((best, current)=> current.cost_f < best.cost_f ? current : best);
                let current_node_index = open_list.findIndex(n => n === current_node);

                open_list.splice(current_node_index, 1);
                closed_list.push(current_node);
                
                if (current_node.x === this.end_node[0] && current_node.y === this.end_node[1]) {
                    this.end_node = [Math.floor(Math.random() * (map_width-1))+1, Math.floor(Math.random() * (map_height-1))+1];
                    break
                }else{
                    let neighbor = UUV(current_node.x, current_node.y).filter(e =>
                        e.x >= 0 && e.x < map_width &&
                        e.y >= 0 && e.y < map_height &&
                        map[e.y][e.x] !== 1
                    );

                    for (const element of neighbor) {
                        if (closed_list.some(o=> o.x === element.x && o.y === element.y)) {
                        } else {
                            element.cost_g = current_node.cost_g + (Math.abs(element.x-current_node.x)+Math.abs(element.y-current_node.y));
                            element.cost_f = element.cost_g + element.cost_h;
                            element.father = current_node.index;

                            const match = open_list.find(o => o.x === element.x && o.y === element.y);

                            if (match) {
                                if (element.cost_g < match.cost_g) {
                                    match.cost_g = element.cost_g;
                                    match.cost_f = match.cost_g + match.cost_h;
                                }
                            } else if (map[element.y][element.x] === 0) open_list.push(element)
                        }
                    }
                }
            }

            let current_target = closed_list[closed_list.length-1];
            let last_target;
            while (current_target.index !== 0) {
                last_target = current_target;
                current_target = closed_list.find(obj => obj.index === current_target.father);

                let movement = [last_target.x-current_target.x, last_target.y-current_target.y];

                if (movement[1]==-1) this.movement_map.push(0);
                if (movement[0]==1) this.movement_map.push(1);
                if (movement[1]==1) this.movement_map.push(2);
                if (movement[0]==-1) this.movement_map.push(3);
            }

            this.movement_map.reverse();
            let current_value = this.movement_map[0];
            let count = 0;
            
            for (const n of this.movement_map) {
                if (n === current_value) count++;                        // still in the same run
                else {
                    this.movement_history.push([current_value, count]);  // close previous run
                    current_value = n;                                   // start a new run
                    count = 1;
                }
            }
            this.movement_history.push([current_value, count]);
        }
        move(){
            if (this.status === true) {
                // ---------- update movement ------
                if (this.movement_map.length === this.movement_index) this.update_movement();
    
                // ---------- Draw lines ---------
    
                let draw_index = this.movement_history_index;
                let movements_draw = [];
                
                for (const element of this.movement_history) {
                    if ((draw_index-element[1]) >= 0) {
                        draw_index = draw_index-element[1];
                        movements_draw.push(element);
                    }
                    else if ((draw_index-element[1]) < 0) {
                        movements_draw.push([element[0], draw_index]); 
                        break;
                    }
                }
    
                let start_x = this.start_position[0], start_y = this.start_position[1];
                let end_x = start_x, end_y = start_y;
    
                movements_draw.forEach(element => {
                    switch (element[0]) {
                        case 0: end_y = end_y - element[1]; break;
                        case 1: end_x = end_x + element[1]; break;
                        case 2: end_y = end_y + element[1]; break;
                        case 3: end_x = end_x - element[1]; break;
                    }
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = 1.5;
                    
                    ctx.beginPath();
                    ctx.moveTo(start_x*panel_cell, start_y*panel_cell);
                    ctx.lineTo(end_x*panel_cell, end_y*panel_cell);
                    ctx.stroke();
    
                    start_x = end_x;
                    start_y = end_y;
                });
    
                // -------------- Ships movement ---------- 
    
                if (this.movement_index !== this.movement_map.length) {
                    // ----- rotate -----
                    if (movements_draw[movements_draw.length-1][1] == 0 && movements_draw.length>1) {   // == 0 or == 1 to adjust
                        let last_direction = this.direction;
                        let actual_direction = movements_draw[movements_draw.length-1][0];
    
                        let deference = actual_direction-last_direction;
                        
                        if (deference === -1 || deference === 3) this.angle = this.angle - 90;
                        if (deference === 1 || deference === -3) this.angle = this.angle + 90;
                        this.ship.style.transform = `rotate(${this.angle}deg)`;
                        this.direction = actual_direction;
                    }
    
                    this.movement_index++;
                    this.movement_history_index++;
                    
                    // ----- update map ------
                    map[this.y][this.x] = this.index;
                    
                    // ----- translate -----
                    switch (movements_draw[movements_draw.length-1][0]) {
                        case 0:
                            this.y = this.y - 1;
                            this.ship.style.top = `${(panel_cell*this.y)-(this.height/2)}px`;
                            break;
                        case 1:
                            this.x = this.x + 1;
                            this.ship.style.left = `${(panel_cell*this.x)-(this.width/2)}px`;
                            break;
                        case 2:
                            this.y = this.y + 1;
                            this.ship.style.top = `${(panel_cell*this.y)-(this.height/2)}px`;
                            break;
                        case 3:
                            this.x = this.x - 1;
                            this.ship.style.left = `${(panel_cell*this.x)-(this.width/2)}px`;
                            break;
                    }
                }

                // check ship status
                if (map[this.y][this.x] !== 0) {
                    this.status = false;
                    setTimeout(() => {this.ship.remove();}, 200);
                }
            }
            else{
                map.forEach(x =>{x.forEach(y =>{
                        if (y === this.index) {y = 0;}
                    })
                })
            }
        }
    }
    
    async function update_frame() {
        if (window_height != window.innerHeight || window_width != window.innerWidth) {
            window_height = window.innerHeight;
            window_width = window.innerWidth;
        
            canvas.height = window_height;
            canvas.width = window_width;

            cell_size = (window_height > window_width) ? window_height/25 : window_width/25;
            panel_cell = cell_size/2;

            map_height = Math.floor(canvas.height / panel_cell); 
            map_width = Math.floor(canvas.width / panel_cell);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#00B8FF";
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
    }

    // --------- START GAME ---------
    const canvas = document.getElementById("back_game");
    const ctx = canvas.getContext("2d");

    let window_height = window.innerHeight;
    let window_width = window.innerWidth;
    
    canvas.height = window_height;
    canvas.width = window_width;
    
    let cell_size = (window_width < 900) ? window_height/25 : window_width/25;
    let panel_cell = cell_size/2;
    
    let map_height = Math.floor(canvas.height / panel_cell); 
    let map_width = Math.floor(canvas.width / panel_cell);

    // x panel_cell = 50
    // y panel_cell = 50
    let map = []
    for (let y = 0; y < 50; y++) {
        let row = [];
        for (let x = 0; x < 50; x++) {row.push(0)};
        map.push(row);
    }

    const all_ships = document.querySelectorAll(".ship");

    let ship_1 = new ship(all_ships[0], -90, 1, true, "#00f0ff", 1);
    let ship_2 = new ship(all_ships[1], 90, 3, true, "#ff0000", 2);
    let ship_3 = new ship(all_ships[2], -90, 1, true, "#00ff00", 3);
    let ship_4 = new ship(all_ships[3], 90, 3, true, "#ffff00", 4);

    ship_1.start_ship();
    ship_2.start_ship();
    ship_3.start_ship();
    ship_4.start_ship();
    
    update_frame();
    setTimeout(() => {
        const game_flow = setTimeout(() => {
            setInterval(() => {
                if (ship_1.status === false && ship_2.status === false && ship_3.status === false && ship_4.status === false) clearInterval(game_flow)
                
                update_frame();
                ship_1.move();
                ship_2.move();
                ship_3.move();
                ship_4.move();
            }, 100);
        }, 800);
    }, 1000);
}