const canvas = document.getElementById('tetrisCanvas');
const context = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// Ukuran grid game
const GRID_COLS = 10;
const GRID_ROWS = 20;
const BLOCK_SIZE = canvas.width / GRID_COLS; // Lebar canvas / jumlah kolom

// Inisialisasi grid game dengan nilai 0 (kosong)
let grid = Array(GRID_ROWS).fill(0).map(() => Array(GRID_COLS).fill(0));

// Definisi bentuk Tetromino (balok Tetris)
// Setiap angka mewakili warna atau tipe blok
const TETROMINOS = [
    // I
    [[0, 0, 0, 0],
     [1, 1, 1, 1],
     [0, 0, 0, 0],
     [0, 0, 0, 0]],

    // J
    [[2, 0, 0],
     [2, 2, 2],
     [0, 0, 0]],

    // L
    [[0, 0, 3],
     [3, 3, 3],
     [0, 0, 0]],

    // O
    [[4, 4],
     [4, 4]],

    // S
    [[0, 5, 5],
     [5, 5, 0],
     [0, 0, 0]],

    // T
    [[0, 6, 0],
     [6, 6, 6],
     [0, 0, 0]],

    // Z
    [[7, 7, 0],
     [0, 7, 7],
     [0, 0, 0]]
];

// Warna untuk setiap tipe blok
const COLORS = [
    'transparent', // 0: kosong
    'cyan',        // 1: I
    'blue',        // 2: J
    'orange',      // 3: L
    'yellow',      // 4: O
    'lime',        // 5: S
    'purple',      // 6: T
    'red'          // 7: Z
];

let currentTetromino;
let currentPosition = { x: 0, y: 0 };
let score = 0;
let gameOver = false;
let dropInterval;

// --- Fungsi-fungsi Game ---

// Fungsi untuk mendapatkan Tetromino acak
function getRandomTetromino() {
    const randIndex = Math.floor(Math.random() * TETROMINOS.length);
    return TETROMINOS[randIndex];
}

// Fungsi untuk menggambar blok pada kanvas
function drawBlock(x, y, colorIndex) {
    context.fillStyle = COLORS[colorIndex];
    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    context.strokeStyle = '#333'; // Border untuk blok
    context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Fungsi untuk menggambar seluruh grid game
function drawGrid() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan kanvas
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            if (grid[row][col] !== 0) {
                drawBlock(col, row, grid[row][col]);
            }
        }
    }
}

// Fungsi untuk menggambar Tetromino yang sedang jatuh
function drawTetromino() {
    if (!currentTetromino) return;
    for (let row = 0; row < currentTetromino.length; row++) {
        for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col] !== 0) {
                drawBlock(currentPosition.x + col, currentPosition.y + row, currentTetromino[row][col]);
            }
        }
    }
}

// Fungsi untuk mengecek tabrakan (collision)
function checkCollision(offsetX, offsetY, tetromino) {
    for (let row = 0; row < tetromino.length; row++) {
        for (let col = 0; col < tetromino[row].length; col++) {
            if (tetromino[row][col] !== 0) {
                const newX = currentPosition.x + col + offsetX;
                const newY = currentPosition.y + row + offsetY;

                // Cek batas kanvas
                if (newX < 0 || newX >= GRID_COLS || newY >= GRID_ROWS) {
                    return true;
                }
                // Cek tabrakan dengan blok yang sudah ada di grid
                if (newY >= 0 && grid[newY][newX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Fungsi untuk menyatukan Tetromino ke dalam grid
function mergeTetromino() {
    for (let row = 0; row < currentTetromino.length; row++) {
        for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col] !== 0) {
                grid[currentPosition.y + row][currentPosition.x + col] = currentTetromino[row][col];
            }
        }
    }
}

// Fungsi untuk menghapus baris yang penuh
function clearLines() {
    let linesCleared = 0;
    for (let row = GRID_ROWS - 1; row >= 0; row--) {
        if (grid[row].every(cell => cell !== 0)) { // Jika baris penuh
            grid.splice(row, 1); // Hapus baris
            grid.unshift(Array(GRID_COLS).fill(0)); // Tambahkan baris kosong di atas
            linesCleared++;
            row++; // Cek baris yang sama lagi karena baris di atasnya sudah turun
        }
    }
    if (linesCleared > 0) {
        score += linesCleared * 100; // Tambahkan skor
        scoreDisplay.textContent = score;
    }
}

// Fungsi untuk merotasi Tetromino
function rotateTetromino() {
    const originalTetromino = currentTetromino;
    // Rotasi 90 derajat searah jarum jam
    const rotated = originalTetromino[0].map((_, index) =>
        originalTetromino.map(row => row[index]).reverse()
    );

    // Cek tabrakan setelah rotasi
    if (!checkCollision(0, 0, rotated)) {
        currentTetromino = rotated;
    } else {
        // Coba "kick" (geser) jika menabrak dinding/blok
        // Ini adalah implementasi sederhana, Tetris asli punya aturan kick yang lebih kompleks
        const kicks = [
            [0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]
        ];
        for (const [kx, ky] of kicks) {
            if (!checkCollision(kx, ky, rotated)) {
                currentPosition.x += kx;
                currentPosition.y += ky;
                currentTetromino = rotated;
                break;
            }
        }
    }
}

// Fungsi untuk memulai Tetromino baru
function newTetromino() {
    currentTetromino = getRandomTetromino();
    currentPosition = { x: Math.floor(GRID_COLS / 2) - Math.floor(currentTetromino[0].length / 2), y: 0 };

    // Cek game over
    if (checkCollision(0, 0, currentTetromino)) {
        gameOver = true;
        clearInterval(dropInterval);
        alert('Game Over! Skor Anda: ' + score);
    }
}

// Fungsi game loop (menggambar dan memperbarui status game)
function updateGame() {
    if (gameOver) return;

    // Coba gerakkan ke bawah
    if (!checkCollision(0, 1, currentTetromino)) {
        currentPosition.y++;
    } else {
        mergeTetromino(); // Jika tidak bisa bergerak, satukan
        clearLines();     // Cek baris penuh
        newTetromino();   // Buat Tetromino baru
    }

    drawGrid();
    drawTetromino();
}

// Kontrol keyboard
document.addEventListener('keydown', e => {
    if (gameOver) return;

    switch (e.key) {
        case 'ArrowLeft':
            if (!checkCollision(-1, 0, currentTetromino)) {
                currentPosition.x--;
            }
            break;
        case 'ArrowRight':
            if (!checkCollision(1, 0, currentTetromino)) {
                currentPosition.x++;
            }
            break;
        case 'ArrowDown':
            if (!checkCollision(0, 1, currentTetromino)) {
                currentPosition.y++;
            } else {
                mergeTetromino();
                clearLines();
                newTetromino();
            }
            break;
        case 'ArrowUp': // Rotasi
        case ' ': // Spasi juga bisa untuk rotasi
            rotateTetromino();
            break;
    }
    drawGrid();
    drawTetromino();
});

// Inisialisasi game
function initGame() {
    newTetromino();
    // Otomatis jatuh setiap 500ms
    dropInterval = setInterval(updateGame, 500);
}

initGame();