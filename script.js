export default class DrawLines {
  constructor() {
    this.lines = [];
    this.dots = [];
    this.tempDots = [];
    this.tempLines = [];
    this.startX = 0;
    this.startY = 0;
    this.ctx = {};
    this.canvasArea = {};
    this.stretchName = this.stretch.bind(this);
    this.collapseName = this.collapse.bind(this);
    this.renderCanvas();
    this.getCanvas();
  }

  getTemplate() {
    return `<canvas oncontextmenu="return false;" id="canvas-area"></canvas>
        <input  class="collapse-button" type="button" value="collapse lines" >`;
  }

  renderCanvas() {
    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper;
  }

  getCanvas() {
    const canvasArea = this.element.querySelector("#canvas-area");
    this.canvasArea = canvasArea;
    const collapseButton = this.element.querySelector(".collapse-button");
    canvasArea.width = window.innerWidth * 0.7;
    canvasArea.height = window.innerHeight * 0.8;
    const ctx = canvasArea.getContext("2d");
    this.ctx = ctx;

    canvasArea.addEventListener("mousedown", (event) => {
      this.drawLine(event);
    });
    canvasArea.addEventListener("contextmenu", () => {
      this.stopMove();
    });

    collapseButton.addEventListener("click", this.collapseName);
  }

  drawLine(e) {
    if (this.startX === 0 && this.startY === 0 && e.button === 0) {
      this.startX = e.offsetX;
      this.startY = e.offsetY;
      this.canvasArea.addEventListener("mousemove", this.stretchName);
    } else {
      if (e.button === 0) {
        this.lines.push(this.startX, this.startY, e.offsetX, e.offsetY);
        this.dots = [...this.dots, ...this.tempDots];
        this.tempDots = [];
        this.stopMove();
      }
    }
  }

  stopMove() {
    const canvasArea = this.element.querySelector("#canvas-area");
    canvasArea.removeEventListener("mousemove", this.stretchName);
    this.ctx.clearRect(0, 0, canvasArea.width, canvasArea.height);
    this.drawLines(this.lines);
    this.drawCircles(this.dots);
    this.startX = 0;
    this.startY = 0;
  }

  stretch(e) {
    this.ctx.clearRect(0, 0, this.canvasArea.width, this.canvasArea.height);
    this.tempDots = [];
    this.drawLines(this.lines);
    this.drawCircles(this.dots);
    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    this.ctx.lineTo(e.offsetX, e.offsetY);
    this.ctx.stroke();
    this.onlineDots(this.startX, this.startY, e.offsetX, e.offsetY, this.lines);
    this.drawCircles(this.tempDots);
  }

  drawLines(lines) {
    for (let i = 0; i <= lines.length - 4; i += 4) {
      this.ctx.fillStyle = "red";
      this.ctx.beginPath();
      this.ctx.moveTo(lines[i], lines[i + 1]);
      this.ctx.lineTo(lines[i + 2], lines[i + 3]);
      this.ctx.stroke();
    }
  }
  drawCircles(arr) {
    for (let i = 0; i <= arr.length - 2; i += 2) {
      this.ctx.beginPath();
      this.ctx.arc(arr[i], arr[i + 1], 4, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  onlineDots(x3, y3, x4, y4, arr) {
    for (let i = 0; i <= arr.length - 4; i += 4) {
      const x1 = arr[i],
        y1 = arr[i + 1],
        x2 = arr[i + 2],
        y2 = arr[i + 3];
      const xCross = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
      const yCross = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
      const x1max = Math.max(x1, x2);
      const x1min = Math.min(x1, x2);
      const x2max = Math.max(x3, x4);
      const x2min = Math.min(x3, x4);
      const y1max = Math.max(y1, y2);
      const y1min = Math.min(y1, y2);
      const y2max = Math.max(y3, y4);
      const y2min = Math.min(y3, y4);
      if (
        xCross < this.canvasArea.width &&
        xCross > 0 &&
        yCross < this.canvasArea.height &&
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
        this.tempDots.push(xCross, yCross);
      }
    }
  }

  collapse() {
    for (let j = 1; j < 80; j++) {
      setTimeout(
        function () {
          const arr = this.lines;
          for (let i = 0; i <= arr.length - 4; i += 4) {
            const x1 = arr[i];
            const y1 = arr[i + 1];
            const x2 = arr[i + 2];
            const y2 = arr[i + 3];
            const xCenter = (x1 + x2) / 2;
            const yCenter = (y1 + y2) / 2;
            const k = 79 - j;
            const x1new = (xCenter + k * x1) / (1 + k);
            const y1new = (yCenter + k * y1) / (1 + k);
            const x2new = (xCenter + k * x2) / (1 + k);
            const y2new = (yCenter + k * y2) / (1 + k);
            this.tempLines.push(x1new, y1new, x2new, y2new);
            this.onlineDots(x1new, y1new, x2new, y2new, this.tempLines);
          }
          this.ctx.clearRect(0, 0, this.canvasArea.width, this.canvasArea.height);
          this.lines = [...this.tempLines];
          this.drawLines(this.lines);
          this.drawCircles(this.tempDots);
          this.tempDots = [];
          this.dots = [];
          this.tempLines = [];
        }.bind(this),
        j * 40
      );
    }
  }
}
