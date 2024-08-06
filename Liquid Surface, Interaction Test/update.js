
class Ball {

    fx = 0;
    fy = 0;
    constructor(x, y, s) {
        this.x = x;
        this.y = y;
        this.s = s;
        this.ff = 0.1;
        this.v = 0;
    }

    tick() {

        this.stand = false;

        let d = Math.sqrt(Math.pow(this.x - mouse.x, 2) + Math.pow(this.y - mouse.y, 2));
        if (mouse.Left == "mousedown" && d < 100) {

            let a = Math.acos((this.x - mouse.x) / d);
            if (mouse.y > this.y)
                a *= -1;

            this.fx -= .3 * Math.cos(a)
            this.fy -= .3 * Math.sin(a)
        }

        this.v = Math.sqrt(Math.pow(this.fx, 2) + Math.pow(this.fy, 2));

        if (this.y > canvas.height - this.s) {
            this.y = canvas.height - this.s;
            this.stand = true;
            this.fy *= -.5;
            if (Math.abs(this.fy) < .1 && this.stand)
                this.fy = 0;
        }


        if (this.x >= canvas.width - this.s && this.fx > 0) {
            this.x = canvas.width - this.s;
            this.fx *= -.5;
        }

        if (this.x < this.s && this.fx < 0) {
            this.x = this.s;
            this.fx *= -.5;
        }

        if (this.stand) {
            if (Math.abs(this.fx) > this.ff)
                this.fx -= this.ff * this.fx / Math.abs(this.fx);
            else this.fx = 0;
        }
        else this.fy += .2;
        this.newx = undefined;
        this.newy = undefined;
        this.newfx = undefined;
        this.newfy = undefined;

        this.x += this.fx;
        this.y += this.fy;
    }

    collision(ball) {

        let d = distance(this.x, this.y, ball.x, ball.y);
        
        if (d < this.s + ball.s && ball != this) {
            let a = Math.acos((this.x - ball.x) / d);
            let d2 = Math.sqrt(Math.pow(this.x - mouse.x, 2) + Math.pow(this.y - mouse.y, 2));

            if (this.y < ball.y)
                a *= -1;
            if (mouse.Left == "mousedown" && d2 < 100) {

                let v1 = this.v;
                let v2 = ball.v;
                let m1 = Math.pow(this.s, 2) * 3.14;
                let m2 = Math.pow(ball.s, 2) * 3.14;
                let theta1 = Math.acos(this.fx / this.v);
                let theta2 = Math.acos(ball.fx / ball.v);

                if (!theta1)
                    theta1 = 0;

                if (!theta2)
                    theta2 = 0;

                if (this.fy < 0)
                    theta1 *= -1;

                if (ball.fy < 0)
                    theta2 *= -1;


            let x = ((ball.x + this.x) / 2) + (this.s + ball.s) * Math.cos(a) * .5;
            let y = ((ball.y + this.y) / 2) + (this.s + ball.s) * Math.sin(a) * .5;
            ball.x = ((ball.x + this.x) / 2) + (this.s + ball.s) * Math.cos(a + 3.14159265359) * .5;
            ball.y = ((ball.y + this.y) / 2) + (this.s + ball.s) * Math.sin(a + 3.14159265359) * .5;
            this.x = x;
            this.y = y;

            let loss = .8;
            if (this.x < this.s || this.x > canvas.width - this.s) {

                loss = .5;
                if (this.x > canvas.width - this.s) {
                    ball.x += canvas.width - this.s - this.x;
                    this.x += canvas.width - this.s - this.x;
                }
                else {
                    ball.x += this.s - this.x;
                    this.x += this.s - this.x;
                }
            }

            if (ball.x < ball.s || ball.x > canvas.width - ball.s) {

                loss = .5;
                if (ball.x > canvas.width - ball.s) {
                    this.x += canvas.width - ball.s - ball.x;
                    ball.x += canvas.width - ball.s - ball.x;
                }
                else {
                    this.x += ball.s - ball.x;
                    ball.x += ball.s - ball.x;
                }
            }

            if (this.y < this.s || this.y > canvas.height - this.s) {

                loss = .5;
                if (this.y > canvas.height - this.s) {
                    this.y += canvas.height - this.s - this.y;
                    ball.y += canvas.height - this.s - this.y;
                }
                else {
                    this.y += this.s - this.y;
                    ball.y += this.s - this.y;
                }
            }

            if (ball.y < ball.s || ball.y > canvas.height - ball.s) {

                loss = .5;
                if (ball.y > canvas.height - ball.s) {
                    this.y += canvas.height - ball.s - ball.y;
                    ball.y += canvas.height - ball.s - ball.y;
                }
                else {
                    this.y += ball.s - ball.y;
                    ball.y += ball.s - ball.y;
                }
            }

            this.fx = (((v1 * Math.cos(theta1 - a) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - a)) / (m1 + m2)) * Math.cos(a) + v1 * Math.sin(theta1 - a) * Math.cos(a + 3.14 / 2)) * .8;
            this.fy = (((v1 * Math.cos(theta1 - a) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - a)) / (m1 + m2)) * Math.sin(a) + v1 * Math.sin(theta1 - a) * Math.sin(a + 3.14 / 2)) * .8;

            ball.fx = (((v2 * Math.cos(theta2 - a) * (m2 - m1) + 2 * m1 * v1 * Math.cos(theta1 - a)) / (m1 + m2)) * Math.cos(a) + v2 * Math.sin(theta2 - a) * Math.cos(a + 3.14 / 2)) * .8;
            ball.fy = (((v2 * Math.cos(theta2 - a) * (m2 - m1) + 2 * m1 * v1 * Math.cos(theta1 - a)) / (m1 + m2)) * Math.sin(a) + v2 * Math.sin(theta2 - a) * Math.sin(a + 3.14 / 2)) * .8;

            }
            else {

                let l = (this.s + ball.s - d) * 0.1;
                this.fx += Math.cos(a) * l;
                this.fy += Math.sin(a) * l;
                ball.fx -= Math.cos(a) * l;
                ball.fy -= Math.sin(a) * l;
            }
        }
    }

    calc() {
        //if (this.newx) {
        //    this.x = this.newx;
        //    this.y = this.newy;
        //    this.fx = this.newfx;
        //    this.fy = this.newfy;
        //}
    }

    draw() {
        circle(this.x, this.y, this.s, "rgb(0, 0, 0, .4)");
    }
}

