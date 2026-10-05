// tuples -> fixed length and fixed types
// A tuple is basically an array where TypeScript knows the exact type and position of each element.
// optional tuple -> (string | number)[]

// eg
const userEntry : [string , number] = ["Mohan",2];
// here ts actually know what is the structure of this array that is one string first then number nothing else and cannot be updated/increased 
// eg -> let user : [string, number] = ["Mohan", "Ram", 123] // this is wrong
// cannot do the number first and string second as in type you strictly define each one positions

// you can do reassign and update the values as per your program 
userEntry[0] = "Sohan";


type ResponseRow = [status: number, message? : string]
const r1 :ResponseRow = [100] // it works
const r2 : ResponseRow = [100 , "Hii"];


// readonly tuple
const r3 : readonly [name : string, message: string, cost: number] = ["Mohan", "Hii Mohan, What's up", 20]
// now in readonly you cannot update any value like below as it is readonly tuple not tuple
// r3[0] = "Sohan";