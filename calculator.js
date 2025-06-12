document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const calculatorElement = document.querySelector('.calculator');
    const prevOperandElement = document.getElementById('prev-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const numberButtons = document.querySelectorAll('[data-number]');
    const operatorButtons = document.querySelectorAll('[data-operator]');
    const scientificFunctionButtons = document.querySelectorAll('[data-function]');
    const clearButton = document.getElementById('clear');
    const deleteButton = document.getElementById('delete');
    const equalsButton = document.getElementById('equals');
    const standardToggleBtn = document.getElementById('standard-toggle');
    const scientificToggleBtn = document.getElementById('scientific-toggle');

    // Calculator state
    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let shouldResetDisplay = false;

    // Functions
    function updateDisplay() {
        currentOperandElement.textContent = currentOperand;
        
        if (operation != null) {
            prevOperandElement.textContent = `${previousOperand} ${operation}`;
        } else {
            prevOperandElement.textContent = '';
        }
    }

    function appendNumber(number) {
        if (shouldResetDisplay) {
            currentOperand = '';
            shouldResetDisplay = false;
        }
        
        // Prevent multiple decimal points
        if (number === '.' && currentOperand.includes('.')) return;
        
        // Replace 0 with number unless it's a decimal point
        if (currentOperand === '0' && number !== '.') {
            currentOperand = number;
        } else {
            currentOperand += number;
        }
    }

    function chooseOperation(op) {
        if (currentOperand === '') return;
        
        if (previousOperand !== '') {
            compute();
        }
        
        operation = op;
        previousOperand = currentOperand;
        currentOperand = '';
    }    function compute() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        
        if (operation === undefined) return;
        
        // Handle special operations that don't require both operands
        if (operation === '(' || operation === ')') {
            return;
        }
        
        if (isNaN(prev) && operation !== '(' && operation !== ')') return;
        if (isNaN(current) && operation !== '(' && operation !== ')') return;
        
        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    clear();
                    currentOperand = 'Error';
                    shouldResetDisplay = true;
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Format the result
        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
        shouldResetDisplay = true;
    }
    
    function executeScientificFunction(func) {
        const current = parseFloat(currentOperand);
        
        if (isNaN(current) && func !== 'pi' && func !== 'e') {
            return;
        }
        
        let result;
        switch (func) {
            case 'sin':
                result = Math.sin(current);
                break;
            case 'cos':
                result = Math.cos(current);
                break;
            case 'tan':
                result = Math.tan(current);
                break;
            case 'log':
                if (current <= 0) {
                    currentOperand = 'Error';
                    shouldResetDisplay = true;
                    return;
                }
                result = Math.log10(current);
                break;
            case 'sqrt':
                if (current < 0) {
                    currentOperand = 'Error';
                    shouldResetDisplay = true;
                    return;
                }
                result = Math.sqrt(current);
                break;
            case 'pow':
                previousOperand = current;
                operation = 'pow';
                currentOperand = '';
                updateDisplay();
                return;
            case 'pi':
                result = Math.PI;
                break;
            case 'e':
                result = Math.E;
                break;
            case 'factorial':
                if (current < 0 || !Number.isInteger(current)) {
                    currentOperand = 'Error';
                    shouldResetDisplay = true;
                    return;
                }
                result = factorial(current);
                break;
            case 'exp':
                previousOperand = current;
                operation = 'exp';
                currentOperand = '';
                updateDisplay();
                return;
            default:
                return;
        }
        
        currentOperand = result.toString();
        shouldResetDisplay = true;
    }
    
    function factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
    }

    function deleteNumber() {
        if (currentOperand === '0' || shouldResetDisplay) return;
        if (currentOperand.length === 1) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
    }

    // Event listeners for buttons
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.getAttribute('data-number'));
            updateDisplay();
        });
    });

    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            chooseOperation(button.getAttribute('data-operator'));
            updateDisplay();
        });
    });

    equalsButton.addEventListener('click', () => {
        compute();
        updateDisplay();
    });

    clearButton.addEventListener('click', () => {
        clear();
        updateDisplay();
    });

    deleteButton.addEventListener('click', () => {
        deleteNumber();
        updateDisplay();
    });    // Event listeners for scientific functions
    scientificFunctionButtons.forEach(button => {
        button.addEventListener('click', () => {
            executeScientificFunction(button.getAttribute('data-function'));
            updateDisplay();
        });
    });
    
    // Toggle between standard and scientific calculator
    standardToggleBtn.addEventListener('click', () => {
        calculatorElement.classList.remove('scientific-mode');
        standardToggleBtn.classList.add('active');
        scientificToggleBtn.classList.remove('active');
    });
    
    scientificToggleBtn.addEventListener('click', () => {
        calculatorElement.classList.add('scientific-mode');
        scientificToggleBtn.classList.add('active');
        standardToggleBtn.classList.remove('active');
    });
    
    // Keyboard support
    document.addEventListener('keydown', event => {
        if (/^\d$/.test(event.key)) {
            appendNumber(event.key);
            updateDisplay();
        } else if (event.key === '.') {
            appendNumber('.');
            updateDisplay();
        } else if (event.key === '+' || event.key === '-') {
            chooseOperation(event.key);
            updateDisplay();
        } else if (event.key === '*') {
            chooseOperation('×');
            updateDisplay();
        } else if (event.key === '/') {
            event.preventDefault(); // Prevent browser search
            chooseOperation('÷');
            updateDisplay();
        } else if (event.key === 'Enter' || event.key === '=') {
            event.preventDefault();
            compute();
            updateDisplay();
        } else if (event.key === 'Backspace') {
            deleteNumber();
            updateDisplay();
        } else if (event.key === 'Escape') {
            clear();
            updateDisplay();
        } else if (event.key === '(' || event.key === ')') {
            if (calculatorElement.classList.contains('scientific-mode')) {
                chooseOperation(event.key);
                updateDisplay();
            }
        }
    });

    // Initialize display
    updateDisplay();
});
