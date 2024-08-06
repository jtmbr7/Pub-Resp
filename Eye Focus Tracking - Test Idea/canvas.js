class Position {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	distance(position) {
		return Math.sqrt(Math.pow(this.x - position.x, 2) + Math.pow(this.y - position.y, 2));
	}

	add(x, y) {
		return new Position(this.x + x, this.y + y);
	}

	circulation(angle, radius) {
		return new Position(this.x + radius * Math.cos(angle), this.y + radius * Math.sin(angle));
	}

	angle(position) {
		let d = this.distance(position);
		let angle = Math.acos((position.x - this.x)/d);
		if(this.y > position.y)
			angle *= -1;
		return angle;
	}
}

var key = {}
onkeydown = onkeyup = function (e) { key[e.key] = e.type; }

let mouse = {position: new Position(undefined, undefined), previousPosition:  new Position(undefined, undefined)};
onmousedown = onmouseup = function (e) {
	if (e.button == 0) mouse.Left = e.type;
	else if (e.button == 2) mouse.Right = e.type;
}

document.addEventListener("mousemove", function (e) {
	mouse.position.x = e.clientX;
	mouse.position.y = e.clientY;
});

function resetKeys() {
	for (let element in key)
		if (key[element] == "keyup")
			key[element] = undefined;

	if (mouse.Right == "mouseup")
		mouse.Right = undefined;

	if (mouse.Left == "mouseup") {
		mouse.Left = undefined;
		mouse.locked = false;
	}
	
	mouse.previousPosition.x = mouse.position.x;
	mouse.previousPosition.y = mouse.position.y;
}

// -------------------- CANVAS -------------------- //
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let running = true;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.addEventListener('contextmenu', event => event.preventDefault());

function error(text) {
	console.log('%c' + text, 'color: rgb(250, 0, 0)');
	clearInterval(game);
}

function animate(currentTime) {

	if (key.Escape == "keydown") {
		running = false;
		clearInterval(fps_call);
	}

	ctx.fillStyle = "rgb(250, 250, 250, 1)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);


	update();
	
	resetKeys();

	if (running)
		requestAnimationFrame(animate);
}

setup();
requestAnimationFrame(animate);