// ============================================================================
// 1. INTERFACE: Best for object shapes & OOP structures
//    - Re-openable: Supports Declaration Merging (multiple declarations merge into one).
//    - Extendable: Uses the 'extends' keyword.
// ============================================================================

interface Box1 {
  width: number;
}

interface Box1 {
  height: number; // Declaration Merging: 'height' is added to 'Box1'
}

// Works perfectly because Box1 now requires both 'width' and 'height'
const boxDemo: Box1 = { width: 10, height: 20 };


// ============================================================================
// 2. TYPE ALIAS: Best for general/complex type definitions & utility types
//    - NOT Re-openable: Cannot be declared again (No Declaration Merging).
//    - Supports Unions (|), Intersections (&), Primitives, Tuples, & Mapped Types.
// ============================================================================

type Bag = { size: number };
// type Bag = { color: string }; 
// ❌ ERROR: Duplicate identifier 'Bag'. Type aliases cannot be reopened/redeclared.


/*
==============================================================================
  INTERFACE vs TYPE FEATURE COMPARISON TABLE (What each can/cannot do)
==============================================================================

  Feature                     | Type Alias (`type`) | Interface (`interface`)
  ----------------------------|---------------------|-------------------------
  Declaration Merging        | ❌ Cannot merge     | ✅ Merges automatically
  Unions (`A | B`)            | ✅ Supported        | ❌ Not supported
  Primitives (`type ID = string`)| ✅ Supported     | ❌ Objects only
  Tuples (`[number, string]`) | ✅ Supported        | ❌ Not directly
  Mapped Types (`in keyof`)   | ✅ Supported        | ❌ Not directly
  Object/Class Extension      | ✅ Intersection (`&`)| ✅ Keyword (`extends`)
  Object Shapes              | ✅ Supported        | ✅ Supported
==============================================================================
*/


// ============================================================================
// 3. EXAMPLES OF WHAT YOU CAN DO IN 'TYPE' BUT NOT IN 'INTERFACE'
// ============================================================================

// A. Primitive Aliases (Interface cannot define standalone primitive types)
type UserID = string | number;
type Status3 = "pending" | "approved" | "rejected"; // String Literal Union

// B. Unions & Intersections (Interface cannot represent raw unions directly)
type Circle = { radius: number };
type Square = { side: number };
type Shape = Circle | Square; // Union Type

type Printable = { print: () => void };
type Auditable = { createdAt: Date };
type Document1 = Printable & Auditable; // Intersection Type

// C. Tuples (Interface cannot cleanly represent fixed-length positional arrays)
type Point2D = [x: number, y: number];
const origin1: Point2D = [0, 0];

// D. Function Types (Type syntax is cleaner for standalone function signatures)
type MathFn = (a: number, b: number) => number;
const add1: MathFn = (a, b) => a + b;


// ============================================================================
// 4. EXAMPLES OF HOW EXTENSION DIFFERS IN BOTH
// ============================================================================

// Interface uses 'extends'
interface Animal {
  name: string;
}

interface Dog extends Animal {
  bark(): void;
}

// Type uses Intersection ('&')
type Vehicle = {
  brand: string;
};

type Car = Vehicle & {
  model: string;
};