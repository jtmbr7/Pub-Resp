class Fish {

    static properties = [["size", 15, 40], ["maxSpeed", 1, 4], ["vision", 0, 200], ["smart", 0, 1], ["r", 50, 200], ["g", 50, 200], ["b", 50, 200], ["turn_speed", .05, .4]]

    static objects = [];

    colors = [
        {r: 255, g: 227, b:157},
        {r: 250, g: 115, b: 40}
    ];

    age = 0;
    angle = new Angle(Math.random() * Math.PI * 2);
    sway = {t: 0, speed: .1, length: .4};
    turn_speed = .2;
    foodCount = 0;
    eatTimer = {value: 0, threshold: 60};
    // Genes
    vision = 10 + 40 * Math.random();
    velocity = {value: 0, acceleration: .02};
    targetAngle = {value: new Angle(0), time: 0, threshold: 60 * 60};
    maxSpeed = 2;
    size = 30;
    alive = true;
    energy = 100;

    
    constructor(position, properties) {

        for(let prop in properties)
            this[prop] = properties[prop];
        this.brain = new Brain(this, 15 + Math.floor(30 * this.smart))

        this.position = position;

        this.skeleton = new Skeleton(this);
        this.eyes = [new Eye(this, 1, .4, -.3), new Eye(this, 2, .4, .3)]
    }

    tick() {

        this.brain.n = 15 + Math.floor(15 * this.smart) * 2
        if(this.tired)
            return;
            
        ++this.targetAngle.time;
        if(this.targetAngle.time > this.targetAngle.threshold) {
            this.targetAngle.value = new Angle(Math.random() * Math.PI * 2);
            this.targetAngle.time = 0;
        }
        
        Seaurchin.objects.forEach(seaurchin => {

            let distance = this.position.distance(seaurchin.position);
            if(distance < this.size + seaurchin.size) {
    
                if(this.slowed == undefined) {
                    this.energy -= 20;
                    this.slowed = {time: 0, duration: 2 * 60, target: [seaurchin]};
                }
                else if(!this.slowed.target.find(x => x == seaurchin)) {
                    this.energy -= 20;
                    this.slowed.target.push(seaurchin)
                }
    
                this.slowed.time = 0;
            }
        });

        Fish.objects.forEach(fish => {

            if(fish != this) {
                let distance = this.position.distance(fish.position)
                if(distance < this.size && this.size/fish.size >= 1.3) {

                    let angle = this.position.angle(fish.position, distance);
                    
                    if(new Angle(angle).distance(this.brain.currentDecision) < Math.PI/4) {
                        
                        fish.alive = false;
                        this.foodCount += fish.foodCount + 3;
                        this.energy += 40;
                    }
                }
            }
        });

        this.sway.t += this.velocity.value * .1;
        this.brain.tick();
        this.fish_collision();
        this.wall_collision();

        this.angle.normalize();
        this.speedUp();
        
        if(this.slowed) {
            ++this.slowed.time;

            if(this.velocity.value > this.maxSpeed * .5) {
                this.velocity.value = this.maxSpeed * .5;
            }

            if(this.slowed.time > this.slowed.duration)
                this.slowed = undefined;
        }

        this.calculate_targetAngle();
        // Updates the position of the fish
        this.position.move(this.velocity.value, this.angle.add(Math.sin(this.sway.t) * this.sway.length));

        this.eating()
        this.calculateEnergy();

        this.skeleton.tick();
        this.eyes.forEach(eye => eye.tick());
    }

    calculateEnergy() {
        if(this.energy > 100)
            this.energy = 100;

        this.energy -= Math.pow(this.velocity.value, 2) * .01;
        this.energy -= this.smart * .01;
        this.energy -= Math.pow(this.size, 3) /800000;
        this.energy -= this.turn_speed * .02;
        this.energy -= Math.pow(this.vision, 2) * 0.000001;
        

        if(this.energy < 0) {
            this.energy = 0;
            this.tired = true;
        }
    }

    speedUp() {

        this.velocity.value += this.velocity.acceleration;
        if(this.velocity.value > this.maxSpeed)
            this.velocity.value = this.maxSpeed;
    }

    draw() {

        //this.brain.draw();
        this.colors[1] = {r: this.r, g: this.g, b: this.b};
        draw_skin(this);

        this.eyes.forEach(eye => eye.draw());
        //this.skeleton.draw();
        //dashed_ring(this.position, this.size + this.vision, 1, "rgb(0, 0, 200, .3)");

        if(!this.tired) {
            bar({x: this.position.x - 12, y: this.position.y - this.size - 12}, 20 + 4, 10, "rgb(250, 250, 250, .5)");
            bar({x: this.position.x - 10, y: this.position.y - this.size - 10}, this.energy * .2, 6, "rgb(140, 200, 140, .7)");
        }
    }

    eating() {
        
        if(this.eatTimer.value < this.eatTimer.threshold)
            ++this.eatTimer.value;

        Food.objects.forEach(food => {
            let distance = food.position.distance(this.position);

            if(distance < this.size + food.size) {
                let angle = this.position.angle(food.position, distance);
                
                if(new Angle(angle).distance(this.brain.currentAngle) < Math.PI/3) {
                    this.velocity.value = 0;
                    
                    if(this.eatTimer.value >= this.eatTimer.threshold) {
                        food.eat(this)
                        this.eatTimer.value = 0;
                    }
                }
            }
        });
        
        if(this.foodCount >= 5 * this.size/27.5) {
            this.foodCount -= 5 * this.size/27.5;
            Egg.objects.push(new Egg(this));
        }
    }

    /* --------------------------------------------------------------------- */

    calculate_targetAngle() {

        let max = Math.max(...this.brain.values);

        if(max > this.brain.values[this.brain.currentDecision]) {

            let choices = [];
            this.brain.values.forEach((value, i) => {
                if(value == max) {
                    choices.push(i);
                }
            });

            let choice = [choices[0], this.targetAngle.value.distance(2 * Math.PI * choices[0]/this.brain.n)];
            for(let i = 1; i < choices.length; ++i) {

                let angle = this.targetAngle.value.distance(2 * Math.PI * choices[i]/this.brain.n);
                if(angle < choice[1])
                    choice = [choices[i], angle];

            }
            
            this.brain.currentDecision = choice[0];
            this.brain.currentAngle = 2 * Math.PI * choice[0]/this.brain.n;
        }

        if(this.angle.distance(this.brain.currentAngle) > this.turn_speed)
            this.angle.value += this.turn_speed * this.angle.direction(this.brain.currentAngle);
        else this.angle.value = this.brain.currentAngle
    }

    wall_collision(){ // Collision with walls

        if(this.position.x < this.size + this.vision) {
            if(this.position.x < this.size) {
                this.position.x = this.size;
                this.targetAngle.value = new Angle(3*Math.PI/2 + Math.random() * Math.PI);
            }

                for(let i = 0; i < this.brain.n; ++i) {
                    let diff = (this.position.x + (this.size + this.vision) * Math.cos((Math.PI * 2 * i)/this.brain.n));
    
                    if(diff < 0)
                        this.brain.values[i] += diff * .5;
                }
        }
        
        else if(this.position.x > canvas.width - this.size - this.vision) {
            if(this.position.x > canvas.width - this.size){
                this.position.x = canvas.width - this.size;
                this.targetAngle.value = new Angle(Math.PI/2 + Math.random() * Math.PI);
            }

            for(let i = 0; i < this.brain.n; ++i) {
                let diff = canvas.width - this.position.x - (this.vision + this.size) * Math.cos((Math.PI * 2 * i)/this.brain.n);

                if(diff < 0)
                    this.brain.values[i] += diff * .5;
            }
        }

        if(this.position.y < this.size + this.vision) {
            if(this.position.y < this.size){
                this.position.y = this.size;
                this.targetAngle.value = new Angle(Math.random() * Math.PI);
            }

            for(let i = 0; i < this.brain.n; ++i) {
                let diff = this.position.y + (this.vision + this.size) * Math.sin((Math.PI * 2 * i)/this.brain.n);

                if(diff < 0)
                    this.brain.values[i] += diff * .5;
            }
        }
        
        else if(this.position.y > canvas.height - this.size - this.vision) {
            if(this.position.y > canvas.height - this.size){
                this.position.y = canvas.height - this.size;
                this.targetAngle.value = new Angle(Math.PI/2 + Math.random() * Math.PI);
            }

            for(let i = 0; i < this.brain.n; ++i) {
                let diff = canvas.height - this.position.y - (this.vision + this.size) * Math.sin((Math.PI * 2 * i)/this.brain.n);

                if(diff < 0)
                    this.brain.values[i] += diff * .5;
            }
        }
    }
    
    fish_collision() { // Collision with other fishes
        
        for(let i = Fish.objects.indexOf(this) + 1; i < Fish.objects.length; ++i) {

            let fish = Fish.objects[i]
            let d = this.position.distance(fish.position);
        
            if (d < this.size + fish.size && this.size/fish.size < 1.3 && this.size/fish.size > 1/1.3) {
                let a = fish.position.angle(this.position, d);
    
                let position = new Position(
                    ((fish.position.x + this.position.x) / 2) + (this.size + fish.size) * Math.cos(a) * .5,
                    ((fish.position.y + this.position.y) / 2) + (this.size + fish.size) * Math.sin(a) * .5);
    
                fish.position = new Position(
                    ((fish.position.x + this.position.x) / 2) + (this.size + fish.size) * Math.cos(a + Math.PI) * .5,
                    ((fish.position.y + this.position.y) / 2) + (this.size + fish.size) * Math.sin(a + Math.PI) * .5);
    
                this.position = position
            }
        }
    }

    static tick() {
        Fish.objects.forEach(obj => obj.tick());
    }

    static draw() {
        Fish.objects.forEach(obj => obj.draw());
    }

    static clear() {
        for(let i = 0; i < Fish.objects.length; ++i) {
            let fish = Fish.objects[i];
            if(fish.alive == false) {
                for(let i = 0; i < 10; ++i)
                    Particle.objects.push(new Particle(fish.position, fish.r, fish.g, fish.b))
                Fish.objects.splice(i, 1)
                --i;
            }
        }
    }
    
}

