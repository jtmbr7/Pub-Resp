
let light = [1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3)];
let ambient = .4;
let diffuse = .4;
let opacity = .8;


class Stone {

    r = 180;
    g = 180;
    b = 240;

    a = [0, 0];


    /*
    points = [
        new Point( 0.0001, -1,  0, 0),
        new Point(-1,  0,  0, 1),
        new Point( 0.0001,  1,  0, 2),
        new Point( 1,  0,  0, 3),
        new Point(0, 0, -1, 4),
        new Point(0, -.5, 1, 5),
    ];

    paths = [
        [0, 1, 4],
        [0, 4, 3],
        [4, 1, 2],
        [4, 2, 3],
        [0, 3, 5],
        [2, 5, 3],
        [2, 1, 5],
        [1, 0, 5],
    ];
    */
    /*
    points = [
        new Point(-1, -1.9, 1),
        new Point(-1.6, -1.9, 0.1),
        new Point(-.58, -1.9, -1),
        new Point(.69, -1.9, -0.6),
        new Point(1.51, -1.9, -0.8),
        new Point(2.7, -1.9, -0.1),
        new Point(1.95, -1.9, 1),
        new Point(-.58, -1.3, -1),
        new Point(.3, -.7, -1.3),
        new Point(1, -.2, -1),
        new Point(1.9, -.8, -1),
        new Point(2.2, -.4, -.6),
        new Point(2.5, -.8, -1),
        new Point(-.7, -.8, -1),
        new Point(-.9, -.2, -1),
        new Point(-1.6, -1, 0.1),
        new Point(-1.2, -.7, -0.6),
        new Point(-2, -.3, -0.9),
    ];

    paths = [
        [0, 1, 2, 3, 4, 5, 6],
        [2, 7, 3],
        [3, 7, 8],
        [3, 8, 9],
        [3, 9, 4],
        [4, 9, 10],
        [10, 9, 11],
        [4, 10, 5],
        [10, 11, 12],
        [10, 12, 5],
        [7, 13, 8],
        [14, 8, 13],
        [14, 9, 8],
        [2, 1, 7],
        [1, 15, 7],
        [15, 16, 7],
        [7, 16, 13],
        [16, 17, 13],
        [17, 14, 13],
        [15, 17, 16]
    ];
    */

