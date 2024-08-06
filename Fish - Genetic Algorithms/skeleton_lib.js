class Eye {

    light = 1;
    colors = [
        {r: 50, g: 50, b: 50},
        {r: 250, g: 250, b: 250},
        {r: 20, g: 50, b: 150},
        {r: 20, g: 150, b: 150},
        {r: 50, g: 250, b: 250},
        {r: 250, g: 250, b: 250},
        {},
    ];

    constructor(host, vertex, dx, dy) {
        this.host = host;
        this.vertex = vertex;
        this.size = host.size * .1;

        this.d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        let a = Math.acos(dx/this.d);
        if(dy < 0)
            a *= -1;

        this.position = new Position(host.position.x + host.size * this.d * Math.cos(a), host.position.y + host.size * this.d * Math.sin(a))

        this.distance = this.d * this.host.size;
        this.angle = this.host.position.angle(this.position, this.distance);
    }

    tick() {

        this.colors[6] = {r: this.host.r, g: this.host.g, b: this.host.b}
        this.distance = this.d * this.host.size;
        this.size = this.host.size * .1 + (this.host.vision + 1) * .005;
        let vertex = Fish.vertices[this.vertex];
        this.s = shading(this.host.skeleton.points[vertex[0]], this.host.skeleton.points[vertex[1]], this.host.skeleton.points[vertex[2]]);
        this.colors.forEach(color => color.rgb = rgb(color.r * this.s, color.g * this.s, color.b * this.s))

        this.position.x = this.host.position.x + this.distance * Math.cos(this.angle + this.host.angle.value)
        this.position.y = this.host.position.y + this.distance * Math.sin(this.angle + this.host.angle.value)
    }

    draw() {

        circle(this.position, this.size, this.colors[0].rgb);
        circle(this.position.circulation(this.size * .5, Math.PI + this.host.angle.value), this.size, this.colors[0].rgb);
        circle(this.position, this.size * .8, {rgb: this.colors[1].rgb});
        circle(this.position.circulation(this.size * .5, Math.PI + this.host.angle.value), this.size * .8, this.colors[2].rgb);
        circle(this.position, this.size * .6, this.colors[3].rgb);
        circle(this.position.circulation(this.size * .1, 0), this.size * .4, this.colors[4].rgb);
        circle(this.position.circulation(this.size * .5, 5 * Math.PI/4), this.size * .4, this.colors[5].rgb);
        
        if(this.host.tired)
        circle(this.position.circulation(this.size * .5, Math.PI + this.host.angle.value), this.size * 1.1, this.colors[6].rgb);

    }
}

function draw_skin (fish) {
    Fish.vertices.forEach((vertex, i) =>{
        
        let points = [fish.skeleton.points[vertex[0]], fish.skeleton.points[vertex[1]], fish.skeleton.points[vertex[2]]];
        let s = shading(points[0], points[1], points[2]);
        let c = fish.colors[vertex[3]];
    
        triangle(
            points[0].position,
            points[1].position,
            points[2].position,
            rgb(c.r * s, c.g * s, c.b * s, c.a)
        )
    });
}

