// In JavaScript and TypeScript, a primitive is data that is not an object and has no methods. TypeScript mirrors JavaScript's primitives but gives you static compile-time checking for them.

//    The 7 Primitive Types in TypeScript

// 1. string
let message = "Hello, World!"; // Inferred as string
let greeting = `Welcome, ${message}`; // Inferred as string

// 2. number
let count = 42;       // Inferred as number (Integer)
let price = 99.99;    // Inferred as number (Float)
let hex = 0xf00d;     // Inferred as number (Hexadecimal)

// 3. boolean
let isComplete = false; // Inferred as boolean
let hasAccess = (count > 10); // Inferred as boolean


// 4. null 5. undefined
let emptyItem: null = null;
let notDefined: undefined = undefined;


// 6. bigint
const hugeNumber: bigint = 9007199254740991n; // Inferred as bigint


// 7. symbol
let uniqueKey: unique symbol = Symbol("description"); // Inferred as symbol
