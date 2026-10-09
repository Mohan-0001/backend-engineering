// 1. Rest Parameters (...xs)
// Accepts any number of numeric arguments and groups them into an array 'xs'.
function sumAllNumbers(...xs: number[]): number { 
  return xs.reduce((s, n) => s + n, 0); 
} 
console.log(sumAllNumbers(1, 2, 3, 4)); // Outputs: 10


// 2. Rest Elements in Tuple Types
// Using a labeled tuple [...args] enforces exactly 2 or 3 specific arguments at compile-time.
function makeRange(...args: [start: number, end: number, step?: number]): number[] { 
  // FIX: Destructure 'args' directly. Using '...args' here causes a syntax error.
  const [start, end, steps = 1] = args; 
  const out: number[] = []; 
  
  for (let n = start; n <= end; n += steps) { 
    out.push(n); 
  } 
  return out; 
} 
console.log(makeRange(1, 5));    // Outputs: [1, 2, 3, 4, 5]
console.log(makeRange(1, 5, 3)); // Outputs: [1, 4]
// console.log(makeRange(1));    // Error: Expected 2-3 arguments, but got 1.


// 3. Spreading Dynamic Arrays vs. Fixed Tuples
function draw(x: number, y: number) { 
  console.log(x, y); 
} 

const points =[1,2,3]; 
// draw(...points); 
// Error: A spread argument must either have a tuple type or be passed to a rest parameter.
// Why? 'points' is typed as 'number[]', meaning it could have 0, 5, or 100 elements at runtime.
// 'draw' strictly requires exactly 2 arguments.

const pointsFixed = [10, 20] as const; 
// The 'as const' assertion turns the array into a readonly tuple: readonly.
// TypeScript now guarantees this array has exactly two elements, making it safe to spread.
draw(...pointsFixed); // Outputs: 10 20
