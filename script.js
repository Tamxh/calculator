function add(x, y) {
    return x + y;
}

function subtract(x, y) {
    return x - y;
}

function multiply(x, y) {
    return x * y;
}

function divide(x, y) {
    if (y === 0) {
        throw new Error("Dead💀 lol");
    }
    return x / y;
}

function operate(operator, x, y) {
    try {
        switch (operator) {
            case '+': return add(x, y);
            case '-': return subtract(x, y);
            case '*': return multiply(x, y);
            case '/': return divide(x, y);
        }
    } catch (e) {
        return e.message;
    }
}

let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecond = false;

const currentDisplay    = document.getElementById('current');
const expressionDisplay = document.getElementById('expression');

document.getElementById('buttons').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    handleInput(btn.dataset.value);
});

function handleInput(value) {
    if (value === 'clear')     
        { handleClear();         
            return; }
    if (value === 'backspace') 
        { handleBackspace();     
            return; }
    if (value === '=')         
        { handleEquals();       
             return; }
    if (value === 'negate')    
        { handleNegate();        
            return; }
    if (value === 'percent')   
        { handlePercent();       
            return; }
    if ('+-*/'.includes(value))
        { handleOperator(value); 
            return; }
    handleDigit(value);
}

function updateDisplay() {
    currentDisplay.textContent = displayValue;
}

function handleDigit(digit) {
    if (digit === '.' && displayValue.includes('.')) return;

    if (waitingForSecond) {
        displayValue = digit === '.' ? '0.' : digit;
        waitingForSecond = false;
    } else {
        displayValue = displayValue === '0' && digit !== '.'
            ? digit
            : displayValue + digit;
    }

    updateDisplay();
}

function handleOperator(op) {
    const current = parseFloat(displayValue);

    if (firstOperand !== null && !waitingForSecond) {
        const result = operate(operator, firstOperand, current);
        if (typeof result === 'string') {
            displayValue = result;
            updateDisplay();
            expressionDisplay.textContent = '';
            firstOperand = null;
            operator = null;
            return;
        }
        displayValue = roundResult(result);
        updateDisplay();
        firstOperand = parseFloat(displayValue);
    } else {
        firstOperand = current;
    }

    operator = op;
    waitingForSecond = true;
    expressionDisplay.textContent = `${firstOperand} ${op}`;
}

function handleEquals() {
    if (firstOperand === null || operator === null || waitingForSecond) return;

    const second = parseFloat(displayValue);
    const result = operate(operator, firstOperand, second);

    expressionDisplay.textContent = `${firstOperand} ${operator} ${second} =`;

    displayValue = typeof result === 'string' ? result : roundResult(result);
    updateDisplay();

    firstOperand = null;
    operator = null;
    waitingForSecond = false;
}

function handleClear() {
    displayValue     = '0';
    firstOperand     = null;
    operator         = null;
    waitingForSecond = false;
    expressionDisplay.textContent = '';
    updateDisplay();
}

function handleBackspace() {
    if (waitingForSecond) return;
    displayValue = displayValue.length > 1
        ? displayValue.slice(0, -1)
        : '0';
    updateDisplay();
}

function handleNegate() {
    if (displayValue === '0') return;
    displayValue = displayValue.startsWith('-')
        ? displayValue.slice(1)
        : '-' + displayValue;
    updateDisplay();
}

function handlePercent() {
    displayValue = roundResult(parseFloat(displayValue) / 100);
    updateDisplay();
}

function roundResult(n) {
    return parseFloat(n.toPrecision(10)).toString();
}