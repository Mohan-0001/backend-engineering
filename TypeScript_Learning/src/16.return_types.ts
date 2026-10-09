// Type Inference: TypeScript automatically calculates that multiplying a number returns a 'number'
const doubleFunc = (n: number) => n * 2; 

// Explicit Return Type: Strongly typed for public/exported API clarity, returning a template literal 'string'
export function toTitle(s: string): string { 
  return `Hello ${s}`; 
} 

// Explicit Return Type: Ensures both code paths (if/else) strictly return a 'number'
function booleanToNumber(flag: boolean) : number { 
  if (flag) { 
    return 1; 
  } else { 
    return 0; 
  } 
} 

// Async Inference: Async functions automatically wrap their returned values in a 'Promise'
async function loadCountInfered() { 
  return 42; // TypeScript implicitly infers the return type as Promise<number>
} 

// Consuming the Promise: The '.then' callback correctly receives the unwrapped 'number'
loadCountInfered().then((n) => console.log(n));
