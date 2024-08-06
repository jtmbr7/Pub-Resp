 
 
function rgb(r, g, b, a = 1) {

	return "rgb("+r+","+g+","+b+","+a+")";
}

function rectangle(position, w, h, c) {

	//Draw Path
	ctx.fillStyle = c;
	ctx.fillRect(position.x, position.y, w, h);
}

function line(p1, p2, t, c) {
	ctx.beginPath();
	ctx.moveTo(p2.x, p2.y);
	ctx.lineTo(p1.x, p1.y);
	ctx.lineWidth = t;
	ctx.strokeStyle = c;
	ctx.stroke();
}

function bar(position, width, height, c) {

	ctx.beginPath();
	ctx.moveTo(position.x, position.y);
	ctx.arc(position.x, position.y, height/2, Math.PI/2, 3 * Math.PI/2);
	ctx.arc(position.x + width, position.y, height/2, 3 * Math.PI/2, Math.PI/2);
	ctx.lineTo(position.x, position.y + height/2);

	ctx.fillStyle = c;
	ctx.fill();

}

function star(position, outerRadius, innerRadius, c) {

	circle(position, outerRadius * 1.1, "rgb(250, 250, 250, .2)");
	innerRadius = outerRadius * innerRadius;
	ctx.beginPath();
	ctx.moveTo(position.x + outerRadius, position.y);
	
	for(let i = 1; i <= 4; ++i) {
		let a1 = i * Math.PI * 2 / 4;
		let a2 = (i - .5) * Math.PI * 2 / 4;
		ctx.lineTo(position.x + innerRadius * Math.cos(a2), position.y + innerRadius * Math.sin(a2));
		ctx.lineTo(position.x + outerRadius * Math.cos(a1), position.y + outerRadius * Math.sin(a1));
	}


	ctx.fillStyle = c;
	ctx.fill();
}

function text(position, s, c, t) {
	
	ctx.font = s + "px Arial";
	ctx.fillStyle = c;
	ctx.fillText(t, position.x,position. y);
	
} 

function circle(position, s, c) {

	//Set Path
	ctx.beginPath();
	ctx.arc(position.x, position.y, s, 0, 2 * Math.PI);
	
	//Draw Path
	ctx.fillStyle = c;
	ctx.fill();
}