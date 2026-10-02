// Inference (typically type inference) is the compiler's ability to automatically determine and assign types to variables, expressions, and function return values without requiring you to write explicit type annotations

// It allows you to get full type safety, autocomplete, and error checking while writing cleaner, less verbose code that looks like standard JavaScript


//1. Basic variable initializations
let username = "Alice"; // Inferred as 'string'
let age = 30;           // Inferred as 'number'
let isAdmin = true;     // Inferred as 'boolean'

// TypeScript will throw an error here:
// age = "thirty"; // Error: Type 'string' is not assignable to type 'number'




// 2. Array and Object Literals

let ratings = [1, 2, 3]; // Inferred as number[]

// If elements are mixed, it infers a "Union Type"
let mixed = [1, "two", true]; // Inferred as (string | number | boolean)[]

let product = {
  name: "Laptop",
  price: 999
}; // Inferred as { name: string; price: number; }



// 3. Function Return Types
// You only need to type the parameters; the return type is automatically inferred as 'number'
function add(a: number, b: number) {
  return a + b; 
}
