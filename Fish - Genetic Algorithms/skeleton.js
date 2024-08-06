class Skeleton {

    points = [];
    joints = [];
    eyes = [];
    velocity = 0;
    constructor(fish) {
        this.fish = fish;
        this.position = fish.position;
        this.size = fish.size;
        this.angle = fish.angle;

        Skeleton.data.joints.forEach(joint => this.joints.push(new Joint(this, this.joints[joint.host], joint.length, joint.angle, joint.max_bend, joint.sway)));
        Skeleton.data.points.forEach(point => this.points.push(new Point(this, this.joints[point.host], point.dx, point.dy, point.dz)));
    }

    tick() {
        this.size = this.fish.size;
        this.angle = this.fish.angle;
        this.position = this.fish.position;
        this.joints.forEach(joint => joint.tick());
        this.points.forEach(point => point.tick());
    }

    draw() {
        this.draw_skin();
        this.joints.forEach(joint => joint.draw());
        this.points.forEach(point => point.draw());

    }

    draw_skin() {
        
        this.eyes.forEach(eye => eye.draw());
    }
}

class Joint {

    t = 0;
    static color = "rgb(200, 0, 80, 1)";
    constructor(skeleton, host = skeleton, length, initialAngle, max_bend = 0, sway = 0) {

        this.sway = sway;
        this.skeleton = skeleton;
        this.ds = length;
        this.length = length * skeleton.size;
        this.angle = new Angle(host.angle.value + initialAngle + Math.PI);
        this.initialAngle = initialAngle;
        this.host = host;
        this.position = host.position.circulation(this.length, this.angle.value + Math.PI);
        this.max_bend = max_bend;
    }

    tick() {
        this.length = this.ds * this.skeleton.size;
        if(this.skeleton.joints.indexOf(this) > 8)
        this.length  *= (this.skeleton.fish.maxSpeed + 1) * .2;

        this.angle.set(this.position.angle(this.host.position) + Math.sin(this.skeleton.fish.sway.t) * this.skeleton.fish.sway.length * this.sway);

        let midpoint_angle = this.host.position.signed_angle(this.host.position.circulation(this.length, this.initialAngle + this.host.angle.value));
        let overspilled_angle = angle_between(midpoint_angle, this.host.position.signed_angle(this.position));

        if(Math.abs(overspilled_angle) > this.max_bend)
            this.angle.set(midpoint_angle + Math.PI - this.max_bend * Math.sign(overspilled_angle));

        this.position = this.host.position.circulation(this.length, this.angle.value + Math.PI)
    }

    draw() {
        circle(this.position, 4, Joint.color);
        line(this.position, this.position.circulation(this.length, this.angle), Joint.color);
        //text(this.position, 10, skeleton.joints.indexOf(this), {rgb: "black"})
    }
}

class Point {

    static color = "rgb(0, 200, 0, 1)";

    constructor(skeleton, host = skeleton, dx, dy, dz = 0) {
        this.host = host;
        this.skeleton = skeleton;

        this.d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        let a = Math.acos(dx/this.d);
        if(dy < 0)
            a *= -1;
        if(!a)
            a = 0;
        
        a += host.angle.value

        this.position = new Position(host.position.x + skeleton.size * this.d * Math.cos(a), host.position.y + skeleton.size * this.d * Math.sin(a), skeleton.size * dz);
        this.length = this.d * skeleton.size;
        this.angle = this.position.angle(host.position) - this.host.angle.value - Math.PI;
        if(!this.angle)
            this.angle = 0;
    }

    tick() {
        this.length = this.d * this.skeleton.size;

        this.position.x = this.host.position.x + this.length * Math.cos(this.angle + this.host.angle.value);
        this.position.y = this.host.position.y + this.length * Math.sin(this.angle + this.host.angle.value);
    }

    draw() {
        circle(this.position, 2, Point.color);
        //text(this.position, 10, this.skeleton.points.indexOf(this), {rgb: "black"})
    }
}