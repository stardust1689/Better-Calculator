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
    ".",
    "+",
    "-",
    "*",
    "/",
    "(",
    ")",
    "^"
];

const inputKeys = [
    "Backspace",
    "ArrowRight",
    "ArrowLeft"
]

let numbers = ("1234567890.")

// also, c, inv, deg/rad, Enter

const specialKeysCheck = event => {
    if (event.key === "s") {
        event.preventDefault();
        document.getElementById("exp-input").value += "sin";  
    } else if (event.key === "c") {
        event.preventDefault();
        document.getElementById("exp-input").value += "cos";  
    } else if (event.key === "t") {
        event.preventDefault();
        document.getElementById("exp-input").value += "tan";
    } else if (event.key === "p") {
        event.preventDefault();
        document.getElementById("exp-input").value += "pi";       
    } else if (event.key === "e") {
        event.preventDefault();
        document.getElementById("exp-input").value += "e";    
    } else if (event.key === "l") {
        event.preventDefault();
        document.getElementById("exp-input").value += "log";   
    } else if (event.key === "n") {
        event.preventDefault();
        document.getElementById("exp-input").value += "ln";
    } else if (event.key === "Enter") {
        let newExpression = document.getElementById("exp-input").value
        console.log(newExpression);
        newExpression = newExpression.replaceAll("asin", "S");
        newExpression = newExpression.replaceAll("acos", "C");
        newExpression = newExpression.replaceAll("atan", "T");
        newExpression = newExpression.replaceAll("sin^-1", "S");
        newExpression = newExpression.replaceAll("cos^-1", "C");
        newExpression = newExpression.replaceAll("tan^-1", "T");        
        newExpression = newExpression.replaceAll("sin", "s");
        newExpression = newExpression.replaceAll("cos", "c");
        newExpression = newExpression.replaceAll("tan", "t");
        newExpression = newExpression.replaceAll("pi", "p");
        newExpression = newExpression.replaceAll("log", "l");
        newExpression = newExpression.replaceAll("ln", "n");
        console.log(newExpression);
        newExpression = newExpression.match(/[sctpeln()\+\-*\/^]|\d+(\.\d+)?|\.\d+/g);
        newExpression = newExpression.map(char => {
            if (!isNaN(Number(char)) || char === ".") { return Number(char) }
            else { return char }
        })
        console.log(newExpression);
        const calculation = calculate(newExpression);
        document.getElementById("calculation").innerText = calculation;
        console.log(calculation);
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
    if (!validKeys.includes(event.key) && !inputKeys.includes(event.key)) {
        event.preventDefault();
    }
});

const calculate = expression => {
    let exp = expression.slice();
    const validStarts = "1234567890.("
    const specials = "sctSCTln";
    const ops = "+*/^";
    let parenNum = 0;
    for (let i = 0; i < exp.length; i++) {
        if (typeof exp[i] === "number" && typeof exp[i+1] === "number") { return "invalid"; }
        if (exp[i] === ")") { parenNum--; }
        else if (exp[i] === "(") { parenNum++; }
        if (parenNum < 0) { return "invalid"; }
        if (specials.includes(exp[i]) && (i+1 === exp.length || exp[i+1] !== "(")) { return "invalid"; }
        else if (i === 0 && ops.includes(exp[i])) { return "invalid"; }
        else if ((ops.includes(exp[i]) || exp[i] === "-") && (i+1 === exp.length || ops.includes(exp[i+1]))) { return "invalid"; }
    }
    
    while (exp.length > 1) {

        while (exp.includes("p")) {
            let index = exp.indexOf("p");
            exp.splice(index, 1, Math.PI);
        }

        while (exp.includes("e")) {
            let index = exp.indexOf("e");
            exp.splice(index, 1, Math.E);
        }
        
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

        let i = 0
        while (i < expression.length) {
            if (exp[i] === "-" && (i === 0 || typeof exp[i - 1] !== "number")) { exp.splice(i, 1, -1, "*"); }
            else if (exp[i] === "+" && (i === 0 || typeof exp[i - 1] !== "number")) { exp.splice(i, 1, 1, "*"); }
            i++;
        }

        // let specials = ["s", "c", "t", "S", "T", "C"];

        // for (char in specials) 

        while (exp.includes("s")) {
            let index = exp.indexOf("s");
            let add = Math.sin(exp[index + 1]);
            exp.splice(index, 2, add);            
        }

        while (exp.includes("c")) {
            let index = exp.indexOf("c");
            let add = Math.cos(exp[index + 1]);
            exp.splice(index, 2, add);
        }

        while (exp.includes("t")) {
            let index = exp.indexOf("t");
            let add = Math.tan(exp[index + 1]);
            exp.splice(index, 2, add);
        }

        while (exp.includes("S")) {
            let index = exp.indexOf("S");
            let add = Math.asin(exp[index + 1]);
            exp.splice(index, 2, add);
        }

        while (exp.includes("C")) {
            let index = exp.indexOf("C");
            let add = Math.acos(exp[index + 1]);
            exp.splice(index, 2, add);
        }

        while (exp.includes("T")) {
            let index = exp.indexOf("T");
            let add = Math.atan(exp[index + 1]);
            exp.splice(index, 2, add);
        }

        while (exp.includes("l")) {
            let index = exp.indexOf("l");
            let add = Math.log10(exp[index + 1]);
            exp.splice(index, 2, add);
        }

        while (exp.includes("n")) {
            let index = exp.indexOf("n");
            let add = Math.log(exp[index + 1]);
            exp.splice(index, 2, add);
        }

        while (exp.includes("^")) {
            let index = exp.indexOf("^");
            let add = exp[index - 1]**exp[index + 1];
            exp.splice(index-1, 2, add);
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

    if (exp.length === 0 || exp[0] === NaN || typeof exp[0] !== "number") { return "invalid" }

    const calculation = exp[0];
    let numOfPlaces = 0;
    if (Math.round(calculation) !== calculation) {
        console.log("DECIMAL!")
        decimalAsStr = (calculation - Math.floor(calculation)).toFixed(7).toString();
        while (decimalAsStr[decimalAsStr.length - 1] === "0") {
            decimalAsStr = decimalAsStr.slice(0, decimalAsStr.length - 1);
        }
        numOfPlaces = decimalAsStr.length
        return roundOff(calculation, numOfPlaces);
    }
    return calculation;
}

const roundOff = (num, places) => {
    let n = Math.pow(10, places);
    return Math.round(num * n) / n;
} 

const calcSin = exp => Math.sin(calculate(exp));

const calcCos = exp => Math.cos(calculate(exp));

const calcTan = exp => Math.tan(calculate(exp));

const calcLog10 = exp => Math.log10(calculate(exp));

const calcLn = exp => Math.log(calculate(exp));

let exp = [2,"+",2]
let exp2 = ["(", 1, "-", 3, "*", "l", "(", 2, "/", 3, "-", 1, ")", "+", 2, "+", "e", ")", "*", 2, "-", "(", 2, "+",1, "*", 3, "*", "(" , 3, "+", 1, "-", 1, ")", ")", "^", 2]
let exp3 = ["-", 4, "+", "s", "(", 45, "*", "p", "*", "(", 2, ")", "*", "l", "(", 104, ")", ")", "+", "e"]
// let exp2 = [1, "-", 3]

// ***/-+++