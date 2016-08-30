/*
 *Project: canvas.particles.js
 *Author: PJY
 *Date: 2016.08.30
 *LICENSE: MIT
 */

var canvas = document.getElementById("my"),
	ctx = canvas.getContext("2d"),
	width = document.body.clientWidth,
	height = document.body.clientHeight,
	distance = 300,
	lineColor = "rgba(255, 255, 255, 0.5)",
	points = [],
	movePoints = {};

canvas.width = width;
canvas.height = height;

for(let i = 0; i < 20; i++) {
	points.push(getPointData(1));
}

function getPointData(radius) {

	var x = Math.ceil(Math.random()*width),
		y = Math.ceil(Math.random()*height),
		r = +(Math.random()*radius + 2).toFixed(4),
		rateX = +(Math.random()*2-1).toFixed(4),
		rateY = +(Math.random()*2-1).toFixed(4);

	return {
		x: x,
		y: y,
		r: r,
		rateX: rateX,
		rateY: rateY
	}

}

function getPosition(ev) {
	var ev = window.event;
	var x, y;
  if (ev.layerX || ev.layerX == 0) {
    x = ev.layerX;
    y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) { // Opera
    x = ev.offsetX;
    y = ev.offsetY;
  }
  return {x: x, y: y};
}

var EventUtil = {

    addEvent: function(element, type, handler){
        if (element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent){
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },

	removeEvent: function(element, type, handler){
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    }

}

EventUtil.addEvent(canvas, "mousemove", function(e) {
	var ev = window.event || e;
	movePoints = getPosition(ev);
});

function drawPoints() {
	points.forEach(function(item) {
		ctx.beginPath()
		ctx.arc(item.x, item.y, item.r, 0, Math.PI*2, false);
		ctx.fillStyle = "rgba(255, 255, 255, "+ (item.r-2)/1 +")";
		ctx.fill();
	});
}

function dis(x1, y1, x2, y2) {
	var disX = Math.abs(x1 - x2),
		disY = Math.abs(y1 - y2);

	return Math.sqrt(disX * disX + disY * disY);
}

function drawLines() {

	for(let i = 0, len = points.length;i < len;i++) {
		for(let j = len - 1; j >= 0; j--) {
			let x1 = points[i].x,
				y1 = points[i].y,
				x2 = points[j].x,
				y2 = points[j].y,
				disPoint = dis(x1, y1, x2, y2);

			if(disPoint <= distance) {
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.strokeStyle = lineColor;
				ctx.lineWidth = 1 - disPoint/distance;
				ctx.stroke();
			}
		}
		let x1 = movePoints.x,
			y1 = movePoints.y,
			x2 = points[i].x,
			y2 = points[i].y;

		var d = dis(x1, y1, x2, y2);
		if(d <= distance) {
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.strokeStyle = lineColor;
			ctx.lineWidth = 1;
			ctx.stroke();
		}
	}

}

function move() {
	ctx.clearRect(0, 0, width, height);
	points.forEach(function(item, i) {
		if(item.x > 0 && item.x < width && item.y > 0 && item.y < height) {
			item.x += item.rateX*2;
			item.y += item.rateY*2;
		} else {
			points.splice(i, 1);
			points.push(getPointData(1));
		}
	});
	drawPoints();
	drawLines();
	window.requestAnimationFrame(move);

}
move();