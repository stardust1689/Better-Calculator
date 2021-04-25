
// console.log(window.localStorage);
// document.getElementById("exp-input").value = window.localStorage.getItem("expressions");

// storage 

const addExpression = (addIds=false) => {
    let newExpression = document.createElement("tr");
    newExpression.className = "expression";
    newExpression.id = "p" + `${activeIndex}`;
    if (addIds) {
        newExpression.innerHTML += 
            '<td class="problem" id="problem"><input id="exp-input" autofocus></input></td><td class="calculation" id="calculation"></td>';
    } else {
        newExpression.innerHTML += 
            '<td class="problem">' + `${expressions[activeIndex]}` + '</td><td class="calculation">' + `${calculate(expressions[activeIndex], activeIndex)}` + `</td>`;
    }
    document.getElementById("expressions").children[0].append(newExpression);
    highestExpressionId++;
}

const turnOffIdsRemoveInput = inputExpression => {
    document.getElementById("problem").innerText = inputExpression.value;
    for (element of document.getElementById("expressions").querySelectorAll("*")) {
        if (element.className !== "expression") { element.removeAttribute("id"); }
    }
    inputExpression.remove();
}

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

document.addEventListener("keydown", event => {
    console.log(event);
});

const inputKeys = [
    "Backspace",
    "ArrowRight",
    "ArrowLeft",
    "ArrowUp",
    "ArrowDown"
];

let numbers = "1234567890.";

let degreeAdjustment = 1;

const addKey = event => {
    if (event.type === "keydown" && ((event.ctrlKey || (event.shiftKey && ((event.key === "c" || event.key === "v")))) || event.key === "Home" || event.key === "End")) {
        return;
    } else if (event.target.id !== "exp-input") {
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
    } else if (event.key === "S") {
        event.preventDefault();
        document.getElementById("exp-input").value += "sin^-1";
    } else if (event.key === "C") {
        event.preventDefault();
        document.getElementById("exp-input").value += "cos^-1";
    } else if (event.key === "T") {
        event.preventDefault();
        document.getElementById("exp-input").value += "tan^-1";
    } else if (event.key === "p") {
        event.preventDefault();
        document.getElementById("exp-input").value += "π";       
    } else if (event.key === "e") {
        event.preventDefault();
        document.getElementById("exp-input").value += "e";    
    } else if (event.key === "l") {
        event.preventDefault();
        document.getElementById("exp-input").value += "log";   
    } else if (event.key === "n") {
        event.preventDefault();
        document.getElementById("exp-input").value += "ln";
    } else if (event.key === "i") {
        event.preventDefault();
        document.getElementById("exp-input").value += "^-1";
    } else if (event.key === "a") {
        event.preventDefault();
        document.getElementById("exp-input").value += "ans";
    } else if (event.key === "d") {
        event.preventDefault();
        changeDegrees();
    } else if (event.key === "Backspace" && event.target.id !== "exp-input") {
        console.log(event.key);
        let exp = document.getElementById("exp-input").value;
        document.getElementById("exp-input").value = exp.slice(0, exp.length - 1); 
    } else if (event.key === "ArrowUp") {
        if (activeIndex !== 0) {
            executeInput(createNew=false);
            activeIndex--;
            activateExpression(event);
            let currentExpression = document.getElementById("p" + activeIndex);
            currentExpression.scrollIntoView(scrollIntoViewOptions = {block: "nearest"});        
        }
    } else if (event.key === "ArrowDown") {
        if (activeIndex !== highestExpressionId) {
            executeInput(createNew=false);
            activeIndex++;
            activateExpression(event);
            let currentExpression = document.getElementById("p" + activeIndex);
            currentExpression.scrollIntoView(scrollIntoViewOptions = {block: "nearest"});
        }
    }
    else if (event.key === "Enter") {
        executeInput();
    }
}

