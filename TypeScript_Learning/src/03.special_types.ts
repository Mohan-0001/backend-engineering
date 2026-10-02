
// Unions 

// when you need more then one type to work on use this helps to get multiple types 
// it helps you to hold multiple type in one go.
//In real applications, data is often missing at first (like waiting for a database or API response). By adding | undefined, you explicitly tell TypeScript to prepare for that missing state.



// let Name : string | undefined;
// console.log(Name.toLocaleLowerCase())   

// in the above example it gives errot. why? , because in union it only allows you to do operations/methods work only when thoese operations are common on both types if not it gies error 
// in the above as one is string and one is undefined , mostly undefined has no operation so union is nothing thats why you cannot perform any operation

// on the other stage if you declare it with value then the scope is narrow down to that value and now it perform according to that value type

// eg
let Name : string | undefined 
if (Name !== undefined) {
  console.log(Name.toLocaleLowerCase()); // ✅
}

// so you can use this "Narrowing" technique



// void -> Function finishes normally, but returns nothing useful
// ➡️ It runs → finishes → returns undefined.

function printName(name: string): void {
    console.log(name);
}
printName("Mohan");


// never -> Function never finishes normally
// ➡️ It runs → throws error → never returns.

function crash(): never {
    throw new Error("Something went wrong");
}
crash();



// any → "TypeScript, you don't check this."
// any  → "Trust me, don't check this."
let data: any = "Mohan";
console.log(data.foo.doo) // will make a runtime error but tsc do not flag this 



// unknown → "I don't know yet; make me check before using."

let data1: unknown = "Mohan";

// Check the type first before calling string methods:
if (typeof data1 === "string") {
  data1.toUpperCase(); // ✅ Valid! TS knows 'data1' is a string inside this block.
}