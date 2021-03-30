let expressions = [];

const calculate = expression => {
    let exp = expression.slice();
    while (exp.length > 1) {        

        while (exp.includes("**")) {
            let index = exp.indexOf("**");
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

let exp2 = [1, "-", 3, "*", 2, "/", 3, "-", 1, "+", 2, "*", 2, "-", 2, "+",1, "*",3, "*", 3, "+", 1, "-", 1, "**", 2]
// let exp2 = [1, "-", 3]

// ***/-+++