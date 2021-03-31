let expressions = [];

const validKeys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "+",
    "-",
    "*",
    "/",
    "(",
    ")",
    "^",
    "Backspace",
    "ArrowRight",
    "ArrowLeft"
];

let numbers = ("1234567890.")

// also, c, inv, deg/rad, Enter

const specialKeysCheck = event => {
    if (event.key === "s") {
        event.preventDefault();
        document.getElementById("exp-input").value += "sin(";  
    } else if (event.key === "c") {
        event.preventDefault();
        document.getElementById("exp-input").value += "cos(";  
    } else if (event.key === "t") {
        event.preventDefault();
        document.getElementById("exp-input").value += "tan(";
    } else if (event.key === "p") {
        event.preventDefault();
        document.getElementById("exp-input").value += "pi";       
    } else if (event.key === "e") {
        event.preventDefault();
        document.getElementById("exp-input").value += "e";    
    } else if (event.key === "l") {
        event.preventDefault();
        document.getElementById("exp-input").value += "log(";   
    } else if (event.key === "n") {
        event.preventDefault();
        document.getElementById("exp-input").value += "ln(";
    } else if (event.key === "Enter") {
        let newExpression = document.getElementById("exp-input").value
        newExpression = newExpression.replace("sin", "s");
        newExpression = newExpression.replace("cos", "c");
        newExpression = newExpression.replace("tan", "t");
        newExpression = newExpression.replace("pi", "p");
        newExpression = newExpression.replace("log", "l");
        newExpression = newExpression.replace("ln", "n");
        newExpression = newExpression.match(/[sctpeln()\+\-*\/^]|[0-9]+/g);
        // for (let i = 0; i < newExpression.length; i++) {

        // }
        // newExpression = newExpression.split("");
        
        console.log(newExpression);
        
    }
}

document.addEventListener("keydown", event => {
    if (event.target.id !== "exp-input") {
        specialKeysCheck(event);
        if (validKeys.includes(event.key)) {
            document.getElementById("exp-input").value += event.key;
        }
    }
});

document.getElementById("exp-input").addEventListener("keydown", event => {
    specialKeysCheck(event);
    if (!validKeys.includes(event.key)) {
        event.preventDefault();
    }
});

const calculate = expression => {
    let exp = expression.slice();
    while (exp.length > 1) {
        
        while (exp.includes("(")) {
            let parenNum = 1;
            let innerExp = [];
            for (let i = exp.indexOf("(") + 1; i < exp.length - 1; i++) {
                if (exp[i] === "(") { parenNum++; }
                else if (exp[i] === ")") { parenNum--; }
                if (parenNum === 0) { break; }
                innerExp.push(exp[i]);
            }
            exp.splice(exp.indexOf("("), innerExp.length + 2, calculate(innerExp));
        }

        while (exp.includes("^")) {
            let index = exp.indexOf("^");
            let add = exp[index - 1]**exp[index + 1];
            exp.splice(index-1, 3, add);
        }

        while (exp.includes("*") || exp.includes("/")) {
            let index = 0;
            if (exp.includes("*") && exp.includes("/")) { index = Math.min(exp.indexOf("*"), exp.indexOf("/")); }
            else if (exp.includes("*")) { index = exp.indexOf("*"); }
            else { index = exp.indexOf("/"); }

            let add = 0;
            if (exp[index] === "*") { add = exp[index - 1] * exp[index + 1] }
            else { add = exp[index - 1] / exp[index + 1]; }

            exp.splice(index-1, 3, add);
        }

        while (exp.includes("+") || exp.includes("-")) {
            let index = 0;
            if (exp.includes("+") && exp.includes("-")) { index = Math.min(exp.indexOf("+"), exp.indexOf("-")); }
            else if (exp.includes("+")) { index = exp.indexOf("+"); }
            else { index = exp.indexOf("-"); }

            let add = 0;
            if (exp[index] === "+") { add = exp[index - 1] + exp[index + 1]; }
            else { add = exp[index - 1] - exp[index + 1] }

            exp.splice(index-1, 3, add);
        }
    }

    return exp[0]
}

const calcSin = exp => Math.sin(calculate(exp));

const calcCos = exp => Math.cos(calculate(exp));

const calcTan = exp => Math.tan(calculate(exp));

const calcLog10 = exp => Math.log10(calculate(exp));

const calcLn = exp => Math.log(calculate(exp));

let exp2 = ["(", 1, "-", 3, "*", "(", 2, "/", 3, "-", 1, ")", "+", 2, ")", "*", 2, "-", "(", 2, "+",1, "*", 3, "*", "(" , 3, "+", 1, "-", 1, ")", ")", "^", 2]
// let exp2 = [1, "-", 3]

// ***/-+++