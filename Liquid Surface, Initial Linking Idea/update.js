
class Box {
    particles = [];
    distance = 0;
    constructor(particle) {
        this.add(particle);
    }

    add(particle) {

        this.particles.push(particle);
    }


    draw(system) {

        ctx.beginPath();

        rectangle(this.x[0], this.y[0], this.x[1] - this.x[0], this.y[1] - this.y[0], "rgb(250, 0, 0, .2)");
        ctx.moveTo(system.particles[this.particles[0]].x(), system.particles[this.particles[0]].y());
        for (let i = 1; i < this.particles.length; ++i) {
            ctx.lineTo(system.particles[this.particles[i]].x(), system.particles[this.particles[i]].y());
        }

        ctx.lineWidth = 1
        ctx.strokeStyle = "rgb(0, 0, 0, 1)"
        ctx.stroke();
    }
}

class Water {

    bounce = .5;
    repulse = 0.01;
    collision = .8;;

    boxes = [];

    borders = { x: [100, 300], y: [100, 300] };
    boundries = {x: [], y: []}
    particles = [];
    constructor(x, y, s, m, n, r) {

        let a, l;
        for (; n > 0; --n) {
            a = Math.random() * Math.PI * 2;
            l = Math.random();

            this.particles.push(new Particle(x + r * Math.cos(a) * l, y + r * Math.sin(a) * l, s, m))
        }
    }

    tick() {

        this.boxes = [];

        let list = [];
        for (let i = 0; i < this.particles.length; ++i)
            list.push(i);

        while (list.length > 0) {
            this.boxes.push(new Box(list[0]));
            list.splice(0, 1)

            let box = this.boxes.length - 1;
            for (let i = 0; i < this.boxes[box].particles.length; ++i) {
                for (let q = 0; q < list.length; ++q) {
                    if (distance(this.particles[this.boxes[box].particles[i]].x(), this.particles[this.boxes[box].particles[i]].y(), this.particles[list[q]].x(), this.particles[list[q]].y()) < 25) {
                        this.boxes[box].add(list[q])
                        list.splice(q, 1);
                        --q;
                    }
                } 
            }
        }


        this.boxes.forEach(box => {
            box.x = [canvas.width, 0];
            box.y = [canvas.height, 0];

            box.particles.forEach(i => {
                let particle = this.particles[i];

                for (let prop in particle.coordinates) {
                    if (particle.coordinates[prop].value + particle.s > box[prop][1])
                        box[prop][1] = particle.coordinates[prop].value + particle.s;

                    if (particle.coordinates[prop].value - particle.s < box[prop][0])
                        box[prop][0] = particle.coordinates[prop].value - particle.s;
                }
            });

            for (let x = box.x[0]; x < box.x[1]; ++x) {
                if (this.heat(x, box.y[0] - 1)) {
                    x = box.x[0];
                    box.y[0] -= 1;
                }
            }


            for (let x = box.x[0]; x < box.x[1]; x += 1) {
                if (this.heat(x, box.y[1] + 1)) {

                    x = box.x[0];
                    box.y[1] += 1;
                }
            }

        });
        
        this.particles.forEach(particle => {
            if (mouse.Left == "mousedown") {

                let d = distance(particle.coordinates.x.value, particle.coordinates.y.value, mouse.x, mouse.y);
                if (d < 50) {

                    let a = Math.acos((particle.coordinates.x.value - mouse.x) / d)
                    if (particle.coordinates.y.value < mouse.y)
                        a *= -1;

                    if (!a)
                        a = 0;

                    particle.coordinates.x.value -= Math.cos(a)
                    particle.coordinates.y.value -= Math.sin(a)
                }
            }
        });

        this.particles.forEach(particle => {
            particle.tick(this)


            this.particles.forEach(particle2 => { this.collide(particle, particle2); });
        });

    }

    draw() {
        border(this.borders.x[0], this.borders.y[0], this.borders.x[1] - this.borders.x[0], this.borders.y[1] - this.borders.y[0], "rgb(30, 100, 250, 1)", 2);

        //this.particles.forEach(partice => partice.draw());

        ctx.beginPath();

        this.boxes.forEach(box => {

            for (let y = box.y[0]; y < box.y[1]; y += 1) {
                for (let x = box.x[0]; x < box.x[1]; ++x) {

                    if (this.heat(x, y)) {


                        if (y == box.y[0]) {



                        }

                        if (x == box.x[0]) {
                            do {
                                x -= 5;
                            } while (this.heat(x, y));

                            do {
                                ++x;
                            } while (!this.heat(x, y));

                            ctx.moveTo(x, y);

                            x = box.x[0];
                            do {
                                x += 5;
                            } while (this.heat(x, y));


                            do {
                                --x;
                            } while (!this.heat(x, y));

                            ctx.lineTo(x, y);
                        }
                        else {
                            do {
                                ++x;
                            } while (!this.heat(x, y) && x < box.x[1]);

                            ctx.moveTo(x, y);

                            do {
                                ++x;
                            } while (this.heat(x, y));

                            ctx.lineTo(x - 1, y);
                        }
                    }
                }
            }

        });

        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(0, 100, 200, .5)";
        ctx.stroke();


        this.boxes.forEach(box => { box.draw(this);});
    }

