/**
 * ============================================================================
 * 1. GENERIC CONSTRAINTS (THE 'EXTENDS' KEYWORD)
 * ============================================================================
 * 
 * By default, an unconstrained generic type parameter (like <T>) can be 
 * literally anything (a string, number, boolean, null, etc.). 
 * 
 * Because TypeScript doesn't know what T will be ahead of time, it will block 
 * you from accessing properties or methods on it (e.g., item.length).
 * 
 * Generic constraints solve this by placing a rule or contract on T, promising 
 * the compiler that whatever type is passed in will possess the required shape.
 */

// Define a contract stating: "Whatever type uses this must have a numeric 'length' property."
interface HasLength {
    length: number;
}

// T is constrained: T must extend (inherit/conform to) HasLength
function logLength<T extends HasLength>(item: T): T {
    // TypeScript now allows this because it is guaranteed that 'item' has a .length property
    console.log(item.length);
    return item;
}

// Valid calls: These types natively have a .length property
logLength("hello");                    // String has length
logLength([1, 2, 3]);                  // Array has length
logLength({ length: 10, item: "movies" }); // Custom object explicitly has length

// ❌ Invalid call (uncommenting this would cause a TypeScript compile error):
// logLength(123); // Error: Numbers do not have a length property!


/**
 * ============================================================================
 * 2. ADVANCED KEYOF CONSTRAINTS (KEY VALIDATION)
 * ============================================================================
 * 
 * You can also constrain one generic parameter using another generic parameter.
 * Here, K is constrained to only be a valid key of type T using 'keyof T'.
 */

type UserN6 = {
    id: string;
    name: string;
    age?: number; // Optional property
}

/**
 * userN6Extract extracts a specific column/property from an array of objects.
 * - T: Represents the type of an individual object (e.g., UserN6).
 * - K extends keyof T: Ensures K can ONLY be a real key belonging to T 
 *   (for UserN6, K can only be "id", "name", or "age").
 * - Array<T[K]>: Uses an indexed lookup type to return an array matching the exact type of that property.
 */
function userN6Extract<T, K extends keyof T>(arrN4: T[], keyN4: K): Array<T[K]> {
    return arrN4.map((item) => item[keyN4]);
}

// Sample data: An array of UserN6 objects (properly typed as UserN6[])
const usersN6: UserN6[] = [
    {
        id: '1', name: "mohan", age: 22
    },
    {
        id: "2", name: "sohan" // age is safely omitted because it's optional (?)
    }
]

// SUCCESSFUL EXTRACTION:
// "id" is a valid key of UserN6. TypeScript infers the return type as string[].
console.log(userN6Extract(usersN6, "id"));

// ❌ COMPILE ERROR:
// "address" does not exist on UserN6, so TypeScript stops you before running the code!
// console.log(userN6Extract(usersN6, "address"));