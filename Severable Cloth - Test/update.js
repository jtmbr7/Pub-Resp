


let gravity = 0.05;
let h = 0.5;
class Spring {

    constructor(p1, p2, l, force, lock, broken) {
        this.p1 = p1;
        this.p2 = p2;
        this.l = l;
        this.force = force;
        this.damper_force = .25;
        this.lock = lock;
        this.broken = broken;
    }

    tick() {
        let a = -Math.atan((this.p1.x - this.p2.x) / (this.p1.y - this.p2.y)) + Math.PI / 2;
        if (this.p2.y >= this.p1.y)
            a += Math.PI;

        let d = (this.p1.x - this.p2.x) / Math.cos(a);

        if (this.lock == -1 && d < this.l || this.lock == 1 && d > this.l || this.lock == 0) {
            let fx = this.force * Math.cos(a) * (this.l - d) + this.damper_force * (this.p2.fx - this.p1.fx);
            let fy = this.force * Math.sin(a) * (this.l - d) + this.damper_force * (this.p2.fy - this.p1.fy);
            this.p1.acx += fx;
            this.p1.acy += fy;
            this.p2.acx -= fx;
            this.p2.acy -= fy;
        }
    }

}

class Point {
    acx = 0;
    acy = 0;
    fx = 0;
    fy = 0;
    broken = {};
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        circle(this.x, this.y, 2, "rgb(0, 0, 0, 1)");
    }

    tick() {

        if (this.y >= canvas.height) {
            this.fy = 0;
            this.y = canvas.height;
        }

        else if (this.y < 0) {
            this.y = 0;
            this.fy = 0;
        }

        if (this.x < 0) {
            this.fx = 0;
            this.x = 0;
        }

        else if (this.x > canvas.width) {
            this.x = canvas.width;
            this.fx = 0;
        }


        this.fx += this.acx * h 
        this.fy += (this.acy + gravity) * h 
        this.x += this.fx * h;
        this.y += this.fy * h;
    }
}

class Cloth {

    springs = [];
    points = [];
    c = "rgb(130, 180, 150, .2)";
    builds = [{
            force: .1,
            matrix: [[1, 0, "a"], [1, 1, "b"], [0, 1, "c"], [-1, 1, "d"]],
            lock: 1,
        },
        {
            force: .05,
            matrix: [[-2, 2], [0, 2], [2, 2], [2, 0]],
            lock: -1,
        }];

    constructor(x, y, w, h, l) {
        this.w = w;
        this.h = h;
        for (let i = 0; i < w; ++i) {
            this.points.push(new Array(h));
            for (let q = 0; q < h; ++q) {
                this.points[i][q] = new Point(x + l * i, y + l * q);
            }
        }

        for (let i = 0; i < w; ++i) {
            for (let q = 0; q < h; ++q) {
                this.builds.forEach(build => {
                    for (let k = 0; k < build.matrix.length; ++k) {
                        let m = build.matrix[k];
                        let x0 = i + m[0];
                        let y0 = q + m[1];
                        if (x0 < 0 || y0 < 0 || x0 > w - 1 || y0 > h - 1) continue;
                        if (build.matrix[k][2] != undefined) {
                            this.points[i][q].broken[build.matrix[k][2]] = false;
                        }

                        this.springs.push(new Spring(this.points[i][q], this.points[x0][y0], Math.pow(q/15, 2) +Math.sqrt(Math.pow(l * m[0], 2) + Math.pow(l * m[1], 2)), build.force, build.lock, build.matrix[k][2]));
                    }
                });
            }
        }
    }

