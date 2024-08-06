


// -------------------- KEYS -------------------- //
var key = {}
onkeydown = onkeyup = function (e) { key[e.key] = e.type; }

let mouse = {position: new Position(0, 0), previousPosition: new Position(0, 0)};
onmousedown = onmouseup = function (e) {
	if (e.button == 0) mouse.Left = e.type;
	else if (e.button == 2) mouse.Right = e.type;
}

document.addEventListener("mousemove", function (e) {

	mouse.position = new Position(e.clientX, e.clientY);
});

function resetKeys() {

	for (let element in key) {
		if (key[element] == "keyup") { key[element] = undefined; }
	}

	if (mouse.Right == "mouseup") mouse.Right = undefined;
	if (mouse.Left == "mouseup")  {mouse.Left = undefined; mouse.locked = false;}
}

// -------------------- CANVAS -------------------- //
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let running = true;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;;

document.addEventListener('contextmenu', event => event.preventDefault());

function error(text) {
	console.log('%c' + text, 'color: rgb(250, 0, 0)');
	clearInterval(game);
}


let dt = 0;
let previousTime = 0;
let fps = 0;
let fps_average = 0;
let n = 0;
function animate(currentTime) {

	fps.average += fps;
	++n;
	dt = currentTime - previousTime;
	previousTime = currentTime;
	fps_average = (fps_average * n + 1000 / dt) / (n + 1);

	if (key.Escape == "keydown") {
		running = false;
		clearInterval(fps_call);
	}

	rectangle({x: 0, y: 0}, canvas.width, canvas.height, "rgb(140, 180, 200, 1)")


	update(dt / 1000);
	text(canvas.width - 90, 30, 20, "rgb(0, 0, 0, 1)", "FPS: " + fps);
	text(canvas.width - 190, 60, 20, "rgb(0, 0, 0, 1)", "Average FPS: " + fps_average);

	// KeyEvents
	resetKeys();
	mouse.previousPosition = new Position(mouse.position.x, mouse.position.y);

	if (running)
		requestAnimationFrame(animate);
}

setup();
requestAnimationFrame(animate);


let fps_call = setInterval(function () { fps = Math.round(1000 / dt); }, 1000);