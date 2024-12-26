const gameBoard = document.getElementById('game-board');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameInfo = document.getElementById('game-info');
let level = 1;
let score = 0;
let timeLeft = 60;
let firstTile = null;
let secondTile = null;
let lockBoard = false;
let timerInterval;

const images = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥝'];

const modes = {
    heaven: { pairs: 2, time: 120 },
    easy: { pairs: 3, time: 90 },
    normal: { pairs: 4, time: 60 },
    hard: { pairs: 5, time: 45 },
    extreme: { pairs: 6, time: 30 },
    hell: { pairs: 8, time: 20 }
};

function setMode(mode) {
    const { pairs, time } = modes[mode];
    level = 1;
    score = 0;
    timeLeft = time;
    levelDisplay.textContent = level;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    gameInfo.style.display = 'block';
    createBoard(pairs);
    startTimer();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard(pairs) {
    const levelImages = images.slice(0, pairs).concat(images.slice(0, pairs));
    shuffle(levelImages);
    gameBoard.innerHTML = '';
    levelImages.forEach(image => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.image = image;
        tile.addEventListener('click', flipTile);
        gameBoard.appendChild(tile);
    });
}

function flipTile() {
    if (lockBoard) return;
    if (this === firstTile) return;

    this.classList.add('flipped');
    this.textContent = this.dataset.image;

    if (!firstTile) {
        firstTile = this;
        return;
    }

    secondTile = this;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstTile.dataset.image === secondTile.dataset.image;
    isMatch ? disableTiles() : unflipTiles();
}

function disableTiles() {
    firstTile.removeEventListener('click', flipTile);
    secondTile.removeEventListener('click', flipTile);
    score += 10;
    scoreDisplay.textContent = score;
    resetBoard();
    if (document.querySelectorAll('.tile:not(.flipped)').length === 0) {
        levelUp();
    }
}

function unflipTiles() {
    lockBoard = true;
    setTimeout(() => {
        firstTile.classList.remove('flipped');
        secondTile.classList.remove('flipped');
        firstTile.textContent = '';
        secondTile.textContent = '';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstTile, secondTile, lockBoard] = [null, null, false];
}

function levelUp() {
    level++;
    levelDisplay.textContent = level;
    createBoard(level + 2);
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('시간 초과! 게임 오버!');
            resetGame();
        }
    }, 1000);
}

function resetGame() {
    gameInfo.style.display = 'none';
    gameBoard.innerHTML = '';
}
