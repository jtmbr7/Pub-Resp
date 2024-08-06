

class Particle {
    static objects = [];

    constructor(position, r = 50, g = 50, b = 50) {
        
        this.position = new Position(position.x, position.y);
        this.velocity = Math.random() * 1 + 1;
        this.angle = Math.random() * 2 * Math.PI;
        this.size = Math.random() * 4 + 4;
        this.color = rgb(Math.random() * 40 + r, Math.random() * 40 + g, Math.random() * 40 + b);
        
    }

    tick() {

        this.size -= .5;
        this.position.x += this.velocity * Math.cos(this.angle);
        this.position.y += this.velocity * Math.sin(this.angle);
    }

    draw() {
        circle(this.position, this.size, this.color);
    }

    static tick() {
        Particle.objects.forEach(obj => obj.tick());
    }

    static draw() {
        Particle.objects.forEach(obj => obj.draw());
    }

    static clear() {
        
        for(let i = 0; i < Particle.objects.length; ++i)
            if(Particle.objects[i].size <= 0) {
                Particle.objects.splice(i, 1)
                --i;
            }
    }
}