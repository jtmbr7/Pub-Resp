
class Brain {
    values = [];
    constructor(fish, n) {
        
        this.fish = fish;
        this.n = n;
        this.currentDecision = 0;
        this.currentAngle = 0;

        this.values = [];
        for(let i = 0; i < this.n; ++i)
            this.values.push(0)
    }

    tick() {
        this.values = [];
        for(let i = 0; i < this.n; ++i)
            this.values.push(0);

        Seaurchin.objects.forEach(seaurchin => {
        
            let distance = seaurchin.position.distance(this.fish.position);
            if(distance < this.fish.size + this.fish.vision + seaurchin.size) {

                let angle = this.fish.position.angle(seaurchin.position);
                let start = Math.floor(this.n * angle/(Math.PI * 2));
                
                let d = Math.abs(distance * Math.sin(new Angle(Math.PI * 2 * start / this.n).distance(angle)));
                
                this.values[start] -= 30;
                
                for(let q = -1; q <= 1; q += 2) {
                    for(let current = q; Math.abs(current) < this.n/4; current += q) {

                        let i = start + current;
                        if(i >= this.n)
                            i -= this.n;
                        else if(i < 0)
                            i += this.n;
    
                        d = Math.abs(distance * Math.sin(new Angle(Math.PI * 2 * i / this.n).distance(angle)));
    
                        if(d <= seaurchin.size + this.fish.size)
                            this.values[i] -= 30;
                        else break;
                    }
                }
            }
        });

        
        Fish.objects.forEach(fish => {
            
            if(this.fish.size/fish.size > 1.3 || this.fish.size/fish.size < 0.77 ) {
                
                let k = Math.sign(this.fish.size/fish.size - 1);
                let distance = fish.position.distance(this.fish.position);

                if(distance < this.fish.size + this.fish.vision + fish.size) {

                    let dir = Math.floor(this.n * this.fish.position.angle(fish.position)/(Math.PI * 2));

                    let value = 10000 / (distance)
                    this.values[dir] += k * value;
                    for(let i = 1; i < this.n/2; ++i) {

                        let high = dir + i;
                        let low = dir - i;
                        if(high >= this.n)
                            high -= this.n;

                        if(low < 0)
                            low += this.n;
                        this.values[high] += k * (value - value * 2 * i/this.n);
                        this.values[low] += k * (value - value * 2 * i/this.n);
                    }
                }
            }

        });

        
        Food.objects.forEach(food => {

            let distance = food.position.distance(this.fish.position);
            if(distance < this.fish.size + this.fish.vision + food.size)
                this.values[Math.floor(this.n * this.fish.position.angle(food.position)/(Math.PI * 2))] += 100 / (distance/(this.fish.size + food.size));
        });

    }

    draw() {
        let step = Math.PI * 2/this.n;
        let angle = -step/2;
        let length = 40

        for(let i = 0; i < this.values.length; ++i) {
            ctx.beginPath();
            ctx.moveTo(this.fish.position.x, this.fish.position.y);
            ctx.arc(this.fish.position.x, this.fish.position.y, length, angle + .01, angle + step - .01)
            ctx.closePath();

            let color = Math.round(250 - Math.abs(this.values[i]) * 2.5)
            if(this.values[i] >= 0)
                ctx.fillStyle = rgb(color, 250, color, .5);
            else
                ctx.fillStyle = rgb(250, color, color, .5);

            if(i == this.currentDecision) {
                ctx.strokeStyle = "rgb(0, 0, 250, .5)";
                ctx.stroke();
            }
            ctx.fill();

            angle += step;
        }

    }
}