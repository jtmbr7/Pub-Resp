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
 

function polygon(position, positions, width, height, color) {
	ctx.beginPath();
	ctx.moveTo(position.x + positions[0].x * width, position.y + positions[0].y * height);

	for(let i = 1; i < positions.length; ++i)
		ctx.lineTo(position.x + positions[i].x * width, position.y + positions[i].y * height);

	ctx.fillStyle = color;
	ctx.fill();
}
function rgb(r, g, b, a = 1) {

	return "rgb("+r+","+g+","+b+","+a+")";
}

function border(position, w, h, c, t = 1) {

	ctx.beginPath();
	ctx.moveTo(position.x, position.y);
	ctx.lineTo(position.x + w, position.y);
	ctx.lineTo(position.x + w, position.y + h);
	ctx.lineTo(position.x, position.y + h);
	ctx.closePath();
	ctx.lineWidth = t;
	ctx.strokeStyle = c;
	ctx.stroke();
}

function rectangle(position, w, h, c) {

	//Draw Path
	ctx.fillStyle = c;
	ctx.fillRect(position.x, position.y, w, h);
}

function image(position, ref, s) {
	var img = document.getElementById(ref);
	console.log(img.width)
	console.log(img.height)
	ctx.drawImage(img, position.x, position.y, canvas.height * img.width/img.height, canvas.height);
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

function text(position, s, c, t, center = false) {
	
	ctx.font = s + "px Arial";
	let l = 0;
	if(center)
		l = ctx.measureText(t).width/2;

	ctx.fillStyle = c;
	ctx.fillText(t, position.x - l, position. y);
	
} 

function circle(position, s, c) {

	//Set Path
	ctx.beginPath();
	ctx.arc(position.x, position.y, s, 0, 2 * Math.PI);
	
	//Draw Path
	ctx.fillStyle = c;
	ctx.fill();
}