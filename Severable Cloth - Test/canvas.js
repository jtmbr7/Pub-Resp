


// -------------------- KEYS -------------------- //
var key = {}
onkeydown = onkeyup = function(e){ key[e.key] = e.type; }

let mouse = {};
onmousedown = onmouseup = function(e){ 
	if(e.button == 0) mouse.Left = e.type;
	else if(e.button == 2) mouse.Right = e.type;
}

document.addEventListener("mousemove", function(e){

	mouse.x = e.clientX;
	mouse.y = e.clientY;
});

function resetKeys() {

	for(let element in key) {
		if(key[element] == "keyup"){ key[element] = undefined; }
	}

	if(mouse.Right == "mouseup") mouse.Right = undefined;
	if(mouse.Left == "mouseup") mouse.Left = undefined;
}
 
// -------------------- CANVAS -------------------- //
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let running = true;

canvas.width = window.innerWidth - 300;
canvas.height = window.innerHeight - 20;


function getTotalWidth(){
	return canvas.height;
}

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
	fps_average = (fps_average * n + 1000/dt)/(n + 1);

	if (key.Escape == "keydown") {
		running = false;
		clearInterval(fps_call);
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "rgb(0, 0, 250, .1)"
	ctx.linewidth = 1;


	update(dt / 1000);
	update(dt / 1000);
	update(dt / 1000);
	text(canvas.width - 90, 30, 20, "rgb(0, 0, 0, 1)", "FPS: " + fps);
	text(canvas.width - 190, 60, 20, "rgb(0, 0, 0, 1)", "Average FPS: " + fps_average);
	
	// KeyEvents
	resetKeys();
	mouse.prevx = mouse.x;
	mouse.prevy = mouse.y;

	if (running)
		requestAnimationFrame(animate);
}

setup();
requestAnimationFrame(animate);


let fps_call = setInterval(function () { fps = Math.round(1000 / dt);}, 1000);