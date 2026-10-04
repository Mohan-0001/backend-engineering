// Type Assertion
// it means you are fooling the typescript compiler , hey i know this one's type better than you you just allow this for now and i wan tto use this method 
// eg
let data : unknown = "Mohan";
let user = data as string
console.log(user.toUpperCase());

// here 'data as string' means you are telling the data is now string no other type so treat it as string
// through this you are fooling compiler but in runtime if you assign some other value it must give runtime error



//eg
// 1. Raw JSON string (TypeScript doesn't know its internal structure at compile time)
const raw = '{"id": 1, "name": "A"}';

// 2. Type assertion using 'as' keyword
const riskyUser = JSON.parse(raw) as { id: number; name: string };

// 3. Now TypeScript allows accessing properties without showing any error
console.log(riskyUser.name); // Output: "A"

// 4. Defining custom type for reuse (jo video mein type kar rahe hain)

type User22 = {
  id: number;
  name: string;
};

// 1. Custom Type Guard Function using 'v is User22'
function isUser(v: unknown): v is User22 {
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof (v as any).name === 'string'
  );
}

// 2. Unsafe JSON payload
const raw1 = '{"id": 1, "name": "A"}';
const maybe = JSON.parse(raw1) as unknown;

// 3. Safe narrowing using the guard
if (isUser(maybe)) {
  // Yahan TypeScript ko 100% confirmation mil jaati hai ki 'maybe' ek User22 hai
  console.log(maybe.name); // Safe access: Output "A"
} else {
  console.log("Invalid user structure!");
}