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
    "e",
    ".",
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

const specialKeys = [
    "p",
    "s",
    "c",
    "t",
    "S",
    "C",
    "T",
    "l",
    "n",
    "i",
    "a",
    "d",
    "ArrowUp",
    "ArrowDown",
    "Backspace",
    "Enter"
]

const keyInput = event => {
    if (event.type === "keydown" && ((event.ctrlKey || (event.shiftKey && ((event.key === "c" || event.key === "v")))) || event.key === "Home" || event.key === "End")) {
        return;
    } else if (event.target.id !== "exp-input") {
        if (validKeys.includes(event.key)) { 
            if (event.key.length === 1) {
                addSpecial(event.key, 1);
            }; 
        } else if (specialKeys.includes(event.key)) {
            specialKeysCheck(event);
        }
    } else {
        if (validKeys.includes(event.key)) { 
            return;
        } else if (specialKeys.includes(event.key)) {
            specialKeysCheck(event);
        } else {
            event.preventDefault();
        }         
    }
}

const addSpecial = (input, range) => {
    let expInput = document.getElementById("exp-input");
    let index = expInput.selectionStart;
    let indexEnd = expInput.selectionEnd;
    let split = expInput.value.split("");
    split.splice(index, indexEnd - index, input);
    let newInput = split.join("");
    expInput.value = newInput;
    expInput.setSelectionRange(index + range, index + range);
    expInput.focus();
} 

const specialKeysCheck = event => {
    if (event.key === "s") {
        event.preventDefault();
        addSpecial("sin", 3);
    } else if (event.key === "c") {
        event.preventDefault();
        addSpecial("cos", 3);
    } else if (event.key === "t") {
        event.preventDefault();
        addSpecial("tan", 3);
    } else if (event.key === "S") {
        event.preventDefault();
        addSpecial("sin^-1", 6);
    } else if (event.key === "C") {
        event.preventDefault();
        addSpecial("cos^-1", 6);
    } else if (event.key === "T") {
        event.preventDefault();
        addSpecial("cos^-1", 6);
    } else if (event.key === "p") {
        event.preventDefault();
        addSpecial("π", 1);
    } else if (event.key === "e") {
        event.preventDefault();
        addSpecial("e", 1);
    } else if (event.key === "l") {
        event.preventDefault();
        addSpecial("log", 3);
    } else if (event.key === "n") {
        event.preventDefault();
        addSpecial("ln", 2);
    } else if (event.key === "i") {
        event.preventDefault();
        addSpecial("^-1", 3);
    } else if (event.key === "a") {
        event.preventDefault();
        addSpecial("ans", 3);
    } else if (event.key === "d") {
        event.preventDefault();
        changeDegrees();
    } else if (event.key === "Backspace" && event.target.id !== "exp-input") {
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
    } else if (event.key === "Enter") {
        executeInput();
    }
}

