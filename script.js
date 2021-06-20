const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");

const canvasH = canvas.height;
const canvasW = canvas.width;

let rightPressed = false;
let leftPressed = false;

// Navigate paddle left & right
const paddleNavigation = () => {
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      rightPressed = true;
    }

    if (e.key === "ArrowLeft") {
      leftPressed = true;
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "ArrowRight") {
      rightPressed = false;
    }

    if (e.key === "ArrowLeft") {
      leftPressed = false;
    }
  };

  const handleRightButtonDown = () => {
    rightBtn.style.backgroundColor = "#B3E283";
    rightPressed = true;
  };

  const handleRightButtonUp = () => {
    rightBtn.style.backgroundColor = "#e8e46e";
    rightPressed = false;
  };
  const handleLeftButtonDown = () => {
    leftBtn.style.backgroundColor = "#B3E283";
    leftPressed = true;
  };

  const handleLeftButtonUp = () => {
    leftBtn.style.backgroundColor = "#e8e46e";
    leftPressed = false;
  };

  rightBtn.addEventListener("mousedown", handleRightButtonDown);
  rightBtn.addEventListener("mouseup", handleRightButtonUp);
  leftBtn.addEventListener("mousedown", handleLeftButtonDown);
  leftBtn.addEventListener("mouseup", handleLeftButtonUp);

  /* Feature detection */
  let passiveIfSupported = false;

  try {
    window.addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
        get: function () {
          passiveIfSupported = { passive: true };
        },
      })
    );
  } catch (err) {}

  window.addEventListener(
    "scroll",
    function (event) {
      /* do something */
      // can't use event.preventDefault();
    },
    passiveIfSupported
  );

  rightBtn.addEventListener(
    "touchstart",
    handleRightButtonDown,
    passiveIfSupported
  );
  rightBtn.addEventListener(
    "touchend",
    handleRightButtonUp,
    passiveIfSupported
  );
  leftBtn.addEventListener(
    "touchstart",
    handleLeftButtonDown,
    passiveIfSupported
  );
  leftBtn.addEventListener("touchend", handleLeftButtonUp, passiveIfSupported);

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
};

const handleKeyDown = (e) => {
  if (e.key === "ArrowRight") {
    rightPressed = true;
  }

  if (e.key === "ArrowLeft") {
    leftPressed = true;
  }
};

const handleKeyUp = (e) => {
  if (e.key === "ArrowRight") {
    rightPressed = false;
  }

  if (e.key === "ArrowLeft") {
    leftPressed = false;
  }
};

// draws the score
const drawScore = () => {
  ctx.beginPath();
  ctx.fillStyle = "#000";
  ctx.font = `15px Verdana`;
  ctx.fill();
  ctx.fillText(`Score: ${score}`, canvasW - 60, 15);
  ctx.closePath();
};

// draws the ball
const drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#ff449f";
  ctx.fill();
  ctx.closePath();
};

// Draws the paddle
const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleW, 10);
  ctx.fillStyle = "#00ead3";
  ctx.fill();
  ctx.closePath();
};

const detectCollision = () => {
  // Detect if ball is colliding left or right side of box;
  if (x + dx >= canvasW || x + dx < 0) {
    paddleHitSound.play();

    dx = -dx;
  }

  const paddleStart = x + dx > paddleX; // checks starting of paddle
  const paddleEnd = x + dx < paddleX + paddleW; // checks end of paddle

  // Detect collision with paddle
  if (y + dy >= canvasH - radius) {
    if (paddleStart && paddleEnd) {
      wallHitSound.play();
      dy = -dy;
      dx = dx + (x + dx - paddleX) / 100; // send ball to different direction
      //depending on position of paddle
    }
  }

  // Detect if ball collision with ceiling of box;
  if (y + dy < 0) {
    paddleHitSound.play();

    dy = -dy;
  }

  // loop over bricks array & get x & y values
  for (let b = 0; b < bricks.length; b++) {
    for (let i = 0; i < bricks[b].length; i++) {
      const brick = bricks[b][i];

      // Detect collision with bricks
      if (brick.isVisible) {
        if (
          x > brick.x &&
          x < brick.x + brickW &&
          y > brick.y &&
          y < brick.y + brickH
        ) {
          brickBreakSound.play();
          bricks[b][i].isVisible = false;
          score += 1;
          dy = -dy;
          checkYouWon();
        }
      }
    }
  }
};

// Set the starting position of ball & default distance it will travel
const setVariables = () => {
  x = canvasW / 2;
  y = canvasH - 20;
  radius = 10;
  paddleW = 50;
  paddleX = canvasW / 2 - 40;
  paddleY = canvasH - 10;
  dx = 5; //small increment in pixels
  dy = -5;
  rightPressed = false;
  leftPressed = false;

  brickW = 30;
  brickH = 10;
  brickOffset = 10;

  score = 0;
};

// check if ball touches bottom of box & give alert of game over
const checkGameOver = () => {
  if (y === canvasH) {
    gameOverSound.play();
    alert("Game Over!");
    clearInterval(interval);
    interval = null;
    setVariables();
    createBrickArray();
  }
};

// check if ball touches bottom of box & give alert of game over
const checkYouWon = () => {
  if (score === 27) {
    youWonSound.play();
    alert("You Won!");
    clearInterval(interval);
    interval = null;
    setVariables();
    createBrickArray();
  }
};

const startGame = () => {
  if (!interval) {
    startSound.play();
    interval = setInterval(() => {
      if (rightPressed) {
        paddleX = paddleX + 5;
      }
      if (leftPressed) {
        paddleX = paddleX - 5;
      }
      detectCollision();
      x = x + dx;
      y = y + dy;

      checkGameOver();

      ctx.clearRect(0, 0, canvasW, canvasH);
      drawBall();
      drawPaddle();
      drawBricks();
      drawScore();
    }, 20);
  }
};

// let brickW = 50;
// let brickH = 10;
// let brickOffset = 10; // gap between bricks
let brickCount = 9;

// stores positions of bricks
let bricks = [];

// holds the state of bricks
const createBrickArray = () => {
  for (let j = 0; j < 3; j++) {
    bricks[j] = [];

    for (let i = 0; i < brickCount; i++) {
      bricks[j][i] = { x: 0, y: 0, isVisible: true };
    }
  }
};

// Draw bricks
const drawBricks = () => {
  // Draw brick vertically
  for (let j = 0; j < 3; j++) {
    // Draw brick horizontally
    for (let i = 0; i < brickCount; i++) {
      // only draw is isVisible is true
      if (bricks[j][i].isVisible) {
        const brickX = 10 + i * (brickW + brickOffset);
        const brickY = (brickOffset + 10) * (j + 1);
        // Stores the position of bricks into array
        bricks[j][i].x = brickX;
        bricks[j][i].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickW, brickH);
        ctx.fillStyle = "#00ead3";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};

const startSound = new Audio("./assets/sounds/begin_game.mp3");
const brickBreakSound = new Audio("./assets/sounds/brick_break.mp3");
const gameOverSound = new Audio("./assets/sounds/game_over.mp3");
const paddleHitSound = new Audio("./assets/sounds/paddle_hit.mp3");
const wallHitSound = new Audio("./assets/sounds/wall_hit.mp3");
const youWonSound = new Audio("./assets/sounds/you_won.mp3");

let x,
  y,
  dy,
  dx,
  interval,
  radius,
  paddleW,
  paddleX,
  paddleY,
  brickH,
  brickW,
  brickOffset,
  score;

setVariables();
drawPaddle();
createBrickArray();
drawBricks();
drawScore();
drawBall();
paddleNavigation();
// startGame();
