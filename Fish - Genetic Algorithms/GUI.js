
class GUI {
    constructor() {
        this.clock = new Clock(new Position(60, 220));
        this.playButton = new PlayButton(new Position(canvas.width - 100, canvas.height - 100));
        this.fishSpawner = new FishSpawner(new Position(120, canvas.height - 70));
        this.calendar = new Calendar(new Position(10, 10));
    }

    tick() {
        
        myDebugger();
        if(this.playButton.value)
            this.clock.tick();
        
        if(this.clock.value > this.clock.maxTime) {

            newDay();
            this.clock.value = 0;
            ++this.calendar.value;
        }
        
        this.playButton.tick();
        
        if(this.clock.value == 0)
        this.fishSpawner.tick();
    
    }

    draw() {
        this.clock.draw();
        this.playButton.draw();

        if(this.clock.value == 0)
        this.fishSpawner.draw();
        this.calendar.draw();
    }
}

class PlayButton {
    size = 80;
    value = false;
    colors = ["rgb(250, 250, 250, .5)"];
    constructor(position) {
        this.position = position;
    }

    tick() {

        if(mouse.position.x > this.position.x && mouse.position.x < this.position.x + this.size
        && mouse.position.y > this.position.y && mouse.position.y < this.position.y + this.size) {
            if(mouse.Left == "mousedown")
                this.colors[0] = "rgb(250, 250, 250, .3)"
            else this.colors[0] = "rgb(250, 250, 250, .8)"

            if(mouse.Left == "mouseup") {
                if(Fish.objects.length == 0)
                    alert("Add fishes before you start the simulation")
                else this.value == true ? this.value = false : this.value = true
            }
        }
        else this.colors[0] = "rgb(250, 250, 250, .5)"

    }

    draw() {

        rectangle(this.position, this.size, this.size, this.colors[0])
        
        if(this.value) {
            rectangle({x: this.position.x + this.size * .2, y: this.position.y + this.size * .2}, this.size * .2, this.size * .6, this.colors[0]);
            rectangle({x: this.position.x + this.size * .6, y: this.position.y + this.size * .2}, this.size * .2, this.size * .6, this.colors[0]);
        }
        else {
            triangle({x: this.position.x + this.size * .2, y: this.position.y + this.size * .2},
                {x: this.position.x + this.size * .2, y: this.position.y + this.size * .8},
                {x: this.position.x + this.size * .8, y: this.position.y + this.size * .5},
                this.colors[0]);
        }
    }
}

class Slider {
    constructor(position, property) {
        this.width = 130;
        this.height = 35;
        this.position = new Position(position.x - this.width/2, position.y);
        this.value = .5
        this.property = property;
    }

    tick() {

        if(mouse.Left == "mousedown"){
            let distance = mouse.position.distance({x: this.position.x + this.width * this.value, y: this.position.y + this.height/2});

            if(distance < this.height/2 && !mouse.locked)
                mouse.locked = this;

            if(mouse.locked == this) {
                
                this.value = (mouse.position.x - this.position.x) / this.width;

                if(this.value < 0)
                    this.value = 0;
                else if(this.value > 1)
                    this.value = 1;
            }
        }
    }

    draw() {

        bar({x: this.position.x - 2, y: this.position.y - 5}, this.width + 4, this.height + 10, "rgb(250, 250, 250, .5)");
        bar(this.position, this.width * this.value, this.height, "rgb(250, 250, 250, .5)");
        circle({x: this.position.x + this.width * this.value, y: this.position.y + this.height/2}, this.height/2, "rgb(250, 250, 250, 1)");
        image({x: this.position.x + this.value * this.width - 12.5, y: this.position.y + 5}, 1, this.property[0])
        
    }
}

class FishSpawner {
    size = 50;
    locked = false;
    holdcount = 0;
    color = "rgb(250, 250, 250, .4)"
    open = false;
    sliders = [];


