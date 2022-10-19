const canvasArea = document.getElementById("canvas-area");
const ctx = canvasArea.getContext("2d");
canvasArea.width = window.innerWidth * 0.7;
canvasArea.height = window.innerHeight * 0.8;
ctx.fillStyle = "red";

let lines = [];
(dots = []), (tempDots = []), (startX = 0), (startY = 0);

canvasArea.addEventListener("mousedown", drawLine);

canvasArea.addEventListener("contextmenu", stopMove);
//function for fist and second click. put start point and activate move listener
function drawLine(e) {
  if (startX === 0 && startY === 0 && e.button === 0) {
    startX = e.offsetX;
    startY = e.offsetY;
    canvasArea.addEventListener("mousemove", stretch);
  } else {
    if (e.button === 0) {
      lines.push(startX, startY, e.offsetX, e.offsetY);
      dots = [...dots, ...tempDots];
      tempDots = [];
      stopMove();
    }
  }
}
//function while event move is active. cls and print all lines and dots (temporary and permanent) every move.
function stretch(eMove) {
  stretchLine(eMove, startX, startY);
}
function stretchLine(eMove, startX, startY) {
  ctx.clearRect(0, 0, canvasArea.width, canvasArea.height);
  tempDots = [];
  drawLines();
  drawCircles(dots);
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(eMove.offsetX, eMove.offsetY);
  ctx.stroke();
  onlineDots(startX, startY, eMove.offsetX, eMove.offsetY, lines);
  drawCircles(tempDots);
}
//while right button clicked. clr (temporary dots and line) and draw permanents lines and dots
function stopMove() {
  canvasArea.removeEventListener("mousemove", stretch);
  ctx.clearRect(0, 0, canvasArea.width, canvasArea.height);
  drawLines();
  drawCircles(dots);
  startX = 0;
  startY = 0;
}
//draw lines function from coordinates array
function drawLines() {
  for (let i = 0; i <= lines.length - 4; i += 4) {
    ctx.beginPath();
    ctx.moveTo(lines[i], lines[i + 1]);
    ctx.lineTo(lines[i + 2], lines[i + 3]);
    ctx.stroke();
  }
}
//draw dots function from coordinates array (temporary and permanent)
function drawCircles(arr) {
  for (let i = 0; i <= arr.length - 2; i += 2) {
    ctx.beginPath();
    ctx.arc(arr[i], arr[i + 1], 4, 0, 2 * Math.PI);
    ctx.fill();
  }
}
//
function onlineDots(x3, y3, x4, y4, arr) {
  for (let i = 0; i <= arr.length - 4; i += 4) {
    const x1 = arr[i],
      y1 = arr[i + 1],
      x2 = arr[i + 2],
      y2 = arr[i + 3];
    //school geometry. find cross line coordinates
    const xCross = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    const yCross = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    //make order
    const x1max = Math.max(x1, x2);
    const x1min = Math.min(x1, x2);
    const x2max = Math.max(x3, x4);
    const x2min = Math.min(x3, x4);
    const y1max = Math.max(y1, y2);
    const y1min = Math.min(y1, y2);
    const y2max = Math.max(y3, y4);
    const y2min = Math.min(y3, y4);
    // check if cross point belongs to both lines
    if (
      xCross < canvasArea.width &&
      xCross > 0 &&
      yCross < canvasArea.height &&
      yCross > 0 &&
      x1max >= xCross &&
      x1min <= xCross &&
      y1max >= yCross &&
      y1min <= yCross &&
      x2max >= xCross &&
      x2min <= xCross &&
      y2max >= yCross &&
      y2min <= yCross
    ) {
      tempDots.push(xCross, yCross);
    }
  }
}
//collapsing effect function using same functions for lines and dots drawing but from other arrays
function collapse() {
  for (let j = 1; j < 80; j++) {
    let tempLines = [];
    setTimeout(function interval() {
      for (let i = 0; i <= lines.length - 4; i += 4) {
        const x1 = lines[i];
        const y1 = lines[i + 1];
        const x2 = lines[i + 2];
        const y2 = lines[i + 3];
        const xCenter = (x1 + x2) / 2;
        const yCenter = (y1 + y2) / 2;
        const k = 79 - j;
        const x1new = (xCenter + k * x1) / (1 + k);
        const y1new = (yCenter + k * y1) / (1 + k);
        const x2new = (xCenter + k * x2) / (1 + k);
        const y2new = (yCenter + k * y2) / (1 + k);
        tempLines.push(x1new, y1new, x2new, y2new);
        onlineDots(x1new, y1new, x2new, y2new, tempLines);
      }
      ctx.clearRect(0, 0, canvasArea.width, canvasArea.height);
      lines = [...tempLines];
      drawLines();
      drawCircles(tempDots);
      tempDots = [];
      dots = [];
    }, j * 40);
  }
}
//The End!!!
