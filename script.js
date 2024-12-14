const displayBox = document.querySelector(".display"),
    displayInput = document.querySelector(".display-input"),
    displayResult = document.querySelector(".display-result"),
    buttons = document.querySelectorAll("button"),
    operators = ["%", "+", "×", "-", "/"];
let input = "",
    result = "",
    lastCalculation = false;

// main function to handle calculator logic
const calculate = btnValue => {
    const lastChar = input.slice(-1),
        secondToLastChar = input.slice(-2, -1),
        withoutLastChar = input.slice(0, -1),
        isLastCharOperator = operators.includes(lastChar),
        isInvalidResult = ["Error", "infinity"].includes(result);
    
    //handle equals
    if (btnValue === "=") {
        if (
            input === "" ||
            lastChar === "." ||
            lastChar === "(" ||
            (isLastCharOperator && lastChar !== "%") ||
            lastCalculation
        ) return;

        const formattedInput = replaceOperators(input);
        try {
            const calculatedValue = eval(formattedInput);
            result = parseFloat(calculatedValue.toFixed(10)).toString();
        } 
        catch {
            result = "Error";
        }

        input += btnValue;
        lastCalculation = true;
        displayBox.classList.add("active");
    } 
    //handle AC (All Clear)
    else if (btnValue === "AC") {
        resetCalculator("");
    } 
    //handle backspace
    else if (btnValue === "") {
        if (lastCalculation) {
            if (isInvalidResult) resetCalculator("");
            resetCalculator(result.slice(0, -1));
        }
        else input = withoutLastChar;
    }
    //handle operators
    else if (operators.includes(btnValue)) {
        if (lastCalculation) {
            if (isInvalidResult) return;
            resetCalculator(result + btnValue);
        }
        else if (
            (input === "" || lastChar === "(") && btnValue !== "-" ||
            input === "-" ||
            lastChar === "." ||
            secondToLastChar === "(" && lastChar === "-" ||
            (secondToLastChar === "%" || lastChar === "%") && btnValue === "%"
        ) return;
        else if (lastChar === "%") input += btnValue;
        else if (isLastCharOperator) input = withoutLastChar + btnValue;
        else input += btnValue;
    }
    //handle decimal
    else if (btnValue === ".") {
        const decimalValue = "0.";
        if (lastCalculation) resetCalculator(decimalValue);
        else if (lastChar === ")" || lastChar === "%") input += "×" + decimalValue;
        else if (input === "" || isLastCharOperator || lastChar === "(") input += decimalValue;
        else {  
            let lastOperatorIndex = -1;
            for (const operator of operators) {
                const index = input.lastIndexOf(operator);
                if (index > lastOperatorIndex) lastOperatorIndex = index;
            }

            if (!input.slice(lastOperatorIndex + 1).includes(".")) input += btnValue;
        }
    }
    //handle brackets
    else if (btnValue === "( )") {
        const openBrackets = (input.match(/\(/g) || []).length;
        const closeBrackets = (input.match(/\)/g) || []).length;

        if (lastCalculation) {
            resetCalculator(result + "×(");
        } else if (openBrackets > closeBrackets && !operators.includes(lastChar) && lastChar !== "(") {
            input += ")";
        } else {
            if (input === "" || operators.includes(lastChar) || lastChar === "(") {
                input += "(";
            } else {
                input += "×(";
            }
        }
    }
    //handle numbers
    else {
        if (lastCalculation) resetCalculator(btnValue);
        else input += btnValue;
    }

    // update display
    displayInput.value = input;
    displayResult.value = result;
    displayInput.scrollLeft = displayInput.scrollWidth;
};

// function to replace division (÷) and multiplication (×) symbols with JavaScript-compatible operators ("/" and "*")
const replaceOperators = input => input.replaceAll("×", "*").replaceAll("÷", "/");

//function to reset calculator
const resetCalculator = newInput => {
    input = newInput;
    result = "";
    lastCalculation = false;
    displayBox.classList.remove("active");
}

// add click event listeners to all buttons
buttons.forEach(button =>
    button.addEventListener("click", e => calculate(e.target.textContent))
);