    constructor(position) {
        this.position = position;

        this.height = - 115 - 50 * Fish.properties.length
        for(let i = 0; i < Fish.properties.length; ++i)
            this.sliders.push(new Slider(new Position(this.position.x, this.position.y - this.size - 100 - 50 * i), Fish.properties[i]))

            this.newFish();
    }

    tick() {

        this.sliders.forEach(slider => this.fish[slider.property[0]] = slider.property[1] + slider.value * (slider.property[2] - slider.property[1]));

        let distance = this.position.distance(mouse.position);

        if(distance < this.size) {
            this.color = "rgb(250, 250, 250, .7)"
        }
        else this.color = "rgb(250, 250, 250, .4)"


        this.fish.velocity.value = 0;
        this.fish.energy = 100;
        this.fish.slowed = undefined;
        
        if(mouse.locked != this) {
            this.fish.tick();
            this.fish.position.x = this.position.x
            this.fish.position.y = this.position.y
        }

        if(mouse.Left == "mousedown"){
            if(!mouse.locked && distance < this.size)
                mouse.locked = this;

            if(mouse.locked == this && this.holdcount < 10)
                ++this.holdcount;

            if(this.holdcount == 10) {
                if(mouse.position.distance(mouse.previousPosition) > 0) {

                    let angle = mouse.previousPosition.angle(mouse.position);
                    let c = Math.floor(this.fish.brain.n * angle/(Math.PI * 2));
                    this.fish.brain.currentDecision = c;
                    this.fish.brain.currentAngle = 2 * Math.PI * c/this.fish.brain.n;

                }
                this.fish.tick();
                this.fish.position.x = mouse.position.x
                this.fish.position.y = mouse.position.y
            }
        }
        else if(mouse.locked == this){

            if(this.holdcount == 10) {
                if(distance > this.size) {
                    this.fish.state = {value: "searching"}
                    Fish.objects.push(this.fish);
                    this.newFish();
                }
                else this.newFish();
            }
            else this.open == true ? this.open = false : this.open = true

            this.holdcount = 0;
        }

    }

    newFish() {
        let props = {};
        this.sliders.forEach(slider => {
            props[slider.property[0]] = slider.property[1] + slider.value * (slider.property[2] - slider.property[1]);
        });

        this.fish = new Fish(new Position(this.position.x, this.position.y), props);
        this.fish.tick();
    }

    draw() {
        if(this.open) {
            
            rectangle({x: this.position.x - this.size * 2, y: this.position.y}, this.size * 4, this.height, "rgb(250, 250, 250, .2)");
            this.sliders.forEach(slider => slider.draw());
            this.sliders.forEach(slider => slider.tick());

        }

        circle(this.position, this.size, this.color)
        this.fish.draw();
    }
}

class Calendar {

    value = 1;
    constructor(position) {
        this.position = position;
    }

    draw() {
        image(this.position, 1, "day")
        text({x: this.position.x + 50, y: this.position.y + 110}, 50, this.value, "rgb(250, 250, 250, .5)", true);
    }

}

class Clock {

    value = 0;
    size = 46;
    constructor(position, maxTime = 30) {
        this.position = position;
        this.maxTime = maxTime * 60
        this.angle = this.value * (Math.PI * 2/this.maxTime) - Math.PI/2;
    }

    tick() {
        ++this.value;
        this.angle = this.value * (Math.PI * 2/this.maxTime) - Math.PI/2;
    }

    draw() {
        ring(this.position, this.size, 3, "rgb(250, 250, 250, .5)");
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size * .9, -Math.PI/2, this.angle)
        ctx.lineTo(this.position.x, this.position.y)
        ctx.fillStyle = "rgb(250, 250, 250, .5)";
        ctx.fill();
        line(this.position,
            {x: this.position.x + Math.cos(this.angle) * this.size * .9, y: this.position.y + Math.sin(this.angle) * this.size * .9});
    }
}