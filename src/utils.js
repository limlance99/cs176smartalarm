const add = (num1, num2) => num1 + num2;

const sub = (num1, num2) => num1 - num2;

const mult = (num1, num2) => num1 * num2;

const operators = [
    { func: add, text: "+"},
    { func: sub, text: "-"},
    { func: mult, text: "x"},
]

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

const createEasyQuestion = function() {
    var op = getRandomInt(0,3);
    var num1 = getRandomInt(1,11);
    var num2 = getRandomInt(1,11);
    
    var question = `${num1} ${operators[op].text} ${num2} = ?`
    var answer = operators[op].func(num1, num2);

    return {question, answer};
}

const createMediumQuestion = function() {
    var op = getRandomInt(0,3);
    var num1 = getRandomInt(1,21);
    var num2 = getRandomInt(1,21);
    
    var question = `${num1} ${operators[op].text} ${num2} = ?`
    var answer = operators[op].func(num1, num2);


    return {question, answer};
}

const createHardQuestion = function() {
    var op = getRandomInt(0,3);
    var num1 = getRandomInt(1,101);
    var num2 = getRandomInt(1,101);
    
    var question = `${num1} ${operators[op].text} ${num2} = ?`
    var answer = operators[op].func(num1, num2);

    return {question, answer};
}

export const newQuestion = {
    Easy: createEasyQuestion,
    Medium: createMediumQuestion,
    Hard: createHardQuestion,
}