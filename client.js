const boardSize = 15; // 오목판 크기

const board = []; // 오목판 상태 저장
let currentPlayer = 'black'; // 현재 플레이어 (black 또는 white)

const omokBoard = document.getElementById('omok-board');

// 오목판 초기화
function initializeBoard() {
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = '';
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.row = i;
            square.dataset.col = j;
            square.addEventListener('click', handleSquareClick);
            omokBoard.appendChild(square);
        }
    }
}

// 돌 삽입
function placeStone(row, col) {
    if (board[row][col] === '') {
        board[row][col] = currentPlayer;
        const stone = document.createElement('div');
        stone.classList.add(currentPlayer === 'black' ? 'black-stone' : 'white-stone');
        document.querySelector(`[data-row="${row}"][data-col="${col}"]`).appendChild(stone);
        checkWin(row, col);
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    }
}

// 승리 체크
function checkWin(row, col) {
    const directions = [
        [0, 1], [1, 0], [1, 1], [-1, 1] // 가로, 세로, 대각선 방향
    ];

    for (const direction of directions) {
        const [dx, dy] = direction;
        let count = 1;

        // 오목 체크
        for (let i = 1; i <= 4; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;

            if (
                newRow >= 0 &&
                newRow < boardSize &&
                newCol >= 0 &&
                newCol < boardSize &&
                board[newRow][newCol] === currentPlayer
            ) {
                count++;
            } else {
                break;
            }
        }

        if (count >= 5) {
            alert(`${currentPlayer === 'black' ? 'Black' : 'White'} player wins!`);
            initializeBoard();
            return;
        }
    }
}

// 클릭 이벤트 핸들러
function handleSquareClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    placeStone(row, col);
}

// 게임 초기화
function initializeGame() {
    initializeBoard();
}

// 게임 시작
initializeGame();
