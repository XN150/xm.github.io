const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 7;
const AI_SPEED = 5;

// Initial positions and velocities
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballDX = Math.random() > 0.5 ? 5 : -5;
let ballDY = (Math.random() - 0.5) * 7;

// Draw paddle
function drawPaddle(x, y) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
}

// Draw ball
function drawBall(x, y) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, BALL_SIZE, BALL_SIZE);
}

// Draw net
function drawNet() {
    ctx.fillStyle = '#777';
    for (let i = 0; i < canvas.height; i += 30) {
        ctx.fillRect(canvas.width / 2 - 1, i, 2, 20);
    }
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    drawNet();
    drawPaddle(PLAYER_X, playerY);
    drawPaddle(AI_X, aiY);
    drawBall(ballX, ballY);

    // Move ball
    ballX += ballDX;
    ballY += ballDY;

    // Ball collision with top/bottom walls
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballDY = -ballDY;
        ballY = ballY <= 0 ? 0 : canvas.height - BALL_SIZE;
    }

    // Ball collision with player paddle
    if (
        ballX <= PLAYER_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
    ) {
        ballDX = -ballDX;
        // Add some "english" depending on where the ball hit the paddle
        let hitPos = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ballDY = hitPos * 0.25;
        ballX = PLAYER_X + PADDLE_WIDTH; // Prevent sticking
    }

    // Ball collision with AI paddle
    if (
        ballX + BALL_SIZE >= AI_X &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
    ) {
        ballDX = -ballDX;
        let hitPos = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ballDY = hitPos * 0.25;
        ballX = AI_X - BALL_SIZE; // Prevent sticking
    }

    // Score / Reset if ball goes out of bounds
    if (ballX < 0 || ballX > canvas.width) {
        resetBall();
    }

    // Move AI paddle (simple AI: follows ball Y with some inertia)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY + BALL_SIZE / 2 - 10) {
        aiY += AI_SPEED;
    } else if (aiCenter > ballY + BALL_SIZE / 2 + 10) {
        aiY -= AI_SPEED;
    }
    // Clamp AI paddle
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));

    requestAnimationFrame(gameLoop);
}

function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballDX = Math.random() > 0.5 ? 5 : -5;
    ballDY = (Math.random() - 0.5) * 7;
}

// Mouse control for player paddle
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp within canvas
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Start the game
gameLoop();