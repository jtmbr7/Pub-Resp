
class Graph {
    constructor(position, width, height, data) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.dx = this.width/287;
        this.values = new Array(288);
    }

    setData(data) {

        this.scaled_value = 0;
        for(let i = 0; i < 288; ++i)
            this.values[i] = this.height;

        for(let prop in data)
            if(data[prop].length > this.scaled_value)
            this.scaled_value = data[prop].length;

        this.scaled_value = this.height/this.scaled_value;

        for(let prop in data)
            this.values[parseInt(prop.substring(0, 2)) * 12 + parseInt(prop.substring(3, 5))/5] = this.height - this.scaled_value * data[prop].length;
    }

    tick() {

    }

    draw() {

        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y + this.values[0]);
        for(let i = 1; i < 288; ++i)
            ctx.lineTo(this.position.x + i * this.dx, this.position.y + this.values[i]);

        ctx.strokeStyle = "red";
        ctx.stroke();
    }
}

class Button {

    constructor(position, width, height, label) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.label = label;
    }

    tick(window) {
        if(!mouse.locked && mouse.position.x > this.position.x && mouse.position.x < this.position.x + this.width
            && mouse.position.y > this.position.y && mouse.position.y < this.position.y + this.height)
                this.hover = true;
            else this.hover = false;

        if(this.hover && mouse.Left == "mousedown")
            window.setData(this);
    }

    draw() {

        if(this.hover || this.selected) {
            rectangle(this.position, this.width, this.height, "rgb(250, 250, 250, .5)");

        }
        else {
            rectangle(this.position, this.width, this.height, "rgb(250, 250, 250, .5)");
            rectangle(this.position.add(5, 5), this.width - 10, this.height - 10, "rgb(250, 250, 250, .5)");

        }
        text(this.position.add(this.width/2, this.height/2 + 8), this.width * .2,"rgb(0, 0, 0, .5)", this.label, true);

    }
}

class Calendar {
    buttons = [];
    constructor(position, width, height) {
        this.position = position;
        this.width = width;
        this.height = height;

        let labels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
        let n = labels.length;
        for(let i = 0; i < labels.length; ++i) {
            this.buttons.push(new Button(this.position.add(this.width * i/n, 0), this.width/n, this.height, labels[i]));
        }

        this.buttons[0].data = monday;
        this.buttons[1].data = tuesday;
        this.buttons[2].data = wednesday;
        this.buttons[3].data = thursday;
        this.buttons[4].data = friday;
        this.buttons[5].data = saturday;
        this.buttons[6].data = sunday;
    }

    tick(window) {
        this.buttons.forEach(b => b.tick(window));
    }

    draw() {
        rectangle(this.position, this.width, this.height, "rgb(0, 0, 250, .2)");
        this.buttons.forEach(b => b.draw());
    }
}

class Slider {

    values = [];
    constructor(position, width, height) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.d = this.width/287;

        this.setValue(.72);
        for(let i = 0; i < 24; ++i) {
            let timeString = + (i < 10 ? "0" + i : i) + ":00";
            this.values.push(timeString);
        }
    }

    tick() {

        if(mouse.Left == "mousedown") {
            if(!mouse.locked && this.position.add(this.width * this.value, this.height/2).distance(mouse.position) < 10)
                mouse.locked = this;
        }
        
        if(mouse.locked == this)
            this.setValue((mouse.position.x - this.position.x)/this.width);
    }

    setValue(value) {
        this.value = value;
        if(this.value < 0)
            this.value = 0;
        if(this.value > 1)
            this.value = 1;

        let k = Math.round(this.value * 287);
        this.value = k/287;
        let h = Math.floor(k/12);
        let m = (k - h * 12)*5;

        this.timeString = (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
    }

    draw() {

        ctx.beginPath();
        for(let i = 0; i < 288; ++i) {
            let x = this.position.x + this.d * i - .5;
            let y = this.position.y + this.height / 2;
            ctx.moveTo(x, y - 5);
            ctx.lineTo(x, y + 5);
        }

        for(let i = 0; i < this.values.length; ++i) {
            let x = this.position.x + this.d * i * 12 - .5;
            let y = this.position.y + this.height / 2;
            ctx.moveTo(x, y - 10);
            ctx.lineTo(x, y + 10);
        }

        ctx.strokeStyle = "rgb(0, 0, 0, .7)";
        ctx.stroke();

        for(let i = 0; i < this.values.length; ++i) {
            let x = this.position.x + this.d * i * 12 - .5;
            let y = this.position.y + this.height / 2 - 15;
            
            text({x: x, y: y}, this.width * .01, "black", this.values[i], true);
        }

        text({x: 60, y: 40}, 25, "black", this.timeString, true);
        
        circle(this.position.add(this.width * this.value, this.height/2), 10, "rgb(190, 190, 250, .8)");
        circle(this.position.add(this.width * this.value, this.height/2), 5, "rgb(250, 250, 250, .8)");
    }
}

