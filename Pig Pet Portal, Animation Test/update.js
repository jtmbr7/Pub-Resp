
function get_pig() {
    return [
        {
            shape: "body",
            axis: {
                x: {
                    d: 0,
                },
                y: {
                    d: 0,
                },
                z: {
                    d: 0,
                },
            },
            size: 1,
        },
        {
            shape: "body",
            axis: {
                x: {
                    d: .3,
                },
                y: {
                    d: 0,
                },
                z: {
                    d: 0,
                },
            },
            size: 1,
        },
        {
            shape: "body",
            axis: {
                x: {
                    d: -.3,
                },
                y: {
                    d: 0,
                },
                z: {
                    d: 0,
                },
            },
            size: 1,
        },
        {
            shape: "foot",
            axis: {
                x: {
                    d: -.75,
                    sway: {
                        x: { d: .4, value: 0, dir: 1, speed: 1},
                    },
                },
                y: {
                    d: .8,
                },
                z: {
                    d: 0,
                },
            },
            size: .45,
        },
        {
            shape: "foot",
            axis: {
                x: {
                    d: .6,
                    sway: {
                        x: {d: .4, value: 0, dir: -1, speed: 1},
                    },
                },
                y: {
                    d: .8,
                },
                z: {
                    d: 0,
                },
            },
            size: .45,
        },
        {
            shape: "foot",
            axis: {
                x: {
                    d: -.75,
                    sway: {
                        x: { d: .4, value: 0, dir: -1, speed: 1 },
                    },
                },
                y: {
                    d: .8,
                },
                z: {
                    d: -1,
                },
            },
            size: .45,
        },
        {
            shape: "foot",
            axis: {
                x: {
                    d: .6,
                    sway: {
                        x: { d: .4, value: 0, dir: 1, speed: 1 },
                    },
                },
                y: {
                    d: .8,
                },
                z: {
                    d: -1,
                },
            },
            size: .45,
        },
        {
            shape: "head",
            axis: {
                x: {
                    d: 1.1,
                },
                y: {
                    d: -.6,
                },
                z: {
                    d: 0,
                },
            },
            size: .9,
        },
        {
            shape: "ear",
            axis: {
                x: {
                    sway: {
                        x: { d: .1, value: 0, dir: 1, speed: .25 },
                    },
                    d: .7,
                    forces: {
                        x: -.1,
                    },

                },
                y: {
                    sway: {
                        x: { d: .1, value: 0, dir: -1, speed: .25 },
                    },
                    d: -1.2,
                },
                z: {
                    d: 0,
                },
            },
            size: .4,
        },
        {
            shape: "ear",
            axis: {
                x: {
                    sway: {
                        x: { d: .1, value: 0, dir: -1, speed: .25 },
                    },
                    d: .7,
                    forces: {
                        x: -.1,
                    },

                },
                y: {
                    sway: {
                        x: { d: .1, value: 0, dir: 1, speed: .25 },
                    },
                    d: -1.2,
                },
                z: {
                    d: -1,
                },
            },
            size: .4,
        },
        {
            shape: "nose",
            axis: {
                x: {
                    d: 1.85,
                    sway: {
                        x: { d: .04, value: .1, dir: 1, speed: .1 },
                    },
                },
                y: {
                    d: -.35,
                },
                z: {
                    d: 0,
                },
            },
            size: .4,
        },
        {
            shape: "tail",
            axis: {
                x: {
                    d: -1.2,
                },
                y: {
                    d: -.1,
                    sway: {
                        x: { d: .05, value: .05, dir: -1, speed: .125 },
                    },
                },
                z: {
                    d: 0,
                },
            },
            size: .2,
        },
        {
            shape: "tail",
            axis: {
                x: {
                    d: -1.3,
                },
                y: {
                    d: -.02,
                    sway: {
                        x: { d: .05, value: .05, dir: -1, speed: .125 },
                    },
                },
                z: {
                    d: 0,
                },
            },
            size: .2,
        },
        {
            shape: "tail",
            axis: {
                x: {
                    d: -1.2,
                },
                y: {
                    d: .1,
                    sway: {
                        x: { d: .05, value: .05, dir: -1, speed: .125 },
                    },
                },
                z: {
                    d: 0,
                },
            },
            size: .2,
        },
        {
            shape: "eye",
            axis: {
                x: {
                    sway: {
                        x: { d: .02, value: 0, dir: 1, speed: .05 },
                    },
                    d: 1.26,
                },
                y: {
                    sway: {
                        x: { d: .05, value: 0, dir: -1, speed: .125 },
                    },
                    d: -.6,
                },
                z: {
                    d: 0,
                },
            },
            size: .4,
        },
    ];
}