let balls = [];
function setup() {

    let s = 3;
    for (let i = 0; i < 200; ++i)
        balls.push(new Ball(s + Math.random() * (canvas.width - s*2), canvas.height - Math.random() * 100, s));


}

let player = {x: 0, y: 315, s: 20, fx: 0, fy: 0};

function update() {


    image(-100, 0, .3, "barn");
    circle(player.x, player.y, player.s, "rgb(0, 0, 0, 1)");
    player.x += player.fx;
    player.y += player.fy;

    if (player.y + player.s > canvas.height) {
        player.y = canvas.height - player.s
        player.fy = 0;
        if (key.w == "keydown")
            player.fy -= 4;
    }
    else player.fy += .2;

    balls.forEach(ball => {

        let d = Math.sqrt(Math.pow(player.x - ball.x, 2) + Math.pow(player.y - ball.y, 2));

        if (d < player.s + ball.s) {
            let a = Math.acos((ball.x - player.x)/d);
            if (ball.y < player.y)
                a *= -1;

            ball.x = player.x + (player.s + ball.s) * Math.cos(a);
            ball.y = player.y + (player.s + ball.s) * Math.sin(a);
            ball.fx += Math.cos(a);
            ball.fy += Math.sin(a);
        }
    });

    if (key.d == "keydown")
        player.fx += .1;
    if (key.a == "keydown")
        player.fx -= .1;

    if (mouse.Left == "mousedown")
        ring(mouse.x, mouse.y, 100, 2, "rgb(0, 0, 0, .2)");

    balls.forEach(ball => ball.tick());
    for (let i = 0; i < balls.length - 1; ++i) {
        for (let q = i + 1; q < balls.length; ++q) {
            balls[i].collision(balls[q]);
        }
    }
    

    let y0 = [canvas.height, 0]
    balls.forEach(ball => {
        if (ball.y - ball.s < y0[0])
            y0[0] = ball.y - ball.s * balls.length / 10
        if (ball.y + ball.s > y0[1])
            y0[1] = ball.y + ball.s * balls.length / 10
    });

    let x0 = [canvas.width, 0]
    balls.forEach(ball => {
        if (ball.x - ball.s < x0[0])
            x0[0] = ball.x - ball.s
        if (ball.x + ball.s > x0[1])
            x0[1] = ball.x + ball.s
    });



    x0[0] = findMinX(x0[0], y0[0], y0[1]);
    x0[1] = findMaxX(x0[1], y0[0], y0[1]);

    rectangle(x0[0], y0[0], x0[1] - x0[0], y0[1] - y0[0], "rgb(200, 0, 0, .2)");


    ctx.beginPath()
    ctx.strokeStyle = "rgb(80, 147, 200, .5)";
    ctx.lineWidth = 2;
    let line = false;
    for (let x = x0[0]; x < x0[1]; ++x) {
        for (let y = y0[0]; y < y0[1]; y += 5) {

            if (get_d(x, y)) {
                if (!line) {
                    do {
                        --y;
                    } while (get_d(x, y));

                    ctx.moveTo(x, y);
                    line = true;
                }
            } else if (line){

                do {
                    --y;
                } while (!get_d(x, y));

                ctx.lineTo(x, y);
                ctx.stroke();
                line = false;
                ctx.beginPath()
            }
        }

        if (line) {

            let y = y0[1];
            if (get_d(x, y0[1])) {

                do {
                    ++y;
                } while (get_d(x, y));
            }
            else {
                do {
                    --y;
                } while (!get_d(x, y));

            }

            ctx.lineTo(x, y);
            ctx.stroke();
            line = false;
            ctx.beginPath()
        }
    }

    balls.forEach(ball => ball.draw());
}

function get_d(x, y) {

    let d = 0;
    for (let i = 0; i < balls.length; ++i) {
        d += 1 / (1 + (Math.pow(balls[i].x - x, 2) + Math.pow(balls[i].y - y, 2)) / Math.pow(balls[i].s, 2));
    }

    return d > .5;
}

function findMaxX(x, y0, y1) {

    while(true) {
        ++x;
        let found = false;
        for (let y = y0; y < y1; ++y) {
            if (get_d(x, y)) {
                found = true;
            }
        }

        if (!found)
            return x;

    }
}


function findMinX(x, y0, y1) {

    while (true) {
        --x;
        let found = false;
        for (let y = y0; y < y1; ++y) {
            if (get_d(x, y)) {
                found = true;
            }
        }

        if (!found)
            return x;

    }
}