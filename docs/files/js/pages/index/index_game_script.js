export const game = () => {
    class ship {
        constructor(direction, status, color, index) {
            this.height = cell_size;
            this.width = cell_size;
            this.direction = direction;
            this.status = status;
            this.color = color;
            this.index = index;
            
            this.img_0 = this.define_imgs(get_img(0, this.color))
            this.img_1 = this.define_imgs(get_img(1, this.color))
            this.img_2 = this.define_imgs(get_img(2, this.color))
            this.img_3 = this.define_imgs(get_img(3, this.color))

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
        define_imgs(data){
            // 1. Convert the string into a Blob object of type image/svg+xml
            let blob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });

            // 2. Create a URL for that Blob
            let url = URL.createObjectURL(blob);
            
            // 4. Create an image and load it with the SVG URL
            let img = new Image();
            img.src = url;
            return img;
        }
        start_ship(){
            // Define data to draw img
            let height = this.height;
            let width = this.width;
            let x = (this.x*panel_cell)-(width/2);
            let y = (this.y*panel_cell)-(height/2);
            let img;
            
            // Draw img
            switch (this.direction) {
                case 0: img = this.img_0; break;
                case 1: img = this.img_1; break;
                case 2: img = this.img_2; break;
                case 3: img = this.img_3; break;
            }
            img.onload = function() {ctx.drawImage(img, x, y, height, width);}
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
    
                // ---------- Draw lines and ship ---------
    
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
                    if (movements_draw[movements_draw.length-1][1] == 0 && movements_draw.length>1) {this.direction = movements_draw[movements_draw.length-1][0];}
    
                    this.movement_index++;
                    this.movement_history_index++;
                    
                    // ----- update map ------
                    map[this.y][this.x] = this.index;
                    
                    // ----- translate img -----

                    // Define data to draw img
                    let height = this.height;
                    let width = this.width;
                    let x = (this.x*panel_cell)-(width/2);
                    let y = (this.y*panel_cell)-(height/2);
                    let img;
            
                    switch (movements_draw[movements_draw.length-1][0]) {
                        case 0:
                            this.y = this.y - 1;
                            img = this.img_0;
                            break;
                        case 1:
                            this.x = this.x + 1;
                            img = this.img_1;
                            break;
                        case 2:
                            this.y = this.y + 1;
                            img = this.img_2;
                            break;
                        case 3:
                            this.x = this.x - 1;
                            img = this.img_3;
                            break;
                    }

                    // draw img
                    ctx.drawImage(img, x, y, height, width);
                }

                // check ship status
                if (map[this.y][this.x] !== 0) {
                    this.status = false;
                    map.forEach(x =>{x.forEach(y =>{if (y === this.index) y = 0;})})
                }
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

    const get_img = (img, color)=>{
        switch (img) {
            case 0: return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 97.21 94.98"><polygon points="48.61 65.87 5.89 88.96 27.25 47.22 48.61 5.49 69.96 47.22 91.32 88.96 48.61 65.87" fill="#000" stroke="${color}" stroke-miterlimit="10" stroke-width="5"/></svg>`;
            case 1: return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94.98 97.21"><polygon points="29.11 48.61 6.03 5.89 47.76 27.25 89.5 48.61 47.76 69.96 6.03 91.32 29.11 48.61" fill="#000" stroke="${color}" stroke-miterlimit="10" stroke-width="5"/></svg>`
            case 2: return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 97.21 94.98"><polygon points="48.61 29.11 91.32 6.03 69.96 47.76 48.61 89.5 27.25 47.76 5.89 6.03 48.61 29.11" fill="#000" stroke="${color}" stroke-miterlimit="10" stroke-width="5"/></svg>`
            case 3: return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94.98 97.21"><polygon points="65.87 48.61 88.96 91.32 47.22 69.96 5.49 48.61 47.22 27.25 88.96 5.89 65.87 48.61" fill="#000" stroke="${color}" stroke-miterlimit="10" stroke-width="5"/></svg>`
        }
    }
    
    update_frame();

    let ship_1 = new ship(1, true, "#00f0ff", 1);
    let ship_2 = new ship(3, true, "#ff0000", 2);
    let ship_3 = new ship(1, true, "#00ff00", 3);
    let ship_4 = new ship(3, true, "#ffff00", 4);

    ship_1.start_ship();
    ship_2.start_ship();
    ship_3.start_ship();
    ship_4.start_ship();

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
} 