const executeInput = (createNew=true) => {
    let inputExpression = document.getElementById("exp-input");
    expressions.splice(activeIndex, 1, inputExpression.value);
    window.localStorage.setItem("expressions", expressions);

    for (let i = activeIndex; i <= highestExpressionId; i++) {
        console.log(activeIndex, highestExpressionId);
        document.getElementById("p" + i).children[1].innerText = calculate(expressions[i], i);
    }

    turnOffIdsRemoveInput(inputExpression);
    console.log(inputExpression);
    
    if (createNew) {
        let nextIndex = activeIndex + 1;
        if (nextIndex === highestExpressionId + 1) {

            // const next = '<td class="problem" id="problem"><input id="exp-input" autofocus></input></td><td class="calculation" id="calculation"></td>';
            // const nextExpression = document.createElement("tr");
            // nextExpression.setAttribute("class", "expression");
            // nextExpression.setAttribute("id", "p" + nextIndex);
            // nextExpression.innerHTML = next;
            // document.querySelector("tbody").append(nextExpression);
            activeIndex++;
            addExpression(addIds=true);
            const expContainer = document.getElementById("expression-container");
            expContainer.scrollTo(0, expContainer.scrollHeight);
            resetListeners();
        } else {
            let nextExpression = document.getElementById("p" + nextIndex);
            let nextExpressionText = nextExpression.children[0].innerText;
            nextExpression.children[0].innerText = "";
            nextExpression.children[0].innerHTML = '<input id="exp-input" autofocus></input>';
            document.getElementById("exp-input").value = nextExpressionText;
            nextExpression.children[0].setAttribute("id", "problem");
            nextExpression.children[1].setAttribute("id", "calculation");
            activeIndex++;
        }
    }

    console.log("execution complete");
}

const resetListeners = () => {
    document.removeEventListener("keydown", addKey);

    document.addEventListener("keydown", addKey);

    for (element of document.getElementsByClassName("problem")) {
        element.removeEventListener("mousedown", activateExpression);
        element.addEventListener("mousedown", activateExpression);
    }
}

// const activateClickedExpression 
const activateExpression = (event, upDownButton=false) => {
    if (event.type === "mousedown" && event.target.className === "problem") {
        console.log("going");
        currentExpression = document.getElementById("exp-input");
        expressions.splice(activeIndex, 1, currentExpression.value);
        window.localStorage.setItem("expressions", expressions);
        for (let i = activeIndex; i < highestExpressionId; i++) {
            document.getElementById("p" + i).children[1].innerText = calculate(expressions[i], i);
        }

        turnOffIdsRemoveInput(currentExpression);
        let clickedExpression = event.target;
        let expressionText = event.target.innerText;
        clickedExpression.innerText = "";
        clickedExpression.innerHTML = '<input id="exp-input" autofocus></input>';
        document.getElementById("exp-input").value = expressionText;
        activeIndex = Number(clickedExpression.parentElement.id.slice(1));
        clickedExpression.parentElement.children[0].id = "problem";
        clickedExpression.parentElement.children[1].id = "calculation";
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown" || upDownButton) {
        console.log("good");
        let expressionToActivate = document.getElementById("p" + activeIndex).children[0];
        console.log(expressionToActivate);
        let expressionText = expressionToActivate.innerText;
        console.log(expressionText);
        expressionToActivate.innerText = "";
        expressionToActivate.innerHTML = '<input id="exp-input" autofocus></input>';
        document.getElementById("exp-input").value = expressionText;
        expressionToActivate.parentElement.children[0].id = "problem";
        expressionToActivate.parentElement.children[1].id = "calculation";
    }
}

const look = event => {
    console.log(event.target);
}

// document.getElementById("expressions").addEventListener("click", look);

document.addEventListener("click", event => {
    console.log(event.type);
    console.log(event.target.className);
    console.log(event.target.id);
});

