
class Color {
    constructor(r, g, b, a = 1, extended) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.rgb = "rgb("+ r + "," + g + "," + b + "," + a + ")";
        if(extended) {
            this.sh = "rgb("+ (r - 50) + "," + (g - 50) + "," + (b - 50) + "," + a + ")";
            this.hl = "rgb("+ (r + 50) + "," + (g + 50) + "," + (b + 50) + "," + a + ")";
        }
    }
}

const light = normalize([1, 1, -1]);

function shading(p1, p2, p3) {

    let A = {x: p2.position.x - p1.position.x, y: p2.position.y - p1.position.y, z: p2.position.z - p1.position.z};
    let B = {x: p3.position.x - p1.position.x, y: p3.position.y - p1.position.y, z: p3.position.z - p1.position.z};
    let N = normalize([A.y * B.z - A.z * B.y, A.z * B.x - A.x * B.z, A.x * B.y - A.y * B.x]);

    return (Math.cos(Math.acos(N[0] * light[0] + N[1] * light[1] + N[2] * light[2]/((Math.pow(N[0], 2) + Math.pow(N[1], 2) + Math.pow(N[2], 2)) * (Math.pow(light[0], 2) + Math.pow(light[1], 2) + Math.pow(light[2], 2))))) + 1) * 1/2 + .4;
    
}

function normalize(v) {

    let k = 0;
    v.forEach(x => {k += Math.pow(x, 2)});
    let l = Math.sqrt(k);
    let newV = [];
    v.forEach(x => {newV.push(x/l)});
    return newV;
}

class Position {
    constructor(x, y, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    distance(position) {
        return Math.sqrt(Math.pow(this.x - position.x, 2) + Math.pow(this.y - position.y, 2));
    }

    circulation(radius, angle) {
        if(angle.value != undefined)
            angle = angle.value

        return new Position(this.x + radius * Math.cos(angle), this.y + radius * Math.sin(angle));
    }

    angle(position, distance = Math.sqrt(Math.pow(this.x - position.x, 2) + Math.pow(this.y - position.y, 2))) {
        
        let angle = Math.acos((position.x - this.x)/distance);
        if(position.y < this.y)
            angle = Math.PI * 2 - angle;
        return angle;
    }

    signed_angle(position) {

        let distance = Math.sqrt(Math.pow(this.x - position.x, 2) + Math.pow(this.y - position.y, 2));
        let angle = Math.acos((position.x - this.x)/distance);
        if(position.y < this.y)
            angle *= -1;
        return angle;
    }

    move(velocity, angle) {
        this.x += velocity * Math.cos(angle.value);
        this.y += velocity * Math.sin(angle.value);
    }
}

class Angle {
    constructor(value) {
        this.value = value;
        this.normalize();
    }

    turn(value) {
        this.value += value;
        this.normalize();
    }

    normalize() {
        while(this.value > Math.PI * 2)
            this.value -= Math.PI * 2;

        while(this.value < 0)
            this.value += Math.PI * 2;
    }

    set(value) {
        this.value = value;
        this.normalize();
    }

    add(value) {
        return new Angle(this.value + value);
    }

    direction(angle) {
        while(angle < 0)
            angle += Math.PI * 2;
        while(angle > Math.PI * 2)
            angle -= Math.PI * 2;

        if(Math.abs(this.value - angle) > Math.PI)
            return Math.sign(this.value - angle);
        else return -Math.sign(this.value - angle);
    }

    distance(angle) {

        let d = Math.abs(this.value - angle);

        if(d > Math.PI) 
            d = Math.PI * 2 - d;
        return d;

    }
}

function angle_between(a1, a2) {
    let a = a1 - a2;

    if(a > Math.PI)
        a -= Math.PI * 2;
    if(a < -Math.PI)
        a += Math.PI * 2;

    return a;
}