// ============================================================================
// 1. DISCRIMINATED UNIONS & 'in' OPERATOR TYPE GUARD
//    - The 'in' operator checks if a property exists on an object.
//    - TypeScript uses this check to narrow down Union types safely inside if-blocks.
// ============================================================================

type InExample1 = { role: "Admin"; permissions: string[] };
type InExample2 = { role: "User"; expiresAt: Date };

type UserExample = InExample1 | InExample2;

function describeUserExample(u: UserExample) {
  // 'in' operator checks if 'permissions' exists in object 'u'
  if ("permissions" in u) {
    // TypeScript automatically narrows 'u' to 'InExample1' inside this block
    return `Admin ${u.permissions.join(",")}`;
  }

  // TypeScript automatically knows 'u' must be 'InExample2' here
  return `User ${u.expiresAt.toISOString()}`;
}

console.log(describeUserExample({ role: "Admin", permissions: ["read"] }));
console.log(describeUserExample({ role: "User", expiresAt: new Date() }));


// ============================================================================
// 2. OPTIONAL CHAINING (?.)
//    - Prevents runtime crash ("Cannot read properties of undefined") when 
//      accessing nested optional properties.
//    - Returns 'undefined' safely if any part of the chain before ?. is null/undefined.
// ============================================================================

type ProfileN3 = {
  name: string;
  contact?: { email?: string }; // Optional nested property
};

const P1N3: ProfileN3 = { name: "Mohan" };
const P2N3: ProfileN3 = { name: "Benstokes", contact: { email: "b3n123@gmail.com" } };

// Without optional chaining: P1N3.contact.email -> Throws Uncaught TypeError!
// With optional chaining: returns undefined safely if 'contact' is missing
const email1N3 = P1N3.contact?.email; // Type: string | undefined (Value: undefined)
const email2N3 = P2N3.contact?.email; // Type: string | undefined (Value: "b3n123@gmail.com")

console.log(email1N3); // undefined
console.log(email2N3); // "b3n123@gmail.com"


// ============================================================================
// 3. NULLISH COALESCING (??) vs OR OPERATOR (||)
//    - Nullish Coalescing (??): Fallback only triggers for 'null' or 'undefined'.
//    - Logical OR (||): Fallback triggers for ANY falsy value (0, "", false, null, undefined, NaN).
// ============================================================================

const countFromServerN3: number | null = 0;
const labelFromServerN3: string | undefined = "";

// Using Nullish Coalescing (??)
const aN3 = countFromServerN3 ?? 100; 
// ✅ Output: 0 (Preserves valid falsy number '0', because it is not null/undefined)

// Using Logical OR (||)
const bN3 = countFromServerN3 || 100; 
// ⚠️ Output: 100 (Replaces '0' with default '100' because 0 is a falsy value in JS)

// String Example with || vs ??
const stringA = labelFromServerN3 ?? "Default Label"; 
// ✅ Output: "" (Preserves empty string "")

const stringB = labelFromServerN3 || "Default Label"; 
// ⚠️ Output: "Default Label" (Replaces "" because empty string is falsy)

console.log(aN3);     // 0
console.log(bN3);     // 100
console.log(stringA); // ""
console.log(stringB); // "Default Label"