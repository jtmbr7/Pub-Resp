class Seaurchin {

    static objects = [];

    static color = new Color(150, 50, 150, 1, true)
    spikes = [];

    constructor(position) {

        this.position = position;
        this.size = 15 + Math.random() * 10;

        this.spikes.push(Math.round(Math.random() * 6) + 12);
        for(let i = 0; i < 2; ++i)
            this.spikes.push(this.spikes[i] - (3 + Math.round(Math.random() * 2)));
    }

    draw() {
        drawStar(this.position, this.spikes[0], this.size, this.size * .4, Seaurchin.color.sh);  
        drawStar(this.position, this.spikes[1], this.size * .8, this.size * .2, Seaurchin.color.rgb); 
        drawStar(this.position, this.spikes[2], this.size * .6, 0, Seaurchin.color.hl);  
    }

    static spawnRandom(n) {
        
        for(let i = 0; i < n; ++i)
            Seaurchin.objects.push(new Seaurchin(new Position(Math.random() * canvas.width, Math.random() * canvas.height)));
    }

    static draw() {
        Seaurchin.objects.forEach(obj => obj.draw());
    }
}