class Egg {

    static objects = [];

    colors = ["rgb(200, 60, 30)", "rgb(150, 10, 0)", "rgb(250, 110, 60)"]
    constructor(fish) {
        this.parent = fish;
        this.size = 7*fish.size/27.5;
        let a = fish.angle.value - Math.PI;
        this.position = new Position(fish.position.x + Math.cos(a) * fish.size * .4, fish.position.y + Math.sin(a) * fish.size * .4);

    }

    draw() {
        circle(this.position, this.size, this.colors[1])
        circle(this.position, this.size * .8, this.colors[0])
        circle({x: this.position.x - this.size * .2, y: this.position.y  - this.size * .2}, this.size * .5, this.colors[2])
    }

    static draw() {
        Egg.objects.forEach(obj => obj.draw());
    }

    static hatch() {
        
        Egg.objects.forEach(egg => {

            let properties = {}
            Fish.properties.forEach(property => {
                let prop = property[0];
                properties[prop] = 0
                let range = (property[2] - property[1])/10;
                properties[prop] = egg.parent[prop] + signedRandom() * range;

                if(properties[prop] > property[2])
                    properties[prop] = property[2];
                else if(properties[prop] < property[1])
                    properties[prop] = property[1];
            });

            Fish.objects.push(new Fish(new Position(egg.position.x, egg.position.y), properties));
        });

        Egg.objects = [];
    }
}

function signedRandom() {
    return Math.sign(Math.random() - .5);
}