    tick() {

        if (mouse.Right == "mousedown") {
            if (mouse.x == mouse.prevx && mouse.y == mouse.prevy) {
            }
            else {
                for (let i = 0; i < this.springs.length; ++i) {
                    let p1 = this.springs[i].p1;
                    let p2 = this.springs[i].p2;

                    let X1 = p1.x;
                    let X2 = p2.x;
                    let X3 = mouse.x;
                    let X4 = mouse.prevx;
                    let Y1 = p1.y;
                    let Y2 = p2.y;
                    let Y3 = mouse.y;
                    let Y4 = mouse.prevy;
                    
                    if (X3 == X4)
                        break;

                    // y = k*x + m
                    let A1 = (Y1 - Y2) / (X1 - X2);
                    let A2 = (Y3 - Y4) / (X3 - X4);
                    let b1 = Y1 - X1 * A1;
                    let b2 = Y3 - X3 * A2;

                    if (A1 == A2)
                        continue;

                    let Xa = (b2 - b1) / (A1 - A2);

                    if (Xa < Math.max(Math.min(X1, X2), Math.min(X3, X4)) ||
                        Xa > Math.min(Math.max(X1, X2), Math.max(X3, X4)))
                        continue;
                    else {
                        p1.broken[this.springs[i].broken] = true;
                        this.springs.splice(i, 1);
                    }
                }
            }
        }

        this.points.forEach(point_row => {
            point_row.forEach(point => {
                point.acx = 0;
                point.acy = 0;
            });
        });

        this.springs.forEach(spring => spring.tick());

        for (let i = 0; i < this.points.length; ++i) {
            for (let q = 1; q < this.points[i].length; ++q) {

                this.points[i][q].tick();
            }
        }
    }

    draw() {
        
        this.draw_fabric();
        this.draw_matrix();
        //this.draw_points();

    }

    draw_fabric() {

        ctx.fillStyle = "rgb(0, 100, 250, 0.2)";
        for (let i = 0; i < this.w - 1; ++i) {
            for (let q = 0; q < this.h - 1; ++q) {
                ctx.beginPath();
                ctx.moveTo(this.points[i][q].x, this.points[i][q].y);
                if (!this.points[i][q].broken.a)
                    ctx.lineTo(this.points[i + 1][q].x, this.points[i + 1][q].y);

                if (!this.points[i][q].broken.b)
                    ctx.lineTo(this.points[i + 1][q + 1].x, this.points[i + 1][q + 1].y);

                if (!this.points[i][q].broken.c)
                    ctx.lineTo(this.points[i][q + 1].x, this.points[i][q + 1].y);


                ctx.closePath();
                ctx.fill();
            }
        }

    }

    draw_points() {

        this.points.forEach(point_row => {point_row.forEach(point => point.draw());});
    }

    draw_matrix() {

        ctx.beginPath();
        this.springs.forEach(spring => {

            if (spring.lock == 1) {

                ctx.moveTo(spring.p1.x, spring.p1.y);
                ctx.lineTo(spring.p2.x, spring.p2.y);
            }

        });

        ctx.strokeStyle = "rgb(130, 150, 180, .1)";
        ctx.stroke();
    }
}

let cloths = [];
function setup() {
    cloths.push(new Cloth(100, 100, 20, 30, 10));
}

let control = undefined;

function update() {
        cloths.forEach(cloth => cloth.tick());

    cloths.forEach(cloth => cloth.draw());
    if (mouse.Right == "mousedown") {
        image(mouse.x - 15, mouse.y - 15, .3, "scissor");
    }
    else image(mouse.x - 15, mouse.y - 15, .1, "mouse");
    if (mouse.Left == "mousedown") {

        if (control == undefined) {
            for (let i = 0; i < cloths[0].w; ++i) {
                let point_row = cloths[0].points[i];

                for (let q = 0; q < point_row.length; ++q) {
                    let point = point_row[q];
                    if (distance(mouse.x, mouse.y, point.x, point.y) < 10) {
                        control = point;
                        break;
                    }
                }
                
            }
        }
        else {

            if (mouse.x > canvas.width)
                control.x = canvas.width;
            else control.x = mouse.x;
            if (mouse.y > canvas.height)
                control.y = canvas.height
            else control.y = mouse.y;
            control.fx = 0;
            control.fy = 0;
        }
    } else {
        control = undefined;
    }
}