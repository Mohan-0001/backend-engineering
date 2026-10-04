// as const 
// as const is basically about making TypeScript treat a value as as specific and readonly as possible

//eg
let Roles = ["admin", "user", "superadmin"] as const;
// here if i donot do "as const" the ts let this Roles array as string[] (string array) but we know that the values must never be change as these roles are always be constant and readonly that's why we are using as const 
// it tells hey this array is now -> "readonly ["admin", "user", "superadmin"]"
// means their are exactly 3 values nothing can reassign

type Role = (typeof Roles)[number];

// here (typeof Roles) -> means -> "readonly ["admin", "user", "superadmin"]"
// then [number] makes it index ready then 

function createUser(role: Role) {}

createUser("admin");      // ✅
createUser("user");       // ✅
createUser("superadmin"); // ✅
// createUser("guest");  // this gives error as this is not defined




//If you later add:

// const Roles = ["admin", "user", "superadmin", "moderator"] as const;
// Role automatically becomes:
// "admin" | "user" | "superadmin" | "moderator"