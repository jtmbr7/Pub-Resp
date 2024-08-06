let gui;

function setup() {
    gui = new GUI();
    Seaurchin.spawnRandom(20);
    Food.spawnRandom(30);
}

function update() {
   
    gui.tick();
    if(gui.playButton.value) {
        Fish.tick();
        Particle.tick();

        Food.clear();
        Particle.clear();
        Fish.clear();
    }

    Particle.draw();
    Food.draw();
    Egg.draw();
    Seaurchin.draw();
    Fish.draw();
    gui.draw()
}

function newDay() {

    let data = {};
    Fish.properties.forEach(prop => {
        data[prop[0]] = {value: 0, range: [prop[1], prop[2]]};
    })

    for(let prop in data) {
        Fish.objects.forEach(fish =>{
            data[prop].value += fish[prop];
        });

        data[prop].value /= Fish.objects.length;
    }

    for(let prop in data) {
        let range = data[prop].range;
        data[prop] = data[prop].value - range[0];
        data[prop] /= range[1] - range[0];
    }

    console.log(data)

    
    Fish.objects.forEach(fish => {
        ++fish.age;
        if(fish.age > 1) {
            fish.alive = false;
        }
        else {
            fish.tired = true;
            fish.energy = 0;
        }
    });
    Egg.hatch();
    Food.spawnRandom(10);
}