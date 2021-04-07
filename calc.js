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
        let newExpression = document.getElementById("exp-input")
        let newExpressionCalc = newExpression.value.replaceAll("asin", "S");
        newExpressionCalc = newExpressionCalc.replaceAll("acos", "C");
        newExpressionCalc = newExpressionCalc.replaceAll("atan", "T");
        newExpressionCalc = newExpressionCalc.replaceAll("sin^-1", "S");
        newExpressionCalc = newExpressionCalc.replaceAll("cos^-1", "C");
        newExpressionCalc = newExpressionCalc.replaceAll("tan^-1", "T");        
        newExpressionCalc = newExpressionCalc.replaceAll("sin", "s");
        newExpressionCalc = newExpressionCalc.replaceAll("cos", "c");
        newExpressionCalc = newExpressionCalc.replaceAll("tan", "t");
        newExpressionCalc = newExpressionCalc.replaceAll("pi", "p");
        newExpressionCalc = newExpressionCalc.replaceAll("log", "l");
        newExpressionCalc = newExpressionCalc.replaceAll("ln", "n");
        newExpressionCalc = newExpressionCalc.match(/[sctpeln()\+\-*\/\^]|\d+(\.\d+)?|\.\d+/g);
        console.log(newExpressionCalc);

        newExpressionCalc = newExpressionCalc.map(char => {
            if (!isNaN(Number(char)) || char === ".") { return Number(char); }
            else { return char; }
        })

        const calculation = calculate(newExpressionCalc);

        document.getElementById("calculation").innerText = calculation;
        expressions.push(newExpression.value);
        document.getElementById("problem").innerText = newExpression.value;
        for (element of document.getElementById("expressions").querySelectorAll("*")) {
            element.removeAttribute("id");
        }
        newExpression.remove();

        
        const next = '<td class="problem" id="problem"><input id="exp-input" autofocus></input></td><td class="calculation" id="calculation"></td>';
        const nextExpression = document.createElement("tr");
        nextExpression.setAttribute("class", "expression");
        nextExpression.innerHTML = next;
        document.querySelector("tbody").append(nextExpression);
        const expContainer = document.getElementById("expression-container");
        expContainer.scrollTo(0, expContainer.scrollHeight);
        resetListeners();
    }
}

const addKey = event => {
    if (event.target.id !== "exp-input") {
        specialKeysCheck(event);
        if (validKeys.includes(event.key)) {
            document.getElementById("exp-input").value += event.key;
        }
    } else {
        specialKeysCheck(event);
        if (!validKeys.includes(event.key) && !inputKeys.includes(event.key)) {
            event.preventDefault();
        }            
    }
}

const resetListeners = () => {
    document.removeEventListener("keydown", addKey)

    document.addEventListener("keydown", addKey);

    // document.getElementById("exp-input").addEventListener("keydown", event => {
    //     specialKeysCheck(event);
    //     if (!validKeys.includes(event.key) && !inputKeys.includes(event.key)) {
    //         event.preventDefault();
    //     }
    // });
}


const calculate = expression => {
    let exp = expression.slice();
    const validStarts = "1234567890.("
    const specials = "sctSCTln";
    const ops = "+*/^";
    let parenNum = 0;

    while (exp.includes("p")) {
        let index = exp.indexOf("p");
        exp.splice(index, 1, Math.PI);
    }

    while (exp.includes("e")) {
        let index = exp.indexOf("e");
        exp.splice(index, 1, Math.E);
    }
    console.log("good");

    for (let i = 0; i < exp.length; i++) {
        if (typeof exp[i] === "number" && typeof exp[i+1] === "number") { return "invalid"; }
        console.log("good");
        if (exp[i] === ")") { parenNum--; }
        else if (exp[i] === "(") { parenNum++; }
        console.log("good");
        if (parenNum < 0) { return "invalid"; }
        console.log("good");
        if (specials.includes(exp[i]) && (i+1 === exp.length || exp[i+1] !== "(")) { return "invalid"; }
        else if (i === 0 && ops.includes(exp[i])) { return "invalid"; }
        else if ((ops.includes(exp[i]) || exp[i] === "-") && (i+1 === exp.length || ops.includes(exp[i+1]))) { return "invalid"; }
        console.log("good");
    }
    
    while (exp.length > 1) {
        console.log(exp);
        // console.log("(");
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
        
        // console.log("(-)");
        let i = 0
        while (i < expression.length) {
            if (exp[i] === "-" && (i === 0 || typeof exp[i - 1] !== "number")) { exp.splice(i, 1, -1, "*"); }
            else if (exp[i] === "+" && (i === 0 || typeof exp[i - 1] !== "number")) { exp.splice(i, 1, 1, "*"); }
            i++;
        }

        // let specials = ["s", "c", "t", "S", "T", "C"];

        // for (char in specials) 

        // console.log("s");
        while (exp.includes("s")) {
            let index = exp.indexOf("s");
            let add = Math.sin(exp[index + 1]);
            exp.splice(index, 2, add);            
        }

        // console.log("c");
        while (exp.includes("c")) {
            let index = exp.indexOf("c");
            let add = Math.cos(exp[index + 1]);
            exp.splice(index, 2, add);
        }

        // console.log("t");
        while (exp.includes("t")) {
            let index = exp.indexOf("t");
            let add = Math.tan(exp[index + 1]);
            exp.splice(index, 2, add);
        }

        // console.log("S");
        while (exp.includes("S")) {
            let index = exp.indexOf("S");
            let add = Math.asin(exp[index + 1]);
            exp.splice(index, 2, add);
        }

        // console.log("C");
        while (exp.includes("C")) {
            let index = exp.indexOf("C");
            let add = Math.acos(exp[index + 1]);
            exp.splice(index, 2, add);
        }

        // console.log("T");
        while (exp.includes("T")) {
            let index = exp.indexOf("T");
            let add = Math.atan(exp[index + 1]);
            exp.splice(index, 2, add);
        }

        // console.log("log10");
        while (exp.includes("l")) {
            let index = exp.indexOf("l");
            let add = Math.log10(exp[index + 1]);
            exp.splice(index, 2, add);
        }

        // console.log("ln");
        while (exp.includes("n")) {
            let index = exp.indexOf("n");
            let add = Math.log(exp[index + 1]);
            exp.splice(index, 2, add);
        }

        // console.log("^");
        while (exp.includes("^")) {
            let index = exp.indexOf("^");
            let add = exp[index - 1]**exp[index + 1];
            exp.splice(index-1, 3, add);
        }

        // console.log("*/");
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

        // console.log("+-");
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
        console.log(exp);
    }

    console.log("num");
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
resetListeners();