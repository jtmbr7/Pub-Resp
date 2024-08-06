class Food {

    static objects = [];
    static color = new Color(100, 140, 50, 1, true);
    constructor(position) {
        this.position = position;
        this.updateSize(5)
    }

    draw() {
        circle(this.position, this.sh_size, Food.color.sh)
        circle(this.position, this.size, Food.color.rgb)
        circle(this.hl.position, this.hl.size, Food.color.hl)
    }

    updateSize(value) {
        this.size = value;
        this.sh_size = value + 3;
        this.hl = {
            size: value * .7,
            position: new Position(this.position.x - value * .1, this.position.y - value * .1)
        };
    }

    eat(fish) {
        
        if(this.size > 0) {
            this.updateSize(this.size - 1);
            for(let i = 0; i < 10; ++i)
                Particle.objects.push(new Particle(this.position, 100, 140, 50));
            ++fish.foodCount;
            fish.energy += 10;
        }
    }

    static spawnRandom(n) {
        
        for(let i = 0; i < n; ++i)
            Food.objects.push(new Food(new Position(Math.random() * canvas.width, Math.random() * canvas.height)));
    }

    static draw() {
        Food.objects.forEach(obj => obj.draw());
    }

    static clear() {
        for(let i = 0; i < Food.objects.length; ++i)
            if(Food.objects[i].size == 0) {
                Food.objects.splice(i, 1)
                --i;
            }
    }
}