Skeleton.data = {
    joints: [
        {
            length: .4,
            angle: Math.PI,
            max_bend: .2,
        },
        {
            length: .15,
            angle: Math.PI,
            host: 0,
            max_bend: .4,
            sway: .3,
        },
        {
            length: .15,
            angle: Math.PI,
            host: 1,
            max_bend: .4,
        },
        {
            length: .15,
            angle: Math.PI,
            host: 2,
            max_bend: .4,
        },
        {
            length: .15,
            angle: Math.PI,
            host: 3,
            max_bend: .4,
        },
        {
            length: .5,
            angle: Math.PI/2,
            max_bend: 0,
        },
        {
            length: .5,
            angle: -Math.PI/2,
            max_bend: 0,
        },
        {
            length: .4,
            angle: -Math.PI/2 - .4,
            host: 5,
            max_bend: .6,
        },
        {
            length: .4,
            angle: Math.PI/2 + .4,
            host: 6,
            max_bend: .6,
        },
        {
            length: .6,
            angle: Math.PI + .35,
            host: 4,
            max_bend: .3,
        },
        {
            length: .6,
            angle: Math.PI - .35,
            host: 4,
            max_bend: .3,
        },
        {
            length: .7,
            angle: Math.PI + .7,
            host: 4,
            max_bend: .2,
        },
        {
            length: .7,
            angle: Math.PI - .7,
            host: 4,
            max_bend: .2,
        },
        {
            length: .7,
            angle: Math.PI + 1.1,
            host: 4,
            max_bend: .4,
        },
        {
            length: .7,
            angle: Math.PI - 1.1,
            host: 4,
            max_bend: .4,
        },
        {
            length: .3,
            angle: Math.PI - .7,
            host: 11,
            max_bend: .5,
        },
        {
            length: .3,
            angle: Math.PI + .7,
            host: 12,
            max_bend: .5,
        },
    ],
    points: [
        {
            dx: 0,
            dy: 0,
            dz: .6,
        },
        {
            dx: 0,
            dy: 0,
            dz: 1,
            host: 0,
        },
        {
            dx: 0,
            dy: 0,
            dz: .8,
            host: 1,
        },
        {
            dx: 0,
            dy: 0,
            dz: .4,
            host: 2,
        },
        {
            dx: 0,
            dy: 0,
            dz: .2,
            host: 3,
        },
        {
            dx: 0,
            dy: 0,
            host: 4,
        },
        {
            dx: 0,
            dy: 0,
            host: 5,
        },
        {
            dx: 0,
            dy: 0,
            host: 6,
        },
        {
            dx: 0,
            dy: 0,
            dz: .3,
            host: 7,
        },
        {
            dx: 0,
            dy: 0,
            dz: .3,
            host: 8,
        },
        {
            dx: 0,
            dy: -.3,
            host: 0,
        },
        {
            dx: 0,
            dy: .3,
            host: 0,
        },
        {
            dx: 0,
            dy: -.2,
            host: 1,
        },
        {
            dx: 0,
            dy: .2,
            host: 1,
        },
        {
            dx: 0,
            dy: -.15,
            host: 2,
        },
        {
            dx: 0,
            dy: .15,
            host: 2,
        },
        {
            dx: 0,
            dy: -.1,
            host: 3,
        },
        {
            dx: 0,
            dy: .1,
            host: 3,
        },
        {
            dx: .7,
            dy: -.2,
        },
        {
            dx: .7,
            dy: .2,
        },
        {
            dx: .3,
            dy: -.5,
        },
        {
            dx: .3,
            dy: .5,
        },
        {
            dx: -.53,
            dy: -.8,
        },
        {
            dx: -.53,
            dy: .8,
        },
        {
            dx: 0,
            dy: 0,
            dz: -.2,
            host: 9,
        },
        {
            dx: 0,
            dy: 0,
            dz: -.2,
            host: 10,
        },
        {
            dx: 0,
            dy: 0,
            dz: .1,
            host: 11,
        },,
        {
            dx: 0,
            dy: 0,
            dz: .1,
            host: 12,
        },
        {
            dx: 0,
            dy: 0,
            dz: .3,
            host: 13,
        },
        {
            dx: 0,
            dy: 0,
            dz: .3,
            host: 14,
        },
        {
            dx: 0,
            dy: 0,
            dz: .1,
            host: 15,
        },
        {
            dx: 0,
            dy: 0,
            dz: .1,
            host: 16,
        }
    ],
};

Fish.vertices = [
    [0, 19, 18, 1],
    [0, 18, 20, 1],
    [0, 21, 19, 1],
    [0, 6, 21, 1],
    [0, 20, 7, 1],
    [0, 7, 10, 1],
    [0, 7, 10, 1],
    [0, 11, 6, 1],
    [0, 10, 1, 1],
    [0, 1, 11, 1],
    [1, 10, 12, 1],
    [1, 13, 11, 1],
    [1, 12, 2, 1],
    [1, 2, 13, 1],
    [2, 12, 14, 1],
    [2, 15, 13, 1],
    [2, 14, 3, 1],
    [2, 3, 15, 1],
    [3, 14, 16, 1],
    [3, 17, 15, 1],
    [3, 16, 4, 1],
    [3, 4, 17, 1],
    [4, 16, 5, 1],
    [4, 5, 17, 1],
    [7, 9, 10, 0],
    [6, 11, 8, 0],
    [7, 22, 9, 0],
    [6, 8, 23, 0],
    [5, 24, 25, 0],
    [5, 26, 24, 0],
    [5, 25, 27, 0],
    [5, 27, 29, 0],
    [5, 28, 26, 0],
    [28, 30, 26, 0],
    [29, 27, 31, 0],
    [24, 26, 30, 0],
    [25, 31, 27, 0],
];