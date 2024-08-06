

class Slider {
    value = 0;
    scaledValue = 0;
    max = 0;
    min = 10000;
    constructor(position, w, h) {
        this.position = position;
        this.w = w;
        this.h = h;
        for(let i = 0; i < data.length; ++i){
            if(data[i].end > this.max)
            this.max = data[i].end;
            if(data[i].begin < this.begin)
            this.min = data[i].begin;
        }
    }

    tick() {
        if(mouse.Left == "mousedown") {
            if(!this.locked) {
                if(this.position.add(this.w * this.value, 0).distance(mouse.position) < this.h/2)
                    this.locked = true;
            }
        } else this.locked = undefined;

        if(this.locked) {
            this.update_value((mouse.position.x - this.position.x)/ this.w);
            
        } 
    }

    update_value(value) {
        this.value = value;
        if(this.value > 1)
        this.value = 1;
    else if(this.value < 0)
        this.value = 0;

    this.scaledValue = this.min + (this.max - this.min) * this.value;
    }

    draw() {
        bar(this.position, this.w, this.h, "rgb(0, 0, 0, .4)");
        bar(this.position, this.w, this.h - 20, "rgb(0, 0, 0, .3)");
        star(this.position.add(this.w * this.value, 0), this.h/2, .5, "rgb(0, 0, 0, .2)");
        star(this.position.add(this.w * this.value, 0), this.h/3, .5, "rgb(0, 0, 0, .8)");

        /*
        for(let i = 0; i < data.length; ++i) {
            rectangle({x: this.position.x + this.w * data[i].begin / this.max, y: 200}, this.w * data[i].duration/this.max, 100, "rgb(250, 250, 250, .3)");
        }*/
        
    }
}


let slider;
let min_distance = 60;

function join(a, b, clusters) {

    for(let i = 0; i < clusters[a].length; ++i) {
        let A = clusters[a][i];

        for(let q = 0; q < clusters[b].length; ++q) {
            let B = clusters[b][q];

            if(Math.sqrt(Math.pow(data[A].x - data[B].x, 2) + Math.pow(data[A].y - data[B].y, 2)) < min_distance) {
                
                for(let k = 0; k < clusters[b].length; ++k)
                    clusters[a].push(clusters[b][k]);

                clusters.splice(b, 1);
                return true;
            }
                
        }
    }

    return false;
}
let colors = [];
let colorslist = ["rgb(250, 0, 0, 1)", "rgb(0, 250, 0, 1)", "rgb(0, 0, 250, 1)","yellow"];
function create_clusters() {

    let clusters = [];

    for(let i = 0; i < data.length; ++i)
        clusters.push([i]);

    for(let q = 0; q < clusters.length; ++q)
        for(let i = q + 1; i < clusters.length;)
            if(join(q, i++, clusters))
                i = q + 1;
    
    let saved = [];
    for(let i = 0; i < clusters.length; ++i)
        if(clusters[i].length < 4) {
            for(let q = 0; q < clusters[i].length; ++q)
                saved.push(clusters[i][q]);

            clusters.splice(i--, 1);
        }

    clusters.push(saved);

    for(let i = 0; i < clusters.length; ++i) 
        for(let q = 0; q < clusters[i].length; ++q)
            data[clusters[i][q]].cluster = i;

    for(let i = 0; i < clusters.length - 1; ++i) {
        if(i < colorslist.length)
            colors.push(colorslist[i]);
        else colors.push("rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ", " + 1 + ")");

    }
    
    colors.push("rgb(0, 0, 0, 1)")
    console.log(clusters.length)
}

function scale_to_screen() {
    let margin = 10;
    let max_x = Math.max(...data.map(d => d.x));
    let min_x = Math.min(...data.map(d => d.x));
    let max_y = Math.max(...data.map(d => d.y));
    let min_y = Math.min(...data.map(d => d.y));

    for(let i = 0; i < data.length; ++i) {
        let d = data[i];
        d.camX = margin + (canvas.width - margin * 2) * (d.x - min_x)/(max_x - min_x);
        d.camY = margin + (canvas.height - margin * 2) * (d.y - min_y)/(max_y - min_y);
    }


    for(let i = 0; i < data.length; ++i)
        if(data[i].camY == 10) {
            console.log(i)
        }

    
}

function setup() {
    create_clusters();
    scale_to_screen();
    slider = new Slider(new Position(100, 100), 100, 50);

    console.log(data);
}

function update() {
    slider.draw();
    slider.tick();

    slider.update_value(slider.value + .001);
    for(let i = 0; i < data.length; ++i) {
        let d = data[i];
        circle({x: d.camX, y: d.camY},  4, colors[d.cluster]);
    }
    
    
    for(let i = 0; i < data.length - 1; ++i) {
        let d1 = data[i];
        let d2 = data[i + 1];
        if(d1.end > slider.scaledValue && d1.end < slider.scaledValue + 10000)
        line({x: d1.camX, y: d1.camY}, {x: d2.camX, y: d2.camY}, 1, "rgb(" + (250*(d1.end/slider.max)) + ", 0, " + (250 - 250*(d1.end/slider.max)) + ", 1)");
    }
    text({x: 400, y: 100}, 20, "rgb(0, 0, 0, 1)", Math.round(slider.scaledValue) + " - " + (Math.round(slider.scaledValue) + 10000))
    /* 
    for(let i = 0; i < data.length; ++i) {
        if(d.begin - 10 <= slider.scaledValue && d.end + 10 >= slider.scaledValue) {

            
            circle({x: d.x, y: d.y}, d.duration/100, "rgb(250, 250, 250, 1)");
        }
        else 
            
        circle({x: d.x, y: d.y}, d.duration/100, "rgb(250, 250, 250, 1)");
    }*/

    /*
    for(let x = 0; x < canvas.width; ++x) {
        for(let y = 0; y < canvas.height; ++y) {

            let d = 0;
            for(let i = 0; i < data.length; ++i)
                d += 10 / (10 + Math.pow(data[i].camX - x, 2) + Math.pow(data[i].camY - y, 2));

            rectangle({x: x, y: y}, 1, 1, "rgb(" + d * 250 + ", 0, 0, 1)");
        }
    }
*/
}