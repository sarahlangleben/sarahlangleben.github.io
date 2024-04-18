var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 40;
var dx = 1;
var dy = 1;
var radius = 1;


function midCircle() {
  ctx.beginPath();
  // DEFINE THESE COLORS LATER
  ctx.fillStyle = "#FFFFFF"
  ctx.arc(x, y, 100, 0, 2 * Math.PI);
  ctx.fill();
}
function scndCircle() {
  ctx.beginPath();
  ctx.fillStyle = "#FFFFFF"
  ctx.arc(x, y, 200, 0, 2 * Math.PI);
  ctx.fill();
}
function thrdCircle() {
  ctx.beginPath();
  ctx.fillStyle = "#FFFFFF"
  ctx.arc(x, y, 300, 0, 2 * Math.PI);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  thrdCircle();
  scndCircle();
  midCircle();

  if (x + dx > canvas.width - radius || x + dx < radius) {
    dx = -dx;
  }
  if (x + dy > canvas.height - radius || y + dy < radius) {
    dy = -dy;
  }
  x += dx;
  y += dy;
}
setInterval(draw, 20);