class Part {

    r = 150 + Math.random() * 40;
    g = 120;
    b = 200;
    constructor(data) {
        for (let prop in data)
            this[prop] = data[prop];
    }

    tick(unit) {

        for (let axis in this.axis) {

            for (let sway in this.axis[axis].sway) {
                this.axis[axis].sway[sway].value += this.axis[axis].sway[sway].speed * Math.abs(unit["f" + sway]) * this.axis[axis].sway[sway].dir / unit.s;
                while (Math.abs(this.axis[axis].sway[sway].value) > this.axis[axis].sway[sway].d) {
                    this.axis[axis].sway[sway].value = this.axis[axis].sway[sway].d * 2 * this.axis[axis].sway[sway].dir - this.axis[axis].sway[sway].value;
                    this.axis[axis].sway[sway].dir *= -1;
                }
            }


            let d = this.axis[axis].d;
            for (let force in this.axis[axis].forces)
                d += unit["f" + force] * this.axis[axis].forces[force] * unit.turn;

            for (let sway in this.axis[axis].sway) {
                d += this.axis[axis].sway[sway].value;
            }

            if (axis == "x")
                d *= unit.turn;


            this.axis[axis].value = unit[axis] + unit.s * d;
        }

        this.s = unit.s * this.size;

        this.hls = this.s * (0.8 - 0.01 * (20 - this.s))
        this.c = rgb(this.r, this.g, this.b);
        this.shc = rgb(this.r - 50, this.g - 50, this.b - 50);
        this.hlc = rgb(this.r + 50, this.g + 50, this.b + 50);
    }

    x() {
        return this.axis.x.value;
    }

    y() {
        return this.axis.y.value;
    }
}

class Unit {

    s = 20;
    fx = 0;
    fy = 0;
    turn = 1;
    parts = [];
    sway = 0;
    swaydir = 1;
    thoughts = [];

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = 0;

        let data = get_pig();
        for (let prop in data) {
            this.parts.push(new Part(data[prop]));
        }

        console.log(this.parts)
    }

    tick() {
        this.x += this.fx;
        this.y += this.fy;
        this.sway += this.fx * this.swaydir / this.s;


        if (this.fx != 0)
            this.turn = Math.sign(this.fx);

        this.parts.forEach(part => part.tick(this));
    }

    draw() {

        for (let i = 0; i < this.parts.length - 1; ++i) {
            let part = this.parts[i];
            circle(part.x(), part.y(), part.s + 2, part.shc);
        }

        for (let i = 0; i < this.parts.length - 1; ++i) {
            let part = this.parts[i];

            circle(part.x(), part.y(), part.s, part.c);
        }

        for (let i = 0; i < this.parts.length - 1; ++i) {
            let part = this.parts[i];
            if (part.axis.z.value < 0)
                continue;

            if (part.shape == "nose" && this.turn == 1)
                continue;

            if (part.shape == "tail" && this.turn == -1)
                continue;
            if (i == 13)
                continue;

            circle(part.x() - part.s * 0.1, part.y() - part.s * 0.1, part.hls, part.hlc);
        }

        let part = this.parts[this.parts.length - 1];

        circle(part.x(), part.y() - 3, 5, rgb(0, 0, 0));
        circle(part.x(), part.y(), 5, rgb(0, 0, 0));
        circle(part.x(), part.y(), 4, rgb(60, 130, 200));
        circle(part.x(), part.y(), 2, rgb(90, 180, 240));
        circle(part.x() - 2, part.y() - 3, 2, rgb(250, 250, 250));

        for (let i = 0; i < this.thoughts.length; ++i) {
            this.thoughts[i].draw(i);
        }
    }
    

    speak(text) {
        this.thoughts.push(new Thought(this, text));
        setTimeout(this.greet, 3000, this.thoughts[this.thoughts.length - 1], this);
    }

    greet(thought, unit) {
        unit.thoughts.splice(thought, 1);
    }
}


