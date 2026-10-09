// 1. Function Return Type Inference
// TypeScript automatically infers the return type as 'number' by analyzing the return statement.
// Explicitly writing ': number' here is valid but technically redundant.
function func1(a: number, b: number) { 
    return a + b; 
} 

// 2. Contextual Typing (Implicit Contextual Inference)
const nums12 =[1,2,3]; 
// Because 'nums12' is known to be an array of numbers, TypeScript contextually 
// infers that 'n' inside the .map() callback must be a 'number'. You don't need to type it.
const doubled = nums12.map(n => n * 2); 
console.log(doubled); 

// 3. The "Implicit Any" Problem
// Without a surrounding context (like an array method) to provide clues, 
// TypeScript cannot guess the type of 'n', causing it to default to 'any'.
// If 'noImplicitAny' is enabled in tsconfig.json, this will throw a compiler error.
// const times2 = (n) => n * 2; 

// 4. Explicit Type Annotation
// To fix the "implicit any" issue in isolated functions, you must explicitly 
// define the parameter type. TypeScript then automatically infers the return type as 'number'.
const times2 = (n: number) => n * 2; 


type Point = {x: number, y: number}

function distanceFromOrigin (p: Point) : number {
    return Math.hypot(p.x, p.y)
}

console.log(distanceFromOrigin({x:3 , y:2}));