    constructor(x, y, s, i = 0) {
        this.x = x;
        this.y = y;
        this.z = 0;
        this.s = s;
        this.grav = 0.06;
        this.fy = 0;

        if (i == 0) {
            this.points = [
                new Point(.2, -1.3, 0),
                new Point(-.8, -.6, 0),
                new Point(0, -.5, -.5),
                new Point(.4, -.7, -.5),
                new Point(.8, -.6, -.5),
                new Point(-.4, -.7, .6),
                new Point(.6, -.7, .3),
                new Point(.4, 0, .2),
                new Point(0, 0, .2),
                new Point(.2, 0, -.2),
            ];

            this.paths = [
                [1, 8, 2],
                [2, 8, 9],
                [0, 1, 2],
                [0, 2, 3],
                [3, 2, 4],
                [0, 3, 4],
                [1, 0, 5],
                [0, 6, 5],
                [0, 4, 6],
                [4, 7, 6],
                [6, 7, 5],
                [7, 8, 5],
                [5, 8, 1],
                [2, 9, 4],
                [4, 9, 7],
                [7, 9, 8]
            ];
        }
        else if (i == 1) {
            
            this.points = [
                new Point(.2, -1.6, 0),
                new Point(.9, -.6, -.5),
                new Point(1.4, -.6, .3),
                new Point(.2, -.8, 0),
                new Point(.5, -.2, -.2),
                new Point(.7, 0, -.4),
                new Point(0, -.2, -.2),
                new Point(-.2, -.4, -.2),
                new Point(0, 0, .2),
                new Point(1.5, 0, .3),
            ];

            this.paths = [
                [4, 6, 5],
                [1, 4, 5],
                [3, 6, 4],
                [3, 7, 6],
                [2, 9, 3],
                [0, 2, 3],
                [1, 5, 9],
                [1, 3, 4],
                [3, 9, 8],
                [1, 9, 2],
                [5, 8, 9],
                [0, 1, 2],
                [0, 3, 1],
                [5, 6, 8],
                [6, 7, 8],
                [3, 8, 7],

            ];
            /*
            this.points = [
                new Point(-1, -1, -1),
                new Point(1, -1, -1),
                new Point(1, -1, 1),
                new Point(-1, -1, 1),
                new Point(-1, 1, -1),
                new Point(1, 1, -1),
                new Point(1, 1, 1),
                new Point(-1, 1, 1),
            ];

            this.paths = [
                [0, 1, 3],
                [1, 2, 3],
                [5, 0, 4],
                [5, 1, 0],
                [6, 1, 5],
                [6, 2, 1],
                [7, 2, 6],
                [7, 3, 2],
                [7, 6, 4],
                [6, 5, 4],
                [4, 3, 7],
                [4, 0, 3],
            ];
            */
        }


        for (let i = 0; i < this.points.length; ++i) {
            this.points[i].i = i;
        }

        let d = [0, 0, 0];
        for (let i = 0; i < this.points.length; ++i) {
            d[0] += this.points[i].dx;
            d[1] += this.points[i].dy;
            d[2] += this.points[i].dz;
        }

        d[0] /= this.points.length;
        d[1] /= this.points.length;
        d[2] /= this.points.length;

        for (let i = 0; i < this.points.length; ++i) {
            this.points[i].dx -= d[0];
            this.points[i].dy -= d[1];
            this.points[i].dz -= d[2];
        }

        d = [0, 0, 0];
        for (let i = 0; i < this.points.length; ++i) {
            d[0] += this.points[i].dx;
            d[1] += this.points[i].dy;
            d[2] += this.points[i].dz;
        }

        this.volume = 0;
        for (let i = 0; i < this.paths.length; ++i) {
            let path = this.paths[i];
            let p1 = this.points[path[0]];
            let p2 = this.points[path[1]];
            let p3 = this.points[path[2]];

            let v321 = p3.dx * p2.dy * p1.dz;
            let v231 = p2.dx * p3.dy * p1.dz;
            let v312 = p3.dx * p1.dy * p2.dz;
            let v132 = p1.dx * p3.dy * p2.dz;
            let v213 = p2.dx * p1.dy * p3.dz;
            let v123 = p1.dx * p2.dy * p3.dz;
            this.volume += (-v321 + v231 + v312 - v132 - v213 + v123);
        }

        this.volume *= (1 / 6) * Math.pow(this.s, 3);
        console.log(this.volume);

        for (let i = 0; i < this.points.length; ++i) {
            let point = this.points[i];
            point.dx0 = point.dx;
            point.dy0 = point.dy;
            point.dz0 = point.dz;
            let dxz = distance(point.dx, 0, 0, point.dz);
            if (dxz == 0) point.ax0 = 0;
            else {
                if (point.dz >= 0) { point.ax0 = Math.acos(point.dx / dxz) }
                if (point.dz < 0 & point.dx > 0) { point.ax0 = Math.asin(point.dz / dxz) }
                if (point.dz < 0 & point.dx <= 0) { point.ax0 = -Math.acos(point.dx / dxz) }
            }

            let dyz = distance(point.dy, 0, 0, point.dz);
            if (dyz == 0) point.ay0 = 0;
            else {
                if (point.dz >= 0) { point.ay0 = Math.acos(point.dy / dyz) }
                if (point.dz < 0 & point.dy > 0) { point.ay0 = Math.asin(point.dz / dyz) }
                if (point.dz < 0 & point.dy <= 0) { point.ay0 = -Math.acos(point.dy / dyz) }
            }
            point.ax = point.ax0;
            point.ay = point.ay0;
        }
    }

    tick() {

        if (mouse.Left == "mousedown") {
            this.rotate((mouse.x - this.msave[0]) / 50, (mouse.y - this.msave[1]) / 50);
        }

        this.msave = [mouse.x, mouse.y];

        this.fy += this.grav;
        this.y += this.fy;
    }

    rotate(ax, ay) {
        for (let i = 0; i < this.points.length; ++i) {
            let point = this.points[i];

            let dxz = distance(point.dx, 0, 0, point.dz);
            if (dxz == 0) point.ax = 0;
            else {
                if (point.dz >= 0) { point.ax = Math.acos(point.dx / dxz) }
                if (point.dz < 0 & point.dx > 0) { point.ax = Math.asin(point.dz / dxz) }
                if (point.dz < 0 & point.dx <= 0) { point.ax = -Math.acos(point.dx / dxz) }
            }

            point.dx = dxz * Math.cos(point.ax + ax);
            point.dz = dxz * Math.sin(point.ax + ax);

            let dyz = distance(point.dy, 0, 0, point.dz);
            if (dyz == 0) point.ay = 0;
            else {
                if (point.dz >= 0) { point.ay = Math.acos(point.dy / dyz) }
                if (point.dz < 0 & point.dy > 0) { point.ay = Math.asin(point.dz / dyz) }
                if (point.dz < 0 & point.dy <= 0) { point.ay = -Math.acos(point.dy / dyz) }
            }

            point.dy = dyz * Math.cos(point.ay + ay);
            point.dz = dyz * Math.sin(point.ay + ay);
        }
    }