let buttonInputs = {
    "tan": "tan",
    "cos": "cos",
    "sin": "sin",
    "pi": "π",
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

document.getElementById("equal").addEventListener("click", executeInput);

// for (button of document.getElementsByClassName("button")) {
//     button.addEventListener("click", event => {
//         console.log(event.target.parentElement.id);
//         document.getElementById("exp-input").value += buttonInputs[event.target.parentElement.id]
//     })
// }

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

document.getElementById("up").addEventListener("click", event => {
    if (activeIndex !== 0) {
        executeInput(createNew=false);
        activeIndex--;
        activateExpression(event, upDownButton=true);
        let currentExpression = document.getElementById("p" + activeIndex);
        currentExpression.scrollIntoView(scrollIntoViewOptions = {block: "nearest"});
    }
});

document.getElementById("down").addEventListener("click", event => {
    if (activeIndex !== highestExpressionId) {
        executeInput(createNew=false);
        activeIndex++;
        activateExpression(event, upDownButton=true);
        let currentExpression = document.getElementById("p" + activeIndex);
        currentExpression.scrollIntoView(scrollIntoViewOptions = {block: "nearest"});
    }        
});

document.getElementById("clear").addEventListener("click", () => {
    document.getElementById("clear-div").style.display = "block";
    document.removeEventListener("keydown", addKey);
});

document.getElementById("yes").addEventListener("click", () => {
    document.getElementById("clear-div").style.display = "none";
    resetListeners();
    document.getElementById("expressions").children[0].innerHTML = "";
    expressions = [];
    window.localStorage.removeItem("expressions");
    activeIndex = 0;
    highestExpressionId = -1;
    addExpression(addIds=true);
});

document.getElementById("no").addEventListener("click", () => {
    document.getElementById("clear-div").style.display = "none";
    resetListeners();
});

const changeDegrees = () => {
    const degrees = document.getElementById("degrees");
    const radians = document.getElementById("radians");
    if (!onDegrees) { 
        degreeAdjustment = Math.PI / 180;
        degrees.style = "border: 0.15rem solid #D6EAF0";
        radians.style = null;
        onDegrees = true;
    } else {
        degreeAdjustment = 1;
        degrees.style = null;
        radians.style = "border: 0.15rem solid #D6EAF0";
        onDegrees = false;
    }
}

document.getElementById("deg-rad").addEventListener("click", changeDegrees);

document.getElementById("help").addEventListener("click", () => {
    chrome.tabs.create( createProperties={active:true, url:"help.html"} );
});

document.getElementById("website").addEventListener("click", () => {
    chrome.tabs.create( createProperties={active:true, url:"https://stardust1689.github.io/Personal-Website/"} );
});

document.getElementById("github").addEventListener("click", () => {
    chrome.tabs.create( createProperties={active:true, url:"https://github.com/stardust1689"} );
});

const calculate = (expression, expIndex) => {
    let j = 0;
    // console.log(expression);
    if (expression === "") { return "!"; }
    // return typeof expression
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
    exp = exp.replaceAll("π", "p");
    // console.log(exp);
    exp = exp.replaceAll("log", "l");
    // console.log(exp);
    exp = exp.replaceAll("ln", "n");
    // console.log(exp);
    exp = exp.replaceAll("ans", "a");
    // console.log(exp);
    exp = exp.match(/[SCTsctpelna()\+\-*\/\^]|\d+(\.\d+)?|\.\d+/g);
    // console.log(exp);

    exp = exp.map(char => {
        if (!isNaN(Number(char)) || char === ".") { return Number(char); }
        else { return char; }
    })
    console.log(exp);

    const validStarts = "1234567890.(";
    const specials = "sctSCTln";
    const ops = "*/^";
    let parenNum = 0;

    // console.log(exp);
    while (exp.includes("p")) {
        let index = exp.indexOf("p");
        exp.splice(index, 1, Math.PI);
        if (typeof exp[index+1] === "number") { exp.splice(index+1, 0, "*"); } 
        if (typeof exp[index-1] === "number") { exp.splice(index, 0, "*"); } 
        j++;
        if (j > 200) { return "INFINITE LOOP! p"; }
        // console.log(exp);
    }

    // console.log(exp);
    while (exp.includes("a")) {
        let previousIndex = expIndex - 1;
        if (previousIndex === -1) { console.log("here"); return "!"; }
        let ans = Number(document.getElementById("p" + previousIndex).children[1].innerText);
        if (isNaN(ans)) { return "!"; }
        let index = exp.indexOf("a");
        exp.splice(index, 1, ans);
        if (typeof exp[index+1] === "number") { exp.splice(index+1, 0, "*"); }
        if (typeof exp[index-1] === "number") { exp.splice(index, 0, "*"); }  
        j++;
        if (j > 200) { return "INFINITE LOOP! a"; }
        // console.log(exp);
    }
    // console.log(exp);

    while (exp.includes("e")) {
        let index = exp.indexOf("e");
        exp.splice(index, 1, Math.E);
        if (typeof exp[index+1] === "number") { exp.splice(index+1, 0, "*"); } 
        if (typeof exp[index-1] === "number") { exp.splice(index, 0, "*"); }  
        j++;
        if (j > 200) { return "INFINITE LOOP! e"; }
        // console.log(exp);
    }

    for (let i = 0; i < exp.length; i++) {
        if (typeof exp[i] === "number" && typeof exp[i+1] === "number") { return "!"; }
        if (exp[i] === ")") { 
            if (typeof exp[i+1] === "number") { exp.splice(i+1, 0, "*"); } 
            parenNum--; }
        else if (exp[i] === "(") { 
            if (typeof exp[i-1] === "number") { exp.splice(i, 0, "*"); } 
            parenNum++; 
        }
        if (parenNum < 0) { return "!"; }
        if (specials.includes(exp[i]) && (i+1 === exp.length || exp[i+1] !== "(")) { return "!"; }
        else if (i === 0 && ops.includes(exp[i])) { return "!"; }
        else if ((ops.includes(exp[i]) || exp[i] === "-") && (i+1 === exp.length || ops.includes(exp[i+1]))) { return "!"; }
    }

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
        j++;
        if (j > 200) { return "INFINITE LOOP! ("; }            
    }
    
    // console.log("(-)");


    // let specials = ["s", "c", "t", "S", "T", "C"];

    // for (char in specials) 

    // console.log("s");
    while (exp.includes("s")) {
        let index = exp.indexOf("s");
        let add = Math.sin(exp[index + 1] * degreeAdjustment);
        exp.splice(index, 2, add);
        if (typeof exp[index-1] === "number") { exp.splice(index, 0, "*"); } 
        j++;
        if (j > 200) { return "INFINITE LOOP! s"; }                
    }

    // console.log("c");
    while (exp.includes("c")) {
        let index = exp.indexOf("c");
        let add = Math.cos(exp[index + 1] * degreeAdjustment);
        exp.splice(index, 2, add);
        if (typeof exp[index-1] === "number") { exp.splice(index, 0, "*"); } 
        j++;
        if (j > 200) { return "INFINITE LOOP! c"; }    
    }

    // console.log("t");
    while (exp.includes("t")) {
        let index = exp.indexOf("t");
        let undefinedCheck = exp[index + 1] * degreeAdjustment / (Math.PI / 2);
        if (Number(undefinedCheck.toFixed(7)) === Math.round(undefinedCheck) && Math.round(undefinedCheck) % 2 !== 0) {
            return "!";
        }
        // console.log("quotient: " + `${}`);
        let add = Math.tan(exp[index + 1] * degreeAdjustment);
        exp.splice(index, 2, add);
        if (typeof exp[index-1] === "number") { exp.splice(index, 0, "*"); } 
        j++;
        if (j > 200) { return "INFINITE LOOP! t"; }    
    }

    // console.log("S");
    while (exp.includes("S")) {
        let index = exp.indexOf("S");
        let add = Math.asin(exp[index + 1]) * degreeAdjustment**-1;
        if (isNaN(add)) { return "!"; }
        exp.splice(index, 2, add);
        if (typeof exp[index-1] === "number") { exp.splice(index, 0, "*"); } 
        j++;
        if (j > 200) { return "INFINITE LOOP! S"; }    
    }

    // console.log("C");
    while (exp.includes("C")) {
        let index = exp.indexOf("C");
        let add = Math.acos(exp[index + 1]) * degreeAdjustment**-1;
        if (isNaN(add)) { return "!"; }
        exp.splice(index, 2, add);
        if (typeof exp[index-1] === "number") { exp.splice(index, 0, "*"); } 
        j++;
        if (j > 200) { return "INFINITE LOOP! C"; }    
    }

    // console.log("T");
    while (exp.includes("T")) {
        let index = exp.indexOf("T");
        let add = Math.atan(exp[index + 1]) * degreeAdjustment**-1;
        if (isNaN(add)) { return "!"; }
        exp.splice(index, 2, add);
        if (typeof exp[index-1] === "number") { exp.splice(index, 0, "*"); } 
        j++;
        if (j > 200) { return "INFINITE LOOP! T"; }    
    }

    // console.log("log10");
    while (exp.includes("l")) {
        let index = exp.indexOf("l");
        let add = Math.log10(exp[index + 1]);
        exp.splice(index, 2, add);
        if (typeof exp[index-1] === "number") { exp.splice(index, 0, "*"); } 
        j++;
        if (j > 200) { return "INFINITE LOOP! l"; }    
    }

    // console.log("ln");
    while (exp.includes("n")) {
        let index = exp.indexOf("n");
        let add = Math.log(exp[index + 1]);
        exp.splice(index, 2, add);
        if (typeof exp[index-1] === "number") { exp.splice(index, 0, "*"); } 
        j++;
        if (j > 200) { return "INFINITE LOOP! n"; }    
    }

    let i = 0
    console.log(6);
    while (i < exp.length) {
        console.log(i);
        if (exp[i] === "-" && (i === 0 || typeof exp[i - 1] !== "number")) { 
            if (exp[i+1] === "+" || exp[i+1] === "-") { console.log(1); exp.splice(i, 1, -1, "*"); } 
            else { console.log(2); exp.splice(i, 2, -exp[i+1]); }
        }
        else if (exp[i] === "+" && (i === 0 || typeof exp[i - 1] !== "number")) {
            console.log(5) 
            if (exp[i+1] === "+" || exp[i+1] === "-") { console.log(3); exp.splice(i, 1, 1, "*"); } 
            else { console.log(4); exp.splice(i, 2, exp[i+1]); }
        }
        i++;
        j++;
        if (j > 200) { return "INFINITE LOOP! exp.length"; }    
    }

    // console.log("^");
    while (exp.includes("^")) {
        let index = exp.indexOf("^");
        let add = exp[index - 1]**exp[index + 1];
        exp.splice(index-1, 3, add);
        j++;
        if (j > 200) { return "INFINITE LOOP! ^"; }    
    }

    // console.log("*/");
    console.log(exp);
    while (exp.includes("*") || exp.includes("/")) {
        let index = 0;
        if (exp.includes("*") && exp.includes("/")) { index = Math.min(exp.indexOf("*"), exp.indexOf("/")); }
        else if (exp.includes("*")) { index = exp.indexOf("*"); }
        else { index = exp.indexOf("/"); }

        let add = 0;
        if (exp[index] === "*") { add = exp[index - 1] * exp[index + 1]; }
        else { add = exp[index - 1] / exp[index + 1]; }

        exp.splice(index-1, 3, add);
        j++;
        if (j > 200) { return "INFINITE LOOP! */"; }
        console.log(exp);    
    }

    // console.log("+-");
    while (exp.includes("+") || exp.includes("-")) {
        let index = 0;
        if (exp.includes("+") && exp.includes("-")) { index = Math.min(exp.indexOf("+"), exp.indexOf("-")); }
        else if (exp.includes("+")) { index = exp.indexOf("+"); }
        else { index = exp.indexOf("-"); }

        let add = 0;
        if (exp[index] === "+") { add = exp[index - 1] + exp[index + 1]; }
        else { add = exp[index - 1] - exp[index + 1]; }

        exp.splice(index-1, 3, add);
        j++;
        if (j > 200) { return "INFINITE LOOP! +-";}
        console.log(exp);    
    }
        // console.log(exp);
    // console.log(exp);

    // console.log("num");
    if (exp.length !== 1 || isNaN(exp[0]) || typeof exp[0] !== "number") { return "!"; }

    const calculation = exp[0];
    let numOfPlaces = 0;
    if (Math.round(calculation) !== calculation) {
        // console.log("DECIMAL!")
        decimalAsStr = (calculation - Math.floor(calculation)).toFixed(7).toString();
        while (decimalAsStr[decimalAsStr.length - 1] === "0") {
            decimalAsStr = decimalAsStr.slice(0, decimalAsStr.length - 1);
        }
        numOfPlaces = decimalAsStr.length;
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



let exp = [2,"+",2];
let exp2 = ["(", 1, "-", 3, "*", "l", "(", 2, "/", 3, "-", 1, ")", "+", 2, "+", "e", ")", "*", 2, "-", "(", 2, "+",1, "*", 3, "*", "(" , 3, "+", 1, "-", 1, ")", ")", "^", 2];
let exp3 = ["-", 4, "+", "s", "(", 45, "*", "p", "*", "(", 2, ")", "*", "l", "(", 104, ")", ")", "+", "e"];

let expressions = [];
let activeIndex = 0;
let onDegrees = false;
let highestExpressionId = -1;

if (window.localStorage.getItem("expressions")) {
    expressions = window.localStorage.getItem("expressions").split(",");
    for (expression of expressions) {
        addExpression();
        activeIndex++;
    }
}

addExpression(addIds=true);

resetListeners();