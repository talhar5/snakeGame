// set fps first
const SNAKE_SPEED = 10;
const GRID_SIZE = 25;


let turnSound = new Audio('../audios/move.mp3');
let gameOverSound = new Audio('../audios/gameover.mp3');
let backgroundSound = new Audio('../audios/music.mp3');
let foodEatenSound = new Audio('../audios/food.mp3');
let btnClickSound = new Audio('../audios/clicksound.wav');
// declaraing variables 
let moveDirection, food, snake, animationRequestId, gameOnHa;

initializeGame();
displaySnake();

let prevPaintTime = 0;
function main(currentTime) {

    animationRequestId = window.requestAnimationFrame(main);

    if ((currentTime - prevPaintTime) / 1000 < 1 / SNAKE_SPEED) return;
    prevPaintTime = currentTime;
    game();
}

playBtn.addEventListener('click', (e) => {
    btnClickSound.play();
    popupBox.style.opacity = '0';
    window.requestAnimationFrame(main);
})
pauseBtn.addEventListener('click', (e) => {
    btnClickSound.play();
    popupBox.style.opacity = '1';
})
resetBtn.addEventListener('click', (e) => {
    btnClickSound.play();
    popupBox.style.opacity = '0';
    initializeGame();
})


function game() {
    // checks whether the snake has collided or not.
    if (isGameOver(snake)) {
        gameOverSound.play();
        window.cancelAnimationFrame(animationRequestId);
        initializeGame();
    }
    // update funcitonality
    let snakeArr = [...snake];
    snake[0] = { x: snakeArr[0].x + moveDirection.x, y: snakeArr[0].y + moveDirection.y };
    for (let i = 1; i < snakeArr.length; i++) {
        snake[i] = { ...snakeArr[i - 1] };
    }

    // when the food is eaten, snake length gets increased.
    if (_.isEqual(food, snake[0])) {
        foodEatenSound.play();
        growSnake();
        foodGenerator();
    }



    // display functionality
    gameBoard.innerHTML = ''; //clearing previous grid
    displaySnake(); // display snake

    // display food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.x;
    foodElement.style.gridColumnStart = food.y;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

// direction change upon keypress
window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'Space':
            popupBox.style.opacity = '0';
            window.requestAnimationFrame(main);
            break;
        case 'Enter':
            popupBox.style.opacity = '0';
            initializeGame();
            window.requestAnimationFrame(main);
            break;
        case 'ArrowDown':
            if (moveDirection.x === -1) return;
            turnSound.play();
            moveDirection.x = 1;
            moveDirection.y = 0;
            break;
        case 'ArrowUp':
            if (moveDirection.x === 1) return;
            turnSound.play();
            moveDirection.x = -1;
            moveDirection.y = 0;
            break;
        case 'ArrowRight':
            if (moveDirection.y === -1) return;
            turnSound.play();
            moveDirection.x = 0;
            moveDirection.y = 1;
            break;
        case 'ArrowLeft':
            if (moveDirection.y === 1) return;
            turnSound.play();
            moveDirection.x = 0;
            moveDirection.y = -1;
            break;
    }
})

function foodGenerator() {
    let newFood = {
        x: Math.ceil(1+((GRID_SIZE-1) * Math.random())),
        y: Math.ceil(1+((GRID_SIZE-1) * Math.random()))
    }
    let isFoodOnSnake = snake.some(item => _.isEqual(item, newFood));
    if (!isFoodOnSnake) {
        food = { ...newFood };
    } else {
        foodGenerator();
    }
}

function isGameOver(snakeArr) {
    // biten itself 
    for (let i = 1; i < snake.length; i++) {
        if(_.isEqual(snakeArr[0], snakeArr[i])){
            return true;
        };
    }
    // touched the boundary
    if (snakeArr[0].x >= GRID_SIZE || snakeArr[0].y >= GRID_SIZE || snakeArr[0].x <= 1 || snakeArr[0].y <= 1) {
        return true;
    }
    return false;
}

// function to reset the game to intial position
function initializeGame() {
    moveDirection = { x: 0, y: 1 };
    food = { x: 8, y: 10 };
    snake = [
        { x: 6, y: 6 },
        { x: 7, y: 6 },
        { x: 8, y: 6 },
        { x: 9, y: 6 },
        { x: 10, y: 6 }
    ]
    animationRequestId = null;
    gameOnHa = false;

}

function displaySnake() {
    snake.forEach((item, index) => {
        let elem = document.createElement('div');
        elem.style.gridRowStart = item.x;
        elem.style.gridColumnStart = item.y;
        if (index === 0) {
            elem.classList.add('snakeHead');
        } else {
            elem.classList.add('snakeBody');
        }
        gameBoard.appendChild(elem);
    })
}
function growSnake() {
    snake.unshift({ x: snake[0].x + moveDirection.x, y: snake[0].y + moveDirection.y });
}




