
let selected = {};
let slider;

class Star {
    links = {};
    blink = {direction: -1, speed: Math.random() * .002 + .003, value: Math.random()};
    a = 1;
    constructor(node) {
        this.name = node.name;
        this.radius = 2 + node.value * .15
        if(this.radius > 15)
            this.radius = 15;
        this.value = node.value;

        if(node.colour != "#808080") {
            this.important = true;
            this.r = 200;
            this.g = 150;
            this.b = 90;
        }
        else {
            this.r = 140;
            this.g = 160;
            this.b = 200;
        }
        
        this.color = rgb(this.r, this.g, this.b, this.a);
        
    }

    tick() {
        this.blink.value += this.blink.speed * this.blink.direction;

        if(this.blink.value < 0) {
            this.blink.value *= -1;
            this.blink.direction = 1;
        }
        else if(this.blink.value > 1) {
            this.blink.value = 2 - this.blink.value;
            this.blink.direction = -1;
        }
        
    }

    link(target, value) {
        
        if(this.links[target])
            this.links[target] += value;
        else this.links[target] = value;
    }

    draw_links(stars) {
        for(let link in this.links) {

            if(this.links[link] > slider.scaledValues.max || this.links[link] < slider.scaledValues.min)
                continue;

            if(selected.locked)
                if(selected.locked == this.name || link == selected.locked)
                    line(this.position, stars[link].position, this.links[link] * .4, "rgb(250, 250, 250, 1)");
                else line(this.position, stars[link].position, this.links[link] * .4, "rgb(250, 250, 250, .04)");
            else line(this.position, stars[link].position, this.links[link] * .4, "rgb(250, 250, 250, .1)");
        }
    }

    draw() {
        
        if(selected.locked && !(selected.hover == this.name || selected.locked == this.name || Object.keys(this.links).find(a => a == selected.locked))) {
            
            star(this.position, this.radius, .5, rgb(this.r, this.g, this.b, .4));
            return;
        }
        else {
            if(selected.hover == this.name || selected.locked == this.name) {
                star(this.position, this.radius + 9, .5, "rgb(250, 250, 250,1)");
                star(this.position, this.radius + 7, .5, "rgb(40, 100, 150, 1)");
            }
            else star(this.position, this.radius + 2 + 2 * this.blink.value, .5, "rgb(250, 250, 250,1)");
            star(this.position, this.radius, .5, this.color);
        }
    }
}

class Ring {

    characters = [];
    constructor(radius) {
        this.radius = radius;
    }

    add(character) {
        this.characters.push(character);
    }
}

class Visualization {

    rings = [];
    stars = {};
    constructor(x, y, radius, rings, input) {

        this.position = new Position(x, y);
        this.radius = radius;
        this.name = data[input].name
        
        data[input].nodes.forEach(node =>{
            if(!this.stars[node.name])
                this.stars[node.name] = new Star(node, radius);
            else this.stars[node.name].value += node.value;
        });
        
        
        let arr = [];
        Object.keys(this.stars).forEach(d => {
            arr.push(d);
        });

        arr = arr.sort((a, b) =>  {
            let A = this.stars[a];
            let B = this.stars[b];
            if(B.important && !A.important) return 1;
            else if(!B.important && A.important) return -1;
            else if(B.value > A.value) return 1;
            else return -1;
        });

        let q = 0
        rings.forEach((r, i) => {
            this.rings.push(new Ring(i * this.radius/(rings.length - 1)));
            for(let k = 0; k < r; ++k)
                this.rings[i].add(arr[q++]);
        });

        this.rings.forEach(r => {
            r.characters.forEach((c, i) => {
                let d = this.stars[c];
                d.position = this.position.circulation(i * Math.PI * 2 / r.characters.length, r.radius);
                d.size = d.value/2;
            });
        });

        data[input].links.forEach(link =>{

            if(slider.max < link.value) {
                slider.max = link.value;
                slider.scaledValues.max = link.value;
            }

            let source = data[input].nodes[link.source].name;
            let target = data[input].nodes[link.target].name;
            
            this.stars[source].link(target, link.value);
            this.stars[target].link(source, link.value);
        });
    }

    tick() {
        for(let star in this.stars)
            this.stars[star].tick();
    }

    draw() {

        for(let star in this.stars)
            this.stars[star].draw_links(this.stars);

        for(let star in this.stars)
            this.stars[star].draw();

        let t = ctx.measureText(this.name);

        text(this.position.x - t.width/2, this.position.y + this.radius + 30, 20, "rgb(250, 250, 250, .5)", this.name)
    }
}

class Slider {
    max = 0;
    min = 0;
    values = {min: 0, max: 1};
    scaledValues = {min: 0, max: 0};
    constructor(position, w, h) {
        this.position = position;
        this.w = w;
        this.h = h;
    }

    tick() {
        if(mouse.Left == "mousedown") {
            if(!this.locked) {
                if(this.position.add(this.w * this.values.max, 0).distance(mouse.position) < this.h/2)
                    this.locked = "max";
                else if(this.position.add(this.w * this.values.min, 0).distance(mouse.position) < this.h/2)
                    this.locked = "min";
            }
        } else this.locked = undefined;

        if(this.locked) {
                this.values[this.locked] = (mouse.position.x - this.position.x)/ this.w;
            if(this.values[this.locked] > 1)
                this.values[this.locked] = 1;
            else if(this.values[this.locked] < 0)
                this.values[this.locked] = 0;

            if(this.values.max < this.values.min)
                if(this.locked == "min")
                    this.values.min = this.values.max;
                else if(this.locked == "max")
                    this.values.max = this.values.min;

            this.scaledValues[this.locked] = this.min + (this.max - this.min) * this.values[this.locked];
        } 
    }

