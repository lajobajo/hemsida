const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Bird image
const birdImg = new Image();
birdImg.src = "lajoserver.png"; // simple yellow bird sprite

let bird;
let pipes;
let frame;
let score;
let gameOver;

function resetGame() {
  bird = {
    x: 50,
    y: 50,
    width: 40,
    height: 30,
    gravity: 0.3,
    lift: -5,
    velocity: 0
  };

  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  gameLoop();
}

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function createPipes() {
  if (frame % 90 === 0) {
    let gap = 200;
    let topHeight = Math.random() * (canvas.height - gap - 100) + 20;
    pipes.push({
      x: canvas.width,
      top: topHeight,
      bottom: topHeight + gap,
      width: 50
    });
  }
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });
}

function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= 2;

    // Collision
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      triggerGameOver();
    }

    // Score increase
    if (pipe.x + pipe.width === bird.x) {
      score++;
    }
  });

  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    triggerGameOver();
  }
}

function triggerGameOver() {
  gameOver = true;
  ctx.font = "40px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Game Over", 110, 300);

  ctx.font = "24px Arial";
  ctx.fillText("Tap to Restart", 120, 340);

  canvas.addEventListener("click", restartHandler);
  document.getElementById("jumpButton").addEventListener("click", restartHandler);
}

function restartHandler() {
  canvas.removeEventListener("click", restartHandler);
  document.getElementById("jumpButton").removeEventListener("click", restartHandler);
  resetGame();
}

function drawScore() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 10, 30);
}

function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  createPipes();
  drawPipes();
  updatePipes();
  updateBird();
  drawScore();

  frame++;
  requestAnimationFrame(gameLoop);
}

// Button jump control
document.getElementById("jumpButton").addEventListener("click", () => {
  bird.velocity = bird.lift;
});

// Optional keyboard jump
document.addEventListener("keydown", () => {
  bird.velocity = bird.lift;
});

birdImg.onload = () => {
  resetGame();
};