let grasses = [];
let units = [];
function setup() {
    units.push(new Unit(200, 673));
    units.push(new Unit(400, 673));

    let n = 100;
    for (let i = 0; i < n; ++i) {
        grasses.push({ x: i * canvas.width / (n - 1), y: 700 + Math.random() * 5, s: Math.random() * 10 + 5, r: 86 + Math.random() * 20, g: 125 + Math.random() * 20, b: 70 + Math.random() * 20});
        grasses[i].c = rgb(grasses[i].r, grasses[i].g, grasses[i].b);
    }

    grasses = grasses.sort((prev, curr) => {return (prev.r + prev.g + prev.b > curr.r + curr.g + curr.b) ? prev : curr});
}

class Thought {

    h = 40;
    constructor(unit, text) {
        this.unit = unit;
        this.text = text;
        ctx.font = "22px Arial";
        this.w = ctx.measureText(this.text).width + 20;
    }

    draw(i) {
        rectangle(this.unit.x - this.w / 2 - 5, this.unit.y - 50 - (this.h + 20) * (i + 1) - 5, this.w + 10, this.h + 10, "rgb(0, 0, 0, 1)");
        rectangle(this.unit.x - this.w / 2, this.unit.y - 50 - (this.h + 20) * (i + 1), this.w, this.h, "rgb(250, 250, 250, 1)");

        triangle(this.unit.x, this.unit.y - 55 - (this.h + 20) * (i),
            this.unit.x + 15, this.unit.y - 70 - (this.h + 20) * (i),
            this.unit.x - 15, this.unit.y - 70 - (this.h + 20) * (i),
            "rgb(0, 0, 0, 1)")
        triangle(this.unit.x, this.unit.y - 60 - (this.h + 20) * (i),
            this.unit.x + 10, this.unit.y - 70 - (this.h + 20) * (i),
            this.unit.x - 10, this.unit.y - 70 - (this.h + 20) * (i),
            "rgb(250, 250, 250, 1)")

        text(this.unit.x - this.w/2 + 10, this.unit.y - this.h/3 - 10 - (60) * (i + 1), 22, "rgb(0, 0, 0, 1)", this.text);
    }
}

let talk = ["I'm hungry!", "Give me food!", "Do you have an orange?", "It's a beutiful day for a vegan lifestyle!", "My name is Daniel", "Have you seen my lemon?", "I love citrus!"];
function update() {

    image(0, 0, .63, "barn")
    image(300, 200, 2, "cload")
    if (key.w == "keyup") {
        let k = Math.floor(Math.random() * talk.length);
        units[0].speak(talk[k]);
    }


    rectangle(0, 700, canvas.width, canvas.height - 700, "rgb(112, 84, 62, 1)");

    if (key.d == "keydown")
        units[0].fx += .1;
    if (key.a == "keydown")
        units[0].fx -= .1;

    units.forEach(unit => unit.tick());
    units.forEach(unit => unit.draw());
    grasses.forEach(grass => circle(grass.x, grass.y, grass.s, grass.c));
}