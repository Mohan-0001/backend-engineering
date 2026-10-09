// ============================================================================
// 1. INDEX SIGNATURES (Dynamic Keys with Unknown Names)
//    - Syntax: [key: KeyType]: ValueType
//    - Tells TS: "I don't know the exact key names yet, but any string key 
//      must hold a number value."
// ============================================================================

type NumberDict = {
  [k: string]: number;
};

const counters: NumberDict = {};
counters["Likes"] = 1;      // ✅ Valid: Value is number
counters["Shares"] = 2;     // ✅ Valid: Value is number
// counters["Comments"] = "12"; // ❌ ERROR: Type 'string' is not assignable to type 'number'


// ============================================================================
// 2. RECORD UTILITY TYPE (Strict & Fixed Keys)
//    - Syntax: Record<Keys, ValueType>
//    - Stronger & more type-safe than Index Signature when keys are a known Union.
//    - Mandates that ALL specified keys MUST be provided in the object.
// ============================================================================

type Metrics = Record<"Likes" | "Views" | "Shares", number>;

// Must provide ALL three keys ("Likes", "Views", "Shares") with number values
const mm: Metrics = {
  Likes: 20,
  Views: 40,
  Shares: 300,
};


// ============================================================================
// 3. MAP CLASS (For Dynamic Key-Value Pairs at Runtime)
//    - Syntax: new Map<KeyType, ValueType>()
//    - Preferred over plain JS objects when:
//      a) Keys are frequently added/deleted at runtime.
//      b) Key ordering matters, or non-string keys (objects/functions) are needed.
// ============================================================================

const priceMap = new Map<string, number>();
priceMap.set("likes", 1);


// ============================================================================
// 4. LOOSE DICTIONARIES (Handling Optional / Missing Keys Safely)
//    - Without 'undefined', TS assumes 'lm["missingKey"]' is always a number.
//    - Adding 'undefined' forces you to check if the value exists before using it.
// ============================================================================

type LooseMap = Record<string, number | undefined>;

const lm: LooseMap = {};
lm["x"] = undefined; // ✅ Explicitly setting undefined
lm["y"] = 100;       // ✅ Valid number

// Safe usage with runtime check:
const value = lm["x"]; // Type: number | undefined

if (value !== undefined) {
  // Yahan TypeScript ko confirm pata hai ki 'value' exact 'number' hai!
  console.log(value.toFixed(2)); // ✅ Works perfectly!
}