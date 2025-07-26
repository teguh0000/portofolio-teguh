const display = document.getElementById('display');
let currentInput = '';
let operator = null;
let firstOperand = null;
let waitingForSecondOperand = false;

function appendToDisplay(value) {
    if (waitingForSecondOperand) {
        currentInput = value;
        waitingForSecondOperand = false;
    } else {
        currentInput += value;
    }
    display.value = currentInput;
}

function clearDisplay() {
    currentInput = '';
    operator = null;
    firstOperand = null;
    waitingForSecondOperand = false;
    display.value = '';
}

function calculateResult() {
    if (operator === null || waitingForSecondOperand) return;

    const secondOperand = parseFloat(currentInput);
    let result = 0;

    switch (operator) {
        case '+':
            result = firstOperand + secondOperand;
            break;
        case '-':
            result = firstOperand - secondOperand;
            break;
        case '*':
            result = firstOperand * secondOperand;
            break;
        case '/':
            if (secondOperand === 0) {
                alert("Tidak bisa dibagi nol!");
                clearDisplay();
                return;
            }
            result = firstOperand / secondOperand;
            break;
        default:
            return;
    }

    display.value = result;
    currentInput = result.toString();
    firstOperand = result;
    operator = null;
    waitingForSecondOperand = true; // Siap untuk operasi baru dengan hasil
}

// Menambahkan event listener untuk tombol operator (termasuk . saat diklik)
// Ini adalah bagian dari logika JavaScript, tetapi di sini kita akan sedikit mengubahnya
// untuk menyelaraskan dengan HTML yang sudah ada
const buttons = document.querySelectorAll('.button');
buttons.forEach(button => {
    if (button.classList.contains('operator') && button.textContent !== '=' && button.textContent !== 'C') {
        button.addEventListener('click', () => {
            if (firstOperand === null) {
                firstOperand = parseFloat(currentInput);
            } else if (!waitingForSecondOperand) {
                calculateResult(); // Hitung hasil operasi sebelumnya jika ada
                firstOperand = parseFloat(currentInput); // Update firstOperand dengan hasil
            }
            operator = button.textContent;
            waitingForSecondOperand = true;
        });
    }
});