class Map {
    colors = {Commercial: "rgb(0, 0, 0, .5)", Residental: "rgb(0, 250, 0, .5)", School: "rgb(0, 0, 250, .5)", Pub: "rgb(250, 16, 240, .5)", Restaurant: "rgb(222, 89, 28, .5)"};
    constructor(position, width, height, data) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.data = data;
    }

    draw_heat(data) {

        let size = 10;
        for(let y = this.position.y; y < this.position.y + this.height; ++y) {
            for(let x = this.position.x; x < this.position.x + this.width; ++x) {
                
                let value = 0;

                data.forEach(d => {
                    value += size / (size + Math.pow(this.position.x + d[0] * this.width - x, 2) + Math.pow(this.position.y + d[1] * this.height - y, 2));
                });
        
                if(value > 2) {
                    rectangle({x: x, y: y}, 1, 1, "rgb(250, 0, 0, 1)");
                }
            }
        }

    }

    draw() {
        
        this.data.forEach(d => {
            d.polygons.forEach(p => polygon(this.position, p, this.width, this.height, this.colors[d.buildingType]));
        });
    }
}

class Window {
    constructor(position, width, height) {
        this.position = position;
        this.width = width;
        this.height = height;

        this.map = new Map(this.position, this.width, this.height * .75, data);
        this.slider = new Slider(position.add(0, this.height * .85), width, height * .1);
        this.calendar = new Calendar(this.position.add(0, this.height * .95), width, height * .05);
        this.graph = new Graph(this.position.add(0, this.height * .75), this.width, this.height * .1);

        this.setData(this.calendar.buttons[0]);
    }
    
    setData(button) {

        this.calendar.buttons.forEach(b => b.selected = false);
        button.selected = true;
        this.data = button.data;
        this.graph.setData(this.data);
    }

    tick() {
        this.graph.tick();
        this.calendar.tick(this);
        this.slider.tick();
    }

    draw() {
        border(this.position, this.width, this.height, "black");
        this.graph.draw();
        this.map.draw();
        //this.map.draw_heat(this.data[this.slider.timeString]);
        this.slider.draw();
        this.calendar.draw();

        
        if(this.data[this.slider.timeString]) {
            this.data[this.slider.timeString].forEach(d => {
                circle(this.map.position.add(d[0] * this.map.width, d[1] * this.map.height), 3, "rgb(0, 0, 0, .5)");
            });
        }
    }
}

let windows = [];
function setup() {

    let pubs = [556, 29, 1012, 502, 164, 238, 429, 489, 585, 953, 234, 627];
    let restaurants = [304, 308, 58, 964, 181, 164, 619, 875, 917, 86, 991, 27, 679, 124, 888, 160, 714, 213, 101, 285];
    
    pubs.forEach(p => {
        data[p - 1].buildingType = "Pub";
    })

    restaurants.forEach(p => {
        data[p - 1].buildingType = "Restaurant";
    })

    windows.push(new Window(new Position(30, 100), 600, 700));
}

function update() {
    windows.forEach(w => w.tick());
    windows.forEach(w => w.draw());
}