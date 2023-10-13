// State variables
let firstOperand = '';
let secondOperand = '';
let currentOperation = null;
let shouldResetScreen = false;

// DOM elements 
const currentOperationScreen = document.getElementById('currentOperationScreen');
const lastOperationScreen = document.getElementById('lastOperationScreen');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.getElementById('equalsBtn');
const clearButton = document.getElementById('clearBtn');
const deleteButton = document.getElementById('deleteBtn');
const pointButton = document.getElementById('pointBtn');
const percentageButton = document.getElementById('percentageBtn');

// Event listeners
window.addEventListener('keydown', handleKeyboardInput);
equalsButton.addEventListener('click', evaluate);
clearButton.addEventListener('click', clear);
deleteButton.addEventListener('click', deleteNumber);
pointButton.addEventListener('click', appendPoint);
percentageButton.addEventListener('click', percentage);

numberButtons.forEach(button => button.addEventListener('click', handleButtonPress));
operatorButtons.forEach(button => button.addEventListener('click', handleButtonPress));

// Button press handling function
function handleButtonPress(e) {
    const buttonText = e.target.textContent;
    if (e.target.hasAttribute('data-number')) appendNumber(buttonText);
    if (e.target.hasAttribute('data-operator')) setOperation(buttonText);
}

// Input manipulation functions
function appendNumber(number) {
    if (currentOperationScreen.textContent === '0' || shouldResetScreen)
        resetScreen();
    currentOperationScreen.textContent += number;
}

function resetScreen() {
    currentOperationScreen.textContent = '';
    shouldResetScreen = false;
}

function appendPoint() {
    if (shouldResetScreen) resetScreen();
    if (currentOperationScreen.textContent === '')
        currentOperationScreen.textContent = '0';
    if (currentOperationScreen.textContent.includes('.')) return;
    currentOperationScreen.textContent += '.';
}

function deleteNumber() {
    currentOperationScreen.textContent = currentOperationScreen.textContent
        .toString()
        .slice(0, -1);
}

// Operation functions
function setOperation(operator) {
    if (currentOperation !== null) evaluate();
    firstOperand = currentOperationScreen.textContent;
    currentOperation = operator;
    lastOperationScreen.textContent = `${firstOperand} ${currentOperation}`;
    shouldResetScreen = true;
}

function evaluate() {
    if (currentOperation === null || shouldResetScreen) return;

    if (currentOperation === '÷' && currentOperationScreen.textContent === '0') {
        currentOperationScreen.textContent = 'Error';
        return;
    }

    secondOperand = currentOperationScreen.textContent;
    currentOperationScreen.textContent = roundResult(
        operate(currentOperation, parseFloat(firstOperand), parseFloat(secondOperand))
    );
    lastOperationScreen.textContent = `${firstOperand} ${currentOperation} ${secondOperand} =`;
    currentOperation = null;
}

function percentage() {
    if (currentOperationScreen.textContent === '0') return;

    const currentValue = parseFloat(currentOperationScreen.textContent);
    const percentageValue = currentValue / 100;

    currentOperationScreen.textContent = percentageValue.toString();
}

// UI functions
function clear() {
    currentOperationScreen.textContent = '0';
    lastOperationScreen.textContent = '';
    firstOperand = '';
    secondOperand = '';
    currentOperation = null;
}

function roundResult(number) {
    return Math.round(number * 1000) / 1000;
}

// Keyboard input handling
function handleKeyboardInput(e) {
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
    if (e.key === '.') appendPoint();
    if (e.key === '=' || e.key === 'Enter') evaluate();
    if (e.key === 'Backspace') deleteNumber();
    if (e.key === 'Escape') clear();
    if (e.key === '%') percentage();
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/')
        setOperation(convertOperator(e.key));
}

// Utility functions
function convertOperator(keyboardOperator) {
    if (keyboardOperator === '/') return '÷';
    if (keyboardOperator === '*') return '×';
    if (keyboardOperator === '-') return '-';
    if (keyboardOperator === '+') return '+';
}

// Mathematical operations functions
function add(a, b) {
    return a + b
}

function subtract(a, b) {
    return a - b
}

function multiply(a, b) {
    return a * b
}

function divide(a, b) {
    return a / b
}

function operate(operator, a, b) {
    a = Number(a)
    b = Number(b)
    switch (operator) {
        case '+':
            return add(a, b)
        case '-':
            return subtract(a, b)
        case '×':
            return multiply(a, b)
        case '÷':
            if (b === 0) return null
            else return divide(a, b)
        default:
            return null
    }
}

