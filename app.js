// basic calculations
function add(a, b) {
    const result = +a + +b;
    if(Number.isInteger(result)) {
        return result.toPrecision();
    }
    return Number(result.toFixed(2));
}

function subtract(a, b) {
    const result = +a - +b;
    if(Number.isInteger(result)) {
        return result.toPrecision();
    }
    return Number(result.toFixed(2));
}

function multiply(a, b) {
    const result = +a * +b;
    if(Number.isInteger(result)) {
        return result.toPrecision();
    }
    return Number(result.toFixed(2));
}

function divide(a, b) {
    if (b == 0) return "NaN";
    const result = +a / +b;
    if(Number.isInteger(result)) {
        return result.toPrecision();
    }
    return Number(result.toFixed(2));
}

function operate(operator, a, b) {
    if (a == null) return b;
    if (operator == '+') return add(a, b);
    if (operator == '-') return subtract(a,b);
    if (operator == '*') return multiply(a,b);
    if (operator == '/') return divide(a,b);
    return;
}

// collect all the number, op, and eq buttons
const numberBtns = Array.from(document.querySelectorAll("button.number"));
const opBtns = Array.from(document.querySelectorAll("button.op"))
const eqBtn = document.querySelector("button.eq");
const btns = numberBtns.concat(opBtns);
btns.push(eqBtn);

const displayResult = document.querySelector("#display_result");
// declare variables to store/track computing values
let solution = null;
const object = {number: null, operator: null }

// indicate if time to input a new number
let newNumber = true;

// do action based on type of button
btns.forEach(btn => btn.addEventListener("click", function(e) {
    if(btn.classList.contains("number")) {
        if(newNumber) {
            displayResult.textContent = 0;
            newNumber = false;
        }
        displayNumbers(btn, displayResult)
    } else if(btn.className == "op") {
        // save the last operand, do an operation with previous solution 
        // and previous operator.
        // (when solution and operator are nulls, just return the number - first number)
        object.number = displayResult.textContent;  
        solution = operate(object.operator, solution, object.number);
        // save the new operator
        object.operator = btn.textContent; 
        displayResult.textContent = roundLongDecimal(solution);
        newNumber = true
    } else if(btn.className == "eq") {
        object.number = displayResult.textContent;  
        solution = operate(object.operator, solution, object.number);
        displayResult.textContent = roundLongDecimal(solution);
        // reset solution, because we will get it again 
        // as an operand next time.(like the very first calculation)
        solution = null;
        newNumber = true
    }
}));

document.addEventListener("keydown", function(e) {
    btns.forEach(btn => {
        if(btn.textContent == e.key) {
            btn.click();
        }
    })
})

function displayNumbers(btn, displayResult) {
    if(btn.classList.contains("dot") && displayResult.textContent.includes(".")) {
        return;
    }
    if(displayResult.textContent === "0") {
        // used dot, so it could still be the same number
        if(btn.classList.contains("dot")) {
            displayResult.textContent += btn.textContent;
        } else {
            displayResult.textContent = btn.textContent;
        }
    } else {
        displayResult.textContent = roundLongDecimal(displayResult.textContent + btn.textContent);
    }
}

function roundLongDecimal(number) {
    if(typeof(number) == "number") {
        number = number.toString();
    }
    const capacity = 9;
    if (number.length > capacity) {
        return number.slice(0, capacity)
    }
    return number;
}

// functional buttons events

const clearBtn = document.querySelector("button.clear");
clearBtn.addEventListener("click", function(e) {
    solution = null;
    newNumber = true;
    object.number = null;
    object.operator = null;
    displayResult.textContent = 0;
})

const backspaceBtn = document.querySelector("button.backspace");
backspaceBtn.addEventListener("click", function(e) {
    if(!newNumber) {
        displayResult.textContent = displayResult.textContent.slice(0, -1);
        if (displayResult.textContent === "") {
            displayResult.textContent = 0;
        }
    }
})

document.addEventListener("keydown", function(e) {
    if(e.code == "Backspace") {
        backspaceBtn.click();
    }
})

const percentageBtn = document.querySelector("button.percentage");
percentageBtn.addEventListener("click", function(e) {
    displayResult.textContent = roundLongDecimal(Number(displayResult.textContent) / 100);
    newNumber = true;
})

const signBtn = document.querySelector("button.sign");
signBtn.addEventListener("click", function(e) {
    if(displayResult.textContent.substr(0, 1) === "-") {
        displayResult.textContent = displayResult.textContent.slice(1);
    } else {
        displayResult.textContent = Number("-" + displayResult.textContent);
    }
    newNumber = true;
})

