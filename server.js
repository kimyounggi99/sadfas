const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set(); // 연결된 클라이언트 저장
let currentPlayer = 'black'; // 현재 플레이어 (black 또는 white)
let board = []; // 오목판 상태 저장
const boardSize = 15; // 오목판 크기

// 오목판 초기화
function initializeBoard() {
    board = [];
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = '';
        }
    }
}

// 클라이언트로부터 메시지 수신 시 실행되는 함수
function handleClientMessage(client, message) {
    const data = JSON.parse(message);

    if (data.type === 'placeStone') {
        const { row, col } = data.payload;
        if (board[row][col] === '') {
            board[row][col] = currentPlayer;
            currentPlayer = currentPlayer === 'black' ? 'white' : 'black';

            // 모든 클라이언트에게 돌을 놓은 위치 전달
            const response = {
                type: 'updateBoard',
                payload: {
                    row,
                    col,
                    player: board[row][col],
                },
            };
            broadcastMessage(JSON.stringify(response));
        }
    }
}

// 모든 클라이언트에게 메시지 전송
function broadcastMessage(message) {
    clients.forEach((client) => {
        client.send(message);
    });
}

// 클라이언트 연결 시 실행되는 함수
function handleClientConnection(client) {
    clients.add(client);

    // 클라이언트로부터 메시지 수신 시 이벤트 핸들러 등록
    client.on('message', (message) => {
        handleClientMessage(client, message);
    });

    // 클라이언트 연결 종료 시 실행되는 함수
    client.on('close', () => {
        clients.delete(client);
    });

    // 오목판 초기화 메시지 전송
    const response = {
        type: 'initializeBoard',
        payload: {
            board,
            currentPlayer,
        },
    };
    client.send(JSON.stringify(response));
}

// WebSocket 서버 설정
wss.on('connection', handleClientConnection);

// 정적 파일 서빙
app.use(express.static('public'));

// 서버 시작
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// 게임 초기화
initializeBoard();
