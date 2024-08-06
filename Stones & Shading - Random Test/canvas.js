


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

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;


function getTotalWidth(){
	return canvas.height;
}

document.addEventListener('contextmenu', event => event.preventDefault());

function error(text) {
	console.log('%c' + text, 'color: rgb(250, 0, 0)');
	clearInterval(game);
}

function animate() {
	
	if(key.Escape == "keydown") clearInterval(game);
	rectangle(0, 0, canvas.width, canvas.height, rgb(255, 255, 255));
	update();
	resetKeys();
	
	
	// Mouse
	mouse.prevx = mouse.x;
	mouse.prevy = mouse.y;
	
}


let fps = 60; 
let game = setInterval(function(){animate();}, 1000/fps)
setup();