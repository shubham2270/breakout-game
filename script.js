const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const drawCircle = (x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, 2 * Math.PI, false);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
};

const detectCollision = () => {
  if (x + dx >= canvas.width || x + dx < 0) {
    dx = -dx;
  }

  if (y + dy > canvas.height || y + dy < 0) {
    dy = -dy;
  }
};

const setVariables = () => {
  x = canvasH / 2;
  y = canvasW - 20;

  dx = 5; //small increment in pixels
  dy = -5;
};

const checkGameOver = () => {
  if (y + dy === canvas.height) {
    alert("Game Over!");
    clearInterval(interval);

    setVariables();
  }
};

const canvasH = canvas.height;
const canvasW = canvas.width;

let x, y, dy, dx;
setVariables();

drawCircle(x, y);

let interval;

const startGame = () => {
  interval = setInterval(() => {
    detectCollision();
    x = x + dx;
    y = y + dy;

    checkGameOver();

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
    drawCircle(x, y);
  }, 10);
};

startGame();
