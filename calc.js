let expressions = [];
let activeIndex = 0;

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

let numbers = "1234567890."

let degreeAdjustment = 1;

// inv, deg/rad

const addKey = event => {
    if (event.target.id !== "exp-input") {
        specialKeysCheck(event);
        if (validKeys.includes(event.key)) { document.getElementById("exp-input").value += event.key; } 
    } else {
        specialKeysCheck(event);
        if (!validKeys.includes(event.key) && !inputKeys.includes(event.key)) { event.preventDefault(); }            
    }
}

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
    } else if (event.key === "v") {
        event.preventDefault();
        document.getElementById("exp-input").value += "^-1";
    } else if (event.key === "a") {
        event.preventDefault();
        document.getElementById("exp-input").value += "ans";
    } else if (event.key === "d") {
        event.preventDefault();
        if (degreeAdjustment === 1) { degreeAdjustment = Math.PI / 180;}
        else {degreeAdjustment = 1;}
        console.log(degreeAdjustment);
    } else if (event.key === "Backspace" && event.target.id !== "exp-input") {
        console.log(event.key);
        let exp = document.getElementById("exp-input").value;
        document.getElementById("exp-input").value = exp.slice(0, exp.length - 1)
    }
    else if (event.key === "Enter") {
        executeInput();
    }
}

const executeInput = () => {
    let inputExpression = document.getElementById("exp-input");
    expressions.splice(activeIndex, 1, inputExpression.value);
    
    // const calculations = expressions.slice(activeIndex).map(expression, calculate(expression));
    for (let i = activeIndex; i < expressions.length; i++) {
        document.getElementById("p" + i).children[1].innerText = calculate(expressions[i], i);
    }

    // document.getElementById("calculation").innerText = calculation;

    let nextIndex = activeIndex + 1;

    turnOffIdsRemoveInput(inputExpression);
    console.log(inputExpression);
    
    if (nextIndex === expressions.length) {
        // expressions.push(inputExpression.value);
        const next = '<td class="problem" id="problem"><input id="exp-input" autofocus></input></td><td class="calculation" id="calculation"></td>';
        const nextExpression = document.createElement("tr");
        nextExpression.setAttribute("class", "expression");
        nextExpression.setAttribute("id", "p" + nextIndex);
        nextExpression.innerHTML = next;
        document.querySelector("tbody").append(nextExpression);
        const expContainer = document.getElementById("expression-container");
        expContainer.scrollTo(0, expContainer.scrollHeight);
        resetListeners();
    } else {
        // expressions.splice(activeIndex, 1, inputExpression.value);
        let nextExpression = document.getElementById("p" + nextIndex);
        let nextExpressionText = nextExpression.children[0].innerText;
        nextExpression.children[0].innerText = "";
        nextExpression.children[0].innerHTML = '<input id="exp-input" autofocus></input>';
        document.getElementById("exp-input").value = nextExpressionText;
        nextExpression.children[0].setAttribute("id", "problem");
        nextExpression.children[1].setAttribute("id", "calculation");
        // LOOKIE put additional calculations here.
    }
    
    activeIndex++;
}

const resetListeners = () => {
    document.removeEventListener("keydown", addKey);

    document.addEventListener("keydown", addKey);

    for (element of document.getElementsByClassName("problem")) {
        element.removeEventListener("click", activateClickedExpression);
        element.addEventListener("click", activateClickedExpression);
    }
}

const turnOffIdsRemoveInput = inputExpression => {
    document.getElementById("problem").innerText = inputExpression.value;
    for (element of document.getElementById("expressions").querySelectorAll("*")) {
        if (element.className !== "expression") { element.removeAttribute("id"); }
    }
    inputExpression.remove();
}

const activateClickedExpression = event => {
    if (event.target.className === "problem") {
        currentExpression = document.getElementById("exp-input");
        expressions.splice(activeIndex, 1, currentExpression.value);
        for (let i = activeIndex; i < expressions.length; i++) {
            document.getElementById("p" + i).children[1].innerText = calculate(expressions[i]);
        }
        turnOffIdsRemoveInput(currentExpression);
        
        let clickedExpression = event.target;
        let clickedExpressionText = event.target.innerText;
        clickedExpression.innerText = "";
        clickedExpression.innerHTML = '<input id="exp-input" autofocus></input>';
        document.getElementById("exp-input").value = clickedExpressionText;
        
        activeIndex = Number(clickedExpression.parentElement.id.slice(1));
        clickedExpression.parentElement.children[0].id = "problem";
        clickedExpression.parentElement.children[1].id = "calculation";
    }
}