    draw() {
        bar(this.position, this.w, this.h, "rgb(250, 250, 250, .4)");
        bar(this.position, this.w, this.h - 20, "rgb(0, 0, 0, .3)");
        star(this.position.add(this.w * this.values.min, 0), this.h/2, .5, "rgb(250, 250, 250, .2)");
        star(this.position.add(this.w * this.values.min, 0), this.h/3, .5, "rgb(250, 250, 250, .8)");
        star(this.position.add(this.w * this.values.max, 0), this.h/2, .5, "rgb(250, 250, 250, .2)");
        star(this.position.add(this.w * this.values.max, 0), this.h/3, .5, "rgb(250, 250, 250, .8)");
    }
}

let scroll;
let visualizations = [];
let button;
function setup(){
    slider = new Slider(new Position(canvas.width - 300, canvas.height - 100), 200, 50);
    scroll = {radius: 20, position: new Position(canvas.width - 50, 50), value: 0};
    let k = [[1, 6, 12, 19], [1, 5, 10, 17], [1, 4, 8, 12], [1, 4, 7, 10], [1, 4, 6, 10], [1, 3, 6, 10], [1, 5, 8, 13]];

    let x = canvas.width/2, y = canvas.height/2 - 10, large_radius = 370, small_radius = 75
    for(let i = 1; i <= 7; ++i) {
        let a = i * Math.PI * 2/7 - Math.PI/2;
        visualizations.push(new Visualization(
            x + Math.cos(a) * large_radius,
            y + Math.sin(a) * large_radius,
            small_radius,
            k[i - 1],
            "episode" + i
        ));
    }
    

    visualizations.push(new Visualization(x, y, large_radius - small_radius - 50, [1, 4, 8, 12, 20, 30, 37], "allepisodes"));
}

let found;
function update() {
    keyInputs();
    slider.tick();
    visualizations.forEach(v => v.tick());
    menu();
    visualizations.forEach(v => v.draw());
    slider.draw();
    if(selected.tooltip)
        tooltip();
    
    
}
function menu() {
    found = false;
    if(selected.locked) {
        let y = 40, x = 40;
        text(x, y, 20, "rgb(250, 250, 250, 1)", selected.locked);

        visualizations.forEach(v => {

            if(y > canvas.height - 200) {
                y = 40;
                x += 150;
            }
            if(v.stars[selected.locked]) {
                text(x, y += 40, 20, "rgb(250, 250, 250, 1)", v.name);
                y += 10;
                

                for(let link in v.stars[selected.locked].links) {

                    if(v.stars[selected.locked].links[link] > slider.scaledValues.max || v.stars[selected.locked].links[link]  < slider.scaledValues.min)
                    continue;

                    y += 12;
                    if(mouse.position.x > x
                        && mouse.position.x < x + ctx.measureText(link + ": " + v.stars[selected.locked].links[link]).width
                        && mouse.position.y < y
                        && mouse.position.y > y - 10) {
                            selected.hover = link;
                            found = true;
                            if(mouse.Left == "mouseup")
                                selected.locked = link;
                        }

                    if(selected.hover == link) {
                        rectangle({x:x, y:y + 1}, ctx.measureText(link + ": " + v.stars[selected.locked].links[link]).width, -12, "rgb(250, 250, 250, 1)")
                        text(x, y, 12, "rgb(40, 100, 150, 1)", link + ": " + v.stars[selected.locked].links[link]);
                    }
                    else if(v.stars[link].important)
                        text(x, y, 12, "rgb(200, 150, 90, 1)", link + ": " + v.stars[selected.locked].links[link]);
                    else text(x, y, 12, "rgb(140, 160, 200, 1)", link + ": " +v.stars[selected.locked].links[link] );
                }
            }
        });
    }
}

function tooltip() {
    let p = selected.tooltip.position.add(50, -70);
    ctx.font = "20px Arial";
    let t = ctx.measureText(selected.tooltip.name + ": " + selected.tooltip.value);
    line(p.add(-10, 30), selected.tooltip.position, 5, "rgb(0, 0, 0, 1)")
    ctx.fillStyle = "black";
    ctx.fillRect(p.x - 15, p.y - 5,t.width + 30, 40);
    ctx.fillStyle = "rgb(30, 50, 70, 1)";
    ctx.fillRect(p.x - 10, p.y,t.width + 20, 30);
    text(p.x, p.y + 23, 20, "rgb(250, 250, 250, 1)", selected.tooltip.name + ": " + selected.tooltip.value);
}

function keyInputs() {
    
    if(!found)
        selected.hover = undefined
    selected.tooltip = undefined
    visualizations.forEach(v => {
        for(let star in v.stars)
            if(mouse.position.distance(v.stars[star].position) < v.stars[star].radius) {
                selected.hover = star;
                selected.tooltip = v.stars[star];
                if(mouse.Left == "mouseup")
                    if(selected.locked == star)
                        selected.locked = undefined;
                    else selected.locked = star;
            }
    });

    if(!selected.hover && mouse.Left == "mouseup" && !slider.locked)
        selected.locked = undefined;
}