const executeInput = (createNew=true) => {
    let inputExpression = document.getElementById("exp-input");
    expressions.splice(activeIndex, 1, inputExpression.value);
    window.localStorage.setItem("expressions", expressions);

    for (let i = activeIndex; i <= highestExpressionId; i++) {
        document.getElementById("p" + i).children[1].innerText = calculate(expressions[i], i);
    }

    turnOffIdsRemoveInput(inputExpression);
    
    if (createNew) {
        let nextIndex = activeIndex + 1;
        if (nextIndex === highestExpressionId + 1) {
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
}

const activateExpression = (event, upDownButton=false) => {
    if (event.type === "mousedown" && event.target.className === "problem") {
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
        let expressionToActivate = document.getElementById("p" + activeIndex).children[0];
        let expressionText = expressionToActivate.innerText;
        expressionToActivate.innerText = "";
        expressionToActivate.innerHTML = '<input id="exp-input" autofocus></input>';
        document.getElementById("exp-input").value = expressionText;
        expressionToActivate.parentElement.children[0].id = "problem";
        expressionToActivate.parentElement.children[1].id = "calculation";
    }
}

const calculate = (expression, expIndex) => {
    let j = 0;
    if (expression === "") { return "!"; }
    let exp = expression.replaceAll("asin", "S");
    exp = exp.replaceAll("acos", "C");
    exp = exp.replaceAll("atan", "T");
    exp = exp.replaceAll("sin^-1", "S");
    exp = exp.replaceAll("cos^-1", "C");
    exp = exp.replaceAll("tan^-1", "T");
    exp = exp.replaceAll("sin", "s");
    exp = exp.replaceAll("cos", "c");
    exp = exp.replaceAll("tan", "t");
    exp = exp.replaceAll("π", "p");
    exp = exp.replaceAll("log", "l");
    exp = exp.replaceAll("ln", "n");
    exp = exp.replaceAll("ans", "a");
    exp = exp.match(/[SCTsctpelna()\+\-*\/\^]|\d+(\.\d+)?|\.\d+/g);

    exp = exp.map(char => {
        if (!isNaN(Number(char)) || char === ".") { 
            return Number(char); 
        } else { 
            return char; 
        }
    })

    const specials = "sctSCTln";
    const ops = "*/^";
    let parenNum = 0;

    while (exp.includes("p")) {
        let index = exp.indexOf("p");
        exp.splice(index, 1, Math.PI);
        if (typeof exp[index+1] === "number") {
            exp.splice(index+1, 0, "*"); 
        } 
        if (typeof exp[index-1] === "number") { 
            exp.splice(index, 0, "*"); 
        } 
        j++;
        if (j > 200) { 
            return "INFINITE LOOP! p"; 
        }
    }

    while (exp.includes("a")) {
        let previousIndex = expIndex - 1;
        if (previousIndex === -1) { 
            return "!"; 
        }
        let ans = Number(document.getElementById("p" + previousIndex).children[1].innerText);
        if (isNaN(ans)) { 
            return "!"; 
        }
        let index = exp.indexOf("a");
        exp.splice(index, 1, ans);
        if (typeof exp[index+1] === "number") { 
            exp.splice(index+1, 0, "*"); 
        }
        if (typeof exp[index-1] === "number") { 
            exp.splice(index, 0, "*"); 
        }  
        j++;
        if (j > 200) { 
            return "INFINITE LOOP! a"; 
        }
    }

    while (exp.includes("e")) {
        let index = exp.indexOf("e");
        exp.splice(index, 1, Math.E);
        if (typeof exp[index+1] === "number") { 
            exp.splice(index+1, 0, "*"); 
        } 
        if (typeof exp[index-1] === "number") {
            exp.splice(index, 0, "*"); 
        }  
    }

    for (let i = 0; i < exp.length; i++) {
        if (typeof exp[i] === "number" && typeof exp[i+1] === "number") { 
            return "!"; 
        }
        if (exp[i] === ")") { 
            if (typeof exp[i+1] === "number") { 
                exp.splice(i+1, 0, "*"); 
            } 
            parenNum--; 
        } else if (exp[i] === "(") { 
            if (typeof exp[i-1] === "number") { 
                exp.splice(i, 0, "*"); 
            } 
            parenNum++; 
        }
        if (parenNum < 0) { 
            return "!"; 
        }
        if (specials.includes(exp[i]) && (i+1 === exp.length || exp[i+1] !== "(")) { 
            return "!"; 
        } else if (i === 0 && ops.includes(exp[i])) {
            return "!"; 
        } else if ((ops.includes(exp[i]) || exp[i] === "-") && (i+1 === exp.length || ops.includes(exp[i+1]))) { 
            return "!"; 
        }
    }

    while (exp.includes("(")) {
        let parenNum = 1;
        let innerExp = [];
        for (let i = exp.indexOf("(") + 1; i < exp.length - 1; i++) {
            if (exp[i] === "(") { 
                parenNum++; 
            } else if (exp[i] === ")") { 
                parenNum--; 
            }
            if (parenNum === 0) { 
                break; 
            }
            innerExp.push(exp[i]);
        }
        exp.splice(exp.indexOf("("), innerExp.length + 2, calculate(innerExp.join("")));
        j++;
        if (j > 200) { return "INFINITE LOOP! ("; }            
    }
    
    while (exp.includes("s")) {
        let index = exp.indexOf("s");
        let add = Math.sin(exp[index + 1] * degreeAdjustment);
        exp.splice(index, 2, add);
        if (typeof exp[index-1] === "number") { 
            exp.splice(index, 0, "*"); 
        } 
        j++;
        if (j > 200) { return "INFINITE LOOP! s"; }                
    }

    while (exp.includes("c")) {
        let index = exp.indexOf("c");
        let add = Math.cos(exp[index + 1] * degreeAdjustment);
        exp.splice(index, 2, add);
        if (typeof exp[index-1] === "number") { 
            exp.splice(index, 0, "*"); 
        } 
        j++;
        if (j > 200) { return "INFINITE LOOP! c"; }    
    }

    while (exp.includes("t")) {
        let index = exp.indexOf("t");
        let undefinedCheck = exp[index + 1] * degreeAdjustment / (Math.PI / 2);
        if (Number(undefinedCheck.toFixed(7)) === Math.round(undefinedCheck) && Math.round(undefinedCheck) % 2 !== 0) {
            return "!";
        }
        let add = Math.tan(exp[index + 1] * degreeAdjustment);
        exp.splice(index, 2, add);
        if (typeof exp[index-1] === "number") { 
            exp.splice(index, 0, "*"); 
        } 
        j++;
        if (j > 200) { return "INFINITE LOOP! t"; }    
    }

    while (exp.includes("S")) {
        let index = exp.indexOf("S");
        let add = Math.asin(exp[index + 1]) * degreeAdjustment**-1;
        if (isNaN(add)) { 
            return "!"; 
        }
        exp.splice(index, 2, add);
        if (typeof exp[index-1] === "number") { 
            exp.splice(index, 0, "*"); 
        } 
        j++;
        if (j > 200) { return "INFINITE LOOP! S"; }    
    }

    while (exp.includes("C")) {
        let index = exp.indexOf("C");
        let add = Math.acos(exp[index + 1]) * degreeAdjustment**-1;
        if (isNaN(add)) { 
            return "!"; 
        }
        exp.splice(index, 2, add);
        if (typeof exp[index-1] === "number") { 
            exp.splice(index, 0, "*"); 
        } 
        j++;
        if (j > 200) { return "INFINITE LOOP! C"; }    
    }

    while (exp.includes("T")) {
        let index = exp.indexOf("T");
        let add = Math.atan(exp[index + 1]) * degreeAdjustment**-1;
        if (isNaN(add)) { 
            return "!"; 
        }
        exp.splice(index, 2, add);
        if (typeof exp[index-1] === "number") { 
            exp.splice(index, 0, "*"); 
        } 
        j++;
        if (j > 200) { return "INFINITE LOOP! T"; }    
    }

    while (exp.includes("l")) {
        let index = exp.indexOf("l");
        let add = Math.log10(exp[index + 1]);
        exp.splice(index, 2, add);
        if (typeof exp[index-1] === "number") { 
            exp.splice(index, 0, "*"); 
        } 
        j++;
        if (j > 200) { return "INFINITE LOOP! l"; }    
    }

    while (exp.includes("n")) {
        let index = exp.indexOf("n");
        let add = Math.log(exp[index + 1]);
        exp.splice(index, 2, add);
        if (typeof exp[index-1] === "number") { 
            exp.splice(index, 0, "*"); 
        } 
        j++;
        if (j > 200) { return "INFINITE LOOP! n"; }    
    }

    let i = 0;
    while (i < exp.length) {
        if (exp[i] === "-" && (i === 0 || typeof exp[i - 1] !== "number")) { 
            if (exp[i+1] === "+" || exp[i+1] === "-") { 
                exp.splice(i, 1, -1, "*"); 
            } else { 
                exp.splice(i, 2, -exp[i+1]); 
            }
        } else if (exp[i] === "+" && (i === 0 || typeof exp[i - 1] !== "number")) {
            if (exp[i+1] === "+" || exp[i+1] === "-") {
                exp.splice(i, 1, 1, "*"); 
            } else { 
                exp.splice(i, 2, exp[i+1]); 
            }
        }
        i++;
        j++;
        if (j > 200) { return "INFINITE LOOP! exp.length"; }    
    }

    while (exp.includes("^")) {
        let index = exp.indexOf("^");
        let add = exp[index - 1]**exp[index + 1];
        exp.splice(index-1, 3, add);
        j++;
        if (j > 200) { return "INFINITE LOOP! ^"; }    
    }

    while (exp.includes("*") || exp.includes("/")) {
        let index = 0;
        if (exp.includes("*") && exp.includes("/")) { 
            index = Math.min(exp.indexOf("*"), exp.indexOf("/")); 
        } else if (exp.includes("*")) { 
            index = exp.indexOf("*"); 
        } else { 
            index = exp.indexOf("/"); 
        }

        let add = 0;
        if (exp[index] === "*") { 
            add = exp[index - 1] * exp[index + 1]; 
        } else { 
            add = exp[index - 1] / exp[index + 1]; 
        }

        exp.splice(index-1, 3, add);
    }

    while (exp.includes("+") || exp.includes("-")) {
        let index = 0;
        if (exp.includes("+") && exp.includes("-")) { 
            index = Math.min(exp.indexOf("+"), exp.indexOf("-")); 
        } else if (exp.includes("+")) { 
            index = exp.indexOf("+"); 
        } else { 
            index = exp.indexOf("-"); 
        }

        let add = 0;
        if (exp[index] === "+") { 
            add = exp[index - 1] + exp[index + 1]; 
        } else { 
            add = exp[index - 1] - exp[index + 1]; 
        }

        exp.splice(index-1, 3, add);  
    }

    if (exp.length !== 1 || isNaN(exp[0]) || typeof exp[0] !== "number") { 
        return "!"; 
    }

    const calculation = exp[0];
    let numOfPlaces = 0;
    if (Math.round(calculation) !== calculation) {
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

const addExpression = (addIds = false) => {
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
        if (element.className !== "expression") {
            element.removeAttribute("id");
        }
    }
    inputExpression.remove();
}

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

const resetListeners = () => {
    document.removeEventListener("keydown", keyInput);

    document.addEventListener("keydown", keyInput);

    for (element of document.getElementsByClassName("problem")) {
        element.removeEventListener("mousedown", activateExpression);
        element.addEventListener("mousedown", activateExpression);
    }
}

let buttonInputs = {
    "tan": ["tan", 3],
    "cos": ["cos", 3],
    "sin": ["sin", 3],
    "pi": ["π", 1],
    "e-exponent": ["e^", 2],
    "ln": ["ln", 2],
    "log10": ["log", 3],
    "exponent": ["^", 1],
    "inverse": ["^-1", 3],
    "square": ["^2", 2],
    "parentheses-open": ["(", 1],
    "parentheses-close": [")", 1],
    "plus": ["+", 1],
    "minus": ["-", 1],
    "multiply": ["*", 1],
    "divide": ["/", 1],
    "ans": ["ans", 3],
    "decimal": [".", 1],
    "nine": ["9", 1],
    "eight": ["8", 1],
    "seven": ["7", 1],
    "six": ["6", 1],
    "five": ["5", 1],
    "four": ["4", 1],
    "three": ["3", 1],
    "two": ["2", 1],
    "one": ["1", 1],
    "zero": ["0", 1]
};

for (let button in buttonInputs) {
    document.getElementById(button).children[0].addEventListener("click", () => {
        addSpecial(buttonInputs[button][0], buttonInputs[button][1])
    });
}

document.getElementById("equal").addEventListener("click", executeInput);

document.getElementById("up").addEventListener("click", event => {
    if (activeIndex !== 0) {
        executeInput(createNew = false);
        activeIndex--;
        activateExpression(event, upDownButton = true);
        let currentExpression = document.getElementById("p" + activeIndex);
        currentExpression.scrollIntoView(scrollIntoViewOptions = {
            block: "nearest"
        });
    }
});

document.getElementById("down").addEventListener("click", event => {
    if (activeIndex !== highestExpressionId) {
        executeInput(createNew = false);
        activeIndex++;
        activateExpression(event, upDownButton = true);
        let currentExpression = document.getElementById("p" + activeIndex);
        currentExpression.scrollIntoView(scrollIntoViewOptions = {
            block: "nearest"
        });
    }
});

document.getElementById("clear").addEventListener("click", () => {
    document.getElementById("exp-input").value = "";
});

document.getElementById("clear-all").addEventListener("click", () => {
    document.getElementById("clear-div").style.display = "block";
    document.removeEventListener("keydown", keyInput);
});

document.getElementById("yes").addEventListener("click", () => {
    document.getElementById("clear-div").style.display = "none";
    resetListeners();
    document.getElementById("expressions").children[0].innerHTML = "";
    expressions = [];
    window.localStorage.removeItem("expressions");
    activeIndex = 0;
    highestExpressionId = -1;
    addExpression(addIds = true);
});

document.getElementById("no").addEventListener("click", () => {
    document.getElementById("clear-div").style.display = "none";
    resetListeners();
});

document.getElementById("deg-rad").addEventListener("click", changeDegrees);

document.getElementById("help").addEventListener("click", () => {
    chrome.tabs.create(createProperties = {
        active: true,
        url: "help.html"
    });
});

document.getElementById("website").addEventListener("click", () => {
    chrome.tabs.create(createProperties = {
        active: true,
        url: "https://stardust1689.github.io/Personal-Website/"
    });
});

document.getElementById("github").addEventListener("click", () => {
    chrome.tabs.create(createProperties = {
        active: true,
        url: "https://github.com/stardust1689"
    });
});

let expressions = [];
let activeIndex = 0;
let onDegrees = false;
let degreeAdjustment = 1;
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