const look = event => {
    console.log(event.target);
}

document.getElementById("expressions").addEventListener("click", look);

let buttonInputs = {
    "tan": "tan",
    "cos": "cos",
    "sin": "sin",
    "pi": "pi",
    "e-exponent": "e^",
    "ln": "ln",
    "log10": "log",
    "exponent": "^",
    "inverse": "^-1",
    "square": "^2",
    "parentheses-open": "(",
    "parentheses-close": ")",
    "plus": "+",
    "minus": "-",
    "multiply": "*",
    "divide": "/",
    "ans": "ans",
    "decimal": ".",
    "nine": "9",
    "eight": "8",
    "seven": "7",
    "six": "6",
    "five": "5",
    "four": "4",
    "three": "3",
    "two": "2",
    "one": "1",
    "zero": "0"
};

for (let button in buttonInputs) {
    document.getElementById(button).children[0].addEventListener("click", () => {
        document.getElementById("exp-input").value += buttonInputs[button];
    });
}

document.getElementById("equal").addEventListener("click", executeInput)

// for (button of document.getElementsByClassName("button")) {
//     button.addEventListener("click", event => {
//         console.log(event.target.parentElement.id);
//         document.getElementById("exp-input").value += buttonInputs[event.target.parentElement.id]
//     })
// }

// document.getElementById("tan").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("cos").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("sin").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("pi").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("e-exponent").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("ln").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("log10").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("exponent").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("inverse").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("square").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("plus").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("minus").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("multiply").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("divide").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("decimal").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("nine").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("eight").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("seven").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("six").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("five").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("four").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("three").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("two").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("one").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// document.getElementById("zero").children[0].addEventListener("click", event => {
//     console.log(event.target.parentElement.id)
// });

// for (button in buttonInputs) {
//     document.getElementById(button).children[0].addEventListener("click", event => {
//         console.log(event.target.parentElement.id);
//         // document.getElementById("exp-input").value += buttonInputs[event.target.parentElement.id]
//     })
// }

// for (let i = 0; i < Object.keys(buttonInputs).length; i++) {
//     document.getElementsByClassName("button")[i].children[0].addEventListener("click", event => {
//         console.log(event.target.parentElement.id);
//         // document.getElementById("exp-input").value += buttonInputs[event.target.parentElement.id]
//     })
// }

// for (let button in buttonInputs) {
//     document.getElementById(button).children[0].addEventListener("click", event => {
//         console.log(event.target.parentElement.id);
//         // document.getElementById("exp-input").value += buttonInputs[event.target.parentElement.id]
//     })
// }