    reset_points() {

        for (let i = 0; i < this.points.length; ++i) {
            let point = this.points[i];

            point.dx = point.dx0;
            point.dy = point.dy0;
            point.dz = point.dz0;
            point.ax = point.ax0;
            point.ay = point.ay0;
        }
    }

    draw() {

        for (let i = 0; i < this.points.length; ++i) {
            let point = this.points[i];

            point.x = this.x + this.s * point.dx;
            point.y = this.y + this.s * point.dy;
            point.z = this.z + this.s * point.dz;
        }

        for (let i = 0; i < this.paths.length; ++i) {

            let path = this.paths[i];

            let p1 = this.points[path[0]];
            let p2 = this.points[path[1]];
            let p3 = this.points[path[2]];

            let v1 = normalize([p2.x - p1.x, p2.y - p1.y, p2.z - p1.z]);
            let v2 = normalize([p3.x - p1.x, p3.y - p1.y, p3.z - p1.z]);
            let n = normalize([(v1[1] * v2[2]) - (v1[2] * v2[1]), (v1[2] * v2[0]) - (v1[0] * v2[2]), (v1[0] * v2[1]) - (v1[1] * v2[0])]);

            if (n[2] < 0 || opacity < 1) {

                ctx.beginPath();
                ctx.moveTo(this.points[path[0]].x, this.points[path[0]].y);

                for (let q = 1; q < path.length; ++q)
                    ctx.lineTo(this.points[path[q]].x, (this.points[path[q]].y));

                let l = Math.acos(n[0] * light[0] + n[1] * light[1] + n[2] * light[2]) / (l3(n) * l3(light)) / 3.14;

                let c = ambient + l * diffuse;
                let rgb0 = rgb(this.r * c, this.g * c, this.b * c, opacity);

                ctx.closePath();
                ctx.fillStyle = rgb0;
                ctx.fill();
                if (opacity == 1) {
                    ctx.strokeStyle = rgb0;
                    ctx.stroke();
                }
            }
            
        }

        //this.points.forEach(point => point.draw());
    }
        
}

function normalize(v) {
    let l = Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2) + Math.pow(v[2], 2));

    let v1 = [];
    for (let i = 0; i < v.length; ++i) {
        v1.push(v[i] / l);
    }

    return v1;
}

function l3(v) {

    let l = 0;
    for (let i = 0; i < v.length; ++i)
        l += Math.pow(v[i], 2);

    return Math.sqrt(l);
}

class Point {
    constructor(dx, dy, dz) {
        this.dx = dx;
        this.dy = dy;
        this.dz = dz;

        
        
    }

    draw() {
        circle(this.x, this.y, 1, rgb(0, 0, 0, 1));
        text(this.x, this.y, 10, rgb(0, 0, 0, 1), this.i);
    }
}


class Ground {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        rectangle(this.x, this.y, this.w, this.h, rgb(0, 0, 0));
    }
}

let stones = [];
let grounds = [];

function setup() {
    stones.push(new Stone(200, 200, 50, 0));
    stones.push(new Stone(400, 200, 50, 1));
    grounds.push(new Ground(100, 300, 500, 10));

}

function update() {
    stones.forEach(stone => stone.tick());
    stones.forEach(stone => stone.draw());
    grounds.forEach(ground => ground.draw());

    text(100, 340, 20, rgb(0, 0, 0), "ax: " + stones[0].points[0].ax);
    text(100, 360, 20, rgb(0, 0, 0), "ax0: " + stones[0].points[0].ax0);

    text(100, 400, 20, rgb(0, 0, 0), "s - ax: " + stones[0].a[0][0]);

    for (let i = 0; i < stones.length; ++i) {
        if (key.k == "keydown") {

            stones[i].reset_points();
        }
    }


    for (let i = 0; i < stones.length; ++i) {
        let stone = stones[i];
        for (let q = 0; q < stone.points.length; ++q) {
            let point = stone.points[q];
            for (let k = 0; k < grounds.length; ++k) {
                let ground = grounds[k];

                if (point.y > ground.y) {
                    stone.fy = 0;
                    stone.y -= point.y - ground.y;
                }
            }
        }
    }
}
