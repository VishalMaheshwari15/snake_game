const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const startButton = document.getElementById('startButton');
const gameOverMessage = document.getElementById('gameOverMessage');

const boardSize = 20; // Board size (20x20)
const tileSize = 20; // Tile size in pixels
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameOver = false;

highScoreDisplay.textContent = highScore;

startButton.addEventListener('click', init);

function init() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    food = { x: 15, y: 15 };
    score = 0;
    scoreDisplay.textContent = score;
    gameOver = false;
    gameOverMessage.style.display = 'none';
    startButton.style.display = 'none';
    document.addEventListener('keydown', changeDirection);
    placeFood();
    gameLoop();
}

function gameLoop() {
    if (gameOver) {
        gameOverMessage.style.display = 'block';
        startButton.style.display = 'inline-block';
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreDisplay.textContent = highScore;
        }
        return;
    }

    setTimeout(() => {
        clearBoard();
        moveSnake();
        checkCollision();
        drawSnake();
        drawFood();
        gameLoop();
    }, 100);
}

function clearBoard() {
    gameBoard.innerHTML = '';
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        placeFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = segment.x * tileSize + 'px';
        snakeElement.style.top = segment.y * tileSize + 'px';
        snakeElement.classList.add('snake');
        gameBoard.appendChild(snakeElement);
    });
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize)
    };
}

function drawFood() {
    const foodElement = document.createElement('div');
    foodElement.style.left = food.x * tileSize + 'px';
    foodElement.style.top = food.y * tileSize + 'px';
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
        gameOver = true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver = true;
        }
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    switch (keyPressed) {
        case LEFT:
            if (direction.x !== 1) {
                direction = { x: -1, y: 0 };
            }
            break;
        case UP:
            if (direction.y !== 1) {
                direction = { x: 0, y: -1 };
            }
            break;
        case RIGHT:
            if (direction.x !== -1) {
                direction = { x: 1, y: 0 };
            }
            break;
        case DOWN:
            if (direction.y !== -1) {
                direction = { x: 0, y: 1 };
            }
            break;
    }
}