const calculate = (expression, expIndex) => {
    // console.log(expression);
    if (expression === "") { return "invalid"; }
    let exp = expression.replaceAll("asin", "S");
    // console.log(exp);
    exp = exp.replaceAll("acos", "C");
    // console.log(exp);
    exp = exp.replaceAll("atan", "T");
    // console.log(exp);
    exp = exp.replaceAll("sin^-1", "S");
    // console.log(exp);
    exp = exp.replaceAll("cos^-1", "C");
    // console.log(exp);
    exp = exp.replaceAll("tan^-1", "T");
    // console.log(exp);        
    exp = exp.replaceAll("sin", "s");
    // console.log(exp);
    exp = exp.replaceAll("cos", "c");
    // console.log(exp);
    exp = exp.replaceAll("tan", "t");
    // console.log(exp);
    exp = exp.replaceAll("pi", "p");
    // console.log(exp);
    exp = exp.replaceAll("log", "l");
    // console.log(exp);
    exp = exp.replaceAll("ln", "n");
    // console.log(exp);
    exp = exp.replaceAll("ans", "a");
    // console.log(exp);
    exp = exp.match(/[sctpelna()\+\-*\/\^]|\d+(\.\d+)?|\.\d+/g);
    // console.log(exp);

    exp = exp.map(char => {
        if (!isNaN(Number(char)) || char === ".") { return Number(char); }
        else { return char; }
    })
    // console.log(exp);

    const validStarts = "1234567890.(";
    const specials = "sctSCTln";
    const ops = "+*/^";
    let parenNum = 0;

    while (exp.includes("p")) {
        let index = exp.indexOf("p");
        exp.splice(index, 1, Math.PI);
    }

    // console.log(exp);
    while (exp.includes("a")) {
        let previousIndex = expIndex - 1;
        if (previousIndex === -1) { console.log("here"); return "invalid"; }
        let ans = Number(document.getElementById("p" + previousIndex).children[1].innerText);
        if (isNaN(ans)) { return "invalid"; }
        let index = exp.indexOf("a");
        exp.splice(index, 1, ans);
    }
    // console.log(exp);

    while (exp.includes("e")) {
        let index = exp.indexOf("e");
        exp.splice(index, 1, Math.E);
    }

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
            exp.splice(exp.indexOf("("), innerExp.length + 2, calculate(innerExp.join("")));
        }
        
        // console.log("(-)");
        let i = 0
        while (i < exp.length) {
            if (exp[i] === "-" && (i === 0 || typeof exp[i - 1] !== "number")) { exp.splice(i, 1, -1, "*"); }
            else if (exp[i] === "+" && (i === 0 || typeof exp[i - 1] !== "number")) { exp.splice(i, 1, 1, "*"); }
            i++;
        }

        // let specials = ["s", "c", "t", "S", "T", "C"];

        // for (char in specials) 

        // console.log("s");
        while (exp.includes("s")) {
            let index = exp.indexOf("s");
            let add = Math.sin(exp[index + 1] * degreeAdjustment);
            exp.splice(index, 2, add);            
        }

        // console.log("c");
        while (exp.includes("c")) {
            let index = exp.indexOf("c");
            let add = Math.cos(exp[index + 1] * degreeAdjustment);
            exp.splice(index, 2, add);
        }

        // console.log("t");
        while (exp.includes("t")) {
            let index = exp.indexOf("t");
            let add = Math.tan(exp[index + 1] * degreeAdjustment);
            exp.splice(index, 2, add);
        }

        // console.log("S");
        while (exp.includes("S")) {
            let index = exp.indexOf("S");
            let add = Math.asin(exp[index + 1]) * degreeAdjustment;
            exp.splice(index, 2, add);
        }

        // console.log("C");
        while (exp.includes("C")) {
            let index = exp.indexOf("C");
            let add = Math.acos(exp[index + 1]) * degreeAdjustment;
            exp.splice(index, 2, add);
        }

        // console.log("T");
        while (exp.includes("T")) {
            let index = exp.indexOf("T");
            let add = Math.atan(exp[index + 1]) * degreeAdjustment;
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
        // console.log(exp);
    }
    // console.log(exp);

    // console.log("num");
    if (exp.length === 0 || exp[0] === NaN || typeof exp[0] !== "number") { return "invalid" }

    const calculation = exp[0];
    let numOfPlaces = 0;
    if (Math.round(calculation) !== calculation) {
        // console.log("DECIMAL!")
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

const calcSin = exp => Math.sin(calculate(exp) * degreeAdjustment);

const calcCos = exp => Math.cos(calculate(exp) * degreeAdjustment);

const calcTan = exp => Math.tan(calculate(exp) * degreeAdjustment);

const calcLog10 = exp => Math.log10(calculate(exp) * degreeAdjustment);

const calcLn = exp => Math.log(calculate(exp) * degreeAdjustment);

resetListeners();

let exp = [2,"+",2]
let exp2 = ["(", 1, "-", 3, "*", "l", "(", 2, "/", 3, "-", 1, ")", "+", 2, "+", "e", ")", "*", 2, "-", "(", 2, "+",1, "*", 3, "*", "(" , 3, "+", 1, "-", 1, ")", ")", "^", 2]
let exp3 = ["-", 4, "+", "s", "(", 45, "*", "p", "*", "(", 2, ")", "*", "l", "(", 104, ")", ")", "+", "e"]