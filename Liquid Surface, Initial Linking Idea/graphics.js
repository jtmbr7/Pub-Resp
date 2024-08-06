 
 function loadImage(url) {
  return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = url; });
}

 function image(x, y, s, ref) {
	var img = document.getElementById(ref);

	ctx.drawImage(img, x, y, img.width * s, img.height * s);
 }

function pyt(x, y) {
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function distance3(x1, y1, z1, x2, y2, z2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2));
}

function rgb(r, g, b, a = 1) {

	return "rgb("+r+","+g+","+b+","+a+")";
}

function rectangle(x, y, w, h, c) {

	//Draw Path
	ctx.fillStyle = c;
	ctx.fillRect(x, y, w, h);
}

function border(x, y, w, h, c, t = 1) {

	//Draw Path
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + w, y);
	ctx.lineTo(x + w, y + h);
	ctx.lineTo(x, y + h);
	ctx.closePath();
	ctx.strokeStyle = c;
	ctx.lineWidth = t;
	ctx.stroke();
}

function text(x, y, s, c, t) {
	
	ctx.font = s + "px Arial";
	ctx.fillStyle = c;
	ctx.fillText(t, x, y);
	
} 

function hexagon(x, y, s, c, a_start = 0) {

	let a = 6.28/6;
	for(let i = 0; i < 6; ++i) {
		triangle(x, y,
				 x + s * Math.cos(a * i + a_start), y + s * Math.sin(a * i + a_start),
				 x + s * Math.cos(a * (1+i) + a_start), y + s * Math.sin(a * (1+i) + a_start),
				 c);
	}
}

function frame(x, y, w, h, t, c) {

	//Draw Path
	ctx.fillStyle = c;
	ctx.fillRect(x - t, y - t, w + t * 2, t);
	ctx.fillRect(x - t, y, t, h + t);
	ctx.fillRect(x + w, y, t, h + t);
	ctx.fillRect(x, y + h, w, t);
}

function circle(x, y, s, c) {

	//Set Path
	ctx.beginPath();
	ctx.arc(x, y, s, 0, 2 * Math.PI);
	
	//Draw Path
	ctx.fillStyle = c;
	ctx.fill();
}


function ring(x, y, s, t, c) {

	//Set Path
	ctx.beginPath();
	ctx.arc(x, y, s + t/2, 0, 2 * Math.PI);
	
	//Draw Path
	ctx.lineWidth = t;
	ctx.strokeStyle = c;
	ctx.stroke();
}

function triangle(x1, y1, x2, y2, x3, y3, c) {
	
	//Set Path
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x3, y3);
	ctx.closePath();
	
	//Draw Path
	ctx.fillStyle = c;
	ctx.fill();
}