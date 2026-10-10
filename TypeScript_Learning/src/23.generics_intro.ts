/**
 * 1. THE PROBLEM: LOSS OF TYPE SAFETY WITH 'ANY'
 * 
 * An identity function returns whatever value is passed to it.
 * If we use 'any', we lose type tracking entirely.
 */
function echo(arg: any): any {
  return arg;
}

const result = echo("hello"); // Type is 'any', type safety is lost!


/**
 * 2. THE SOLUTION: INTRODUCING GENERICS (<T>)
 * 
 * <T> acts as a type placeholder (a variable for types). 
 * Instead of hardcoding 'any', we tell TypeScript: "Whatever type T 
 * is passed into the argument, the function returns that exact same type T."
 */
function echo1<T>(arg: T): T {
  return arg;
}

// TypeScript automatically infers T based on the argument
const str = echo1("hello"); // Inferred as: string
const num = echo1(42);      // Inferred as: number


/**
 * 3. AUTOMATIC TYPE INFERENCE IN ACTION
 * 
 * You don't always have to pass types explicitly (e.g., echo1<string>("hello")).
 * TypeScript figures out what 'T' is dynamically from the runtime arguments.
 */
function id123<T>(x: T): T {
    return x;
}

id123('Mohan'); // T is inferred as string
id123(123);   // T is inferred as number

const xyzz = id123(5);
// Supports operations or complex returns like arrays while retaining precise types
console.log(xyzz + 1, id123(["mohan"])); 


/**
 * 4. GENERICS WITH ARRAYS
 * 
 * Generics can also wrap or look inside data structures.
 * Here, T represents the type of elements inside the array.
 */
function firstGen<T>(arr: T[]): T | undefined {
    // Returns the first item (type T) or undefined if the array could be empty
    return arr[0];   
}
console.log(firstGen([1, 2, 3])); // T is inferred as number


/**
 * 5. COMPARISON: UNKNOWN VS. GENERICS
 * 
 * - Without generics (using unknown): Loses specific relationship between input and output.
 * - With generics (using T): Preserves exact type linkage.
 *   (x: unknown) => unknown  vs.  (x: T) => T
 */

/**
 * 6. GENERICS IN OBJECT CONTAINERS
 * 
 * You can return generic types wrapped inside custom objects or structures.
 */
function wrap<T>(value: T): { value: T } {
    // The returned object property shares the exact type T of the input
    return { value: value };
}