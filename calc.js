// calculate(exp) {
//     for item in extension {
//         if item == "**" {
//             replace item and two adacent items (num1 and num2) with num1 ** num2 
//         }
//     }
//     for item in extension {
//         if item == "*" {
//             replace item and two adacent items (num1 and num2) with num1 * num2 
//         }
//         if item == "/" {
//             replace item and two adacent items (num1 and num2) with num1 / num2 
//         }
//     }
//     for item in extension {
//         if item == "+" {
//             replace item and two adacent items (num1 and num2) with num1 + num2 
//         }
//         if item == "-*" {
//             replace item and two adacent items (num1 and num2) with num1 - num2 
//         }
//     }
//     return last item in exp (will be a number)
// }

function calculate(expression) {
    // let exp = expression.slice();
    // console.log(exp);
    // for (item of exp) {
    //     let index = exp.indexOf(item);
    //     if (item === "**") {
    //         let exponent = exp[index - 1]**exp[index + 1];
    //         exp.splice(index-1, 3, exponent);
    //         console.log(exp);
    //     }
    // }
    // for (item of exp) {
    //     let index = exp.indexOf(item);
    //     if (item === "*") {
    //         let product = exp[index - 1] * exp[index + 1];
    //         exp.splice(index-1, 3, product);
    //         console.log(exp);
    //     } else if (item === "/") {
    //         let quotient = exp[index - 1] / exp[index + 1];
    //         exp.splice(index-1, 3, quotient);
    //         console.log(exp);
    //     }
    // }
    // for (item of exp) {
    //     let index = exp.indexOf(item);
    //     if (item === "+") {
    //         let sum = exp[index - 1] + exp[index + 1];
    //         exp.splice(index-1, 3, sum);
    //         console.log(exp);
    //     } else if (item === "-") {
    //         let difference = exp[index - 1] - exp[index + 1];
    //         exp.splice(index-1, 3, difference);
    //         console.log(exp);
    //     }
    // }
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
            else { add = exp[index - 1] / exp[index + 1] }

            exp.splice(index-1, 3, add);
        }
        while (exp.includes("+") || exp.includes("-")) {
            let index = 0;
            if (exp.includes("+") && exp.includes("-")) { index = Math.min(exp.indexOf("+"), exp.indexOf("-")); }
            else if (exp.includes("+")) { index = exp.indexOf("+"); }
            else { index = exp.indexOf("-"); }

            let add = 0;
            if (exp[index] === "+") { add = exp[index - 1] + exp[index + 1] }
            else { add = exp[index - 1] - exp[index + 1] }

            exp.splice(index-1, 3, add);
        }
    }
    return exp[0]
}

let exp2 = [1, "-", 3, "*", 2, "/", 3, "-", 1, "+", 2, "*", 2, "-", 2, "+",1, "*",3, "*", 3, "+", 1, "-", 1, "**", 2]
// let exp2 = [1, "-", 3]

// ***/-+++