    heat(x, y) {
        let d = 0;
        this.particles.forEach(particle => {
            d += 1 / (1 + (Math.pow(x - particle.x(), 2) + Math.pow(y - particle.y(), 2)) / Math.pow(particle.s, 2));
        });

        return d > 1 / 2;
    }


    collide(p1, p2) {

        let d = distance(p1.coordinates.x.value, p1.coordinates.y.value, p2.coordinates.x.value, p2.coordinates.y.value);

        if (d < p1.s + p2.s && p2 != p1) {
            let a = Math.acos((p1.coordinates.x.value - p2.coordinates.x.value) / d);

            if (!a)
                a = 0;
            let d2 = Math.sqrt(Math.pow(p1.coordinates.x.value - mouse.x, 2) + Math.pow(p1.coordinates.y.value - mouse.y, 2));

            if (p1.coordinates.y.value < p2.coordinates.y.value)
                a *= -1;

            if (mouse.Left == "mousedown" && d2 < 30) {

                let v1 = p1.velocity;
                let v2 = p2.velocity;
                let m1 = Math.pow(p1.s, 2) * Math.PI;
                let m2 = Math.pow(p2.s, 2) * Math.PI;
                let theta1 = Math.acos(p1.coordinates.x.force / p1.velocity);
                let theta2 = Math.acos(p2.coordinates.x.force / p2.velocity);

                if (!theta1)
                    theta1 = 0;

                if (!theta2)
                    theta2 = 0;

                if (p1.coordinates.y.force < 0)
                    theta1 *= -1;

                if (p2.coordinates.y.force < 0)
                    theta2 *= -1;


                p1.coordinates.x.value = ((p2.coordinates.x.value + p1.coordinates.x.value) / 2) + (p1.s + p2.s) * Math.cos(a) * .5;
                p1.coordinates.y.value = ((p2.coordinates.y.value + p1.coordinates.y.value) / 2) + (p1.s + p2.s) * Math.sin(a) * .5;
                p2.coordinates.x.value = ((p2.coordinates.x.value + p1.coordinates.x.value) / 2) + (p1.s + p2.s) * Math.cos(a + Math.PI) * .5;
                p2.coordinates.y.value = ((p2.coordinates.y.value + p1.coordinates.y.value) / 2) + (p1.s + p2.s) * Math.sin(a + Math.PI) * .5;

                if (p1.coordinates.x.value < p1.s || p1.coordinates.x.value > canvas.width - p1.s) {

                    if (p1.coordinates.x.value > canvas.width - p1.s) {
                        p2.coordinates.x.value += canvas.width - p1.s - p1.coordinates.x.value;
                        p1.coordinates.x.value += canvas.width - p1.s - p1.coordinates.x.value;
                    }
                    else {
                        p2.coordinates.x.value += p1.s - p1.coordinates.x.value;
                        p1.coordinates.x.value += p1.s - p1.coordinates.x.value;
                    }
                }

                if (p2.coordinates.x.value < p2.s || p2.coordinates.x.value > canvas.width - p2.s) {

                    if (p2.coordinates.x.value > canvas.width - p2.s) {
                        p1.coordinates.x.value += canvas.width - p2.s - p2.coordinates.x.value;
                        p2.coordinates.x.value += canvas.width - p2.s - p2.coordinates.x.value;
                    }
                    else {
                        p1.coordinates.x.value += p2.s - p2.coordinates.x.value;
                        p2.coordinates.x.value += p2.s - p2.coordinates.x.value;
                    }
                }

                if (p1.coordinates.y.value < p1.s || p1.coordinates.y.value > canvas.height - p1.s) {

                    if (p1.coordinates.y.value > canvas.height - p1.s) {
                        p1.coordinates.y.value += canvas.height - p1.s - p1.coordinates.y.value;
                        p2.coordinates.y.value += canvas.height - p1.s - p1.coordinates.y.value;
                    }
                    else {
                        p1.coordinates.y.value += p1.s - p1.coordinates.y.value;
                        p2.coordinates.y.value += p1.s - p1.coordinates.y.value;
                    }
                }

                if (p2.coordinates.y.value < p2.s || p2.coordinates.y.value > canvas.height - p2.s) {

                    loss = .5;
                    if (p2.coordinates.y.value > canvas.height - p2.s) {
                        p1.coordinates.y.value += canvas.height - p2.s - p2.coordinates.y.value;
                        p2.coordinates.y.value += canvas.height - p2.s - p2.coordinates.y.value;
                    }
                    else {
                        p1.coordinates.y.value += p2.s - p2.coordinates.y.value;
                        p2.coordinates.y.value += p2.s - p2.coordinates.y.value;
                    }
                }

                p1.coordinates.x.force = (((v1 * Math.cos(theta1 - a) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - a)) / (m1 + m2)) * Math.cos(a) + v1 * Math.sin(theta1 - a) * Math.cos(a + Math.PI / 2)) * this.collision;
                p1.coordinates.y.force = (((v1 * Math.cos(theta1 - a) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - a)) / (m1 + m2)) * Math.sin(a) + v1 * Math.sin(theta1 - a) * Math.sin(a + Math.PI / 2)) * this.collision;
                p2.coordinates.x.force = (((v2 * Math.cos(theta2 - a) * (m2 - m1) + 2 * m1 * v1 * Math.cos(theta1 - a)) / (m1 + m2)) * Math.cos(a) + v2 * Math.sin(theta2 - a) * Math.cos(a + Math.PI / 2)) * this.collision;
                p2.coordinates.y.force = (((v2 * Math.cos(theta2 - a) * (m2 - m1) + 2 * m1 * v1 * Math.cos(theta1 - a)) / (m1 + m2)) * Math.sin(a) + v2 * Math.sin(theta2 - a) * Math.sin(a + Math.PI / 2)) * this.collision;

            }
            else {
                let l = (p1.s + p2.s - d) * this.repulse;
                p1.coordinates.x.force += Math.cos(a) * l;
                p1.coordinates.y.force += Math.sin(a) * l;
                p2.coordinates.x.force -= Math.cos(a) * l;
                p2.coordinates.y.force -= Math.sin(a) * l;

            }
        }
    }
}

class Particle {

    coordinates = { x: { force: 0, acceleration: 0 }, y: { force: 0, acceleration: 0} };
    constructor(x, y, s, m) {
        this.coordinates.x.value = x;
        this.coordinates.y.value = y;
        this.m = m;
        this.s = s;

        this.c = rgb(Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), 1);
    }

    tick(system) {


            
        for (let prop in this.coordinates) {
            let axis = this.coordinates[prop];
            axis.force += axis.acceleration;
            axis.velocity = axis.force / this.m;
            axis.value += axis.velocity

            if (axis.value < system.borders[prop][0] + this.s) {
                axis.value = system.borders[prop][0] + this.s;
                axis.force *= -system.bounce;
            }

            else if (axis.value > system.borders[prop][1] - this.s) {
                axis.value = system.borders[prop][1] - this.s;
                axis.force *= -system.bounce;
            }
        }

        this.velocity = 0;
        for (let prop in this.coordinates) {
            this.velocity += Math.pow(this.coordinates[prop].velocity, 2);
        }

        this.velocity = Math.sqrt(this.velocity);
    }

    draw() {
        circle(this.coordinates.x.value, this.coordinates.y.value, this.s, this.c)
    }

    x() {
        return this.coordinates.x.value;
    }

    y() {
        return this.coordinates.y.value;
    }

    fx() {
        return this.coordinates.x.force;
    }

   fy() {
        return this.coordinates.y.force;
    }
}

let water;
function setup() {
    water = new Water(200, 200, 3, 1, 70, 300);
    //console.log(
    //    0.9 * 0.8 * 0.86 * 0.9 +
    //    0.1 * 0.8 * 0.86 * 0.1 +
    //    0.7 * 0.8 * 0.14 * 0.9 +
    //    0.1 * 0.8 * 0.14 * 0.1 +
    //    0.7 * 0.2 * 0.86 * 0.9 +
    //    0.1 * 0.2 * 0.86 * 0.1 +
    //    0.2 * 0.2 * 0.14 * 0.9 +
    //    0.1 * 0.2 * 0.14 * 0.1);

    //console.log(0.9 * 1 * 0.5 * 0.9
    //    + 0.1 * 1 * 0.5 * 0.1
    //    + 0.7 * 1 * 0.5 * 0.9
    //    + 0.1 * 1 * 0.5 * 0.1)
    console.log(
        0.9 * 0.8 * 0.9 * 0.9
        + 0.1 * 0.8 * 0.9 * 0.1
        + 0.7 * 0.8 * 0.1 * 0.9
        + 0.1 * 0.8 * 0.1 * 0.1
        + 0.7 * 0.2 * 0.7 * 0.9
        + 0.1 * 0.2 * 0.7 * 0.1
        + 0.2 * 0.2 * 0.3 * 0.9
        + 0.1 * 0.2 * 0.3 * 0.1);

    //console.log(0.6 * 0.75/0.7)
}

function update() {
    water.tick();
    water.draw();
}