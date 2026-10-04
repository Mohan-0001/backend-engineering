// type -> The type keyword creates a Type Alias—a custom name for any shape of data or type configuration you want to reuse
// Once it is created you cannot chanage this(type alias);

// Object Shapes: Defining exactly what properties an object must contain

type User = {
  id: number, 
  username: string
  email? : string  // optional could be absent  // "exactOptionalPropertyTypes": true,
  readonly created: Date
}

// here '?' means the feild could be absent but if present then it cannot be other than string 
// eg 
const user1 : User = {id: 134981398193, username: "Mohan", created: new Date()};  // email feild is not their

// readonly means once you created this field as readonly then you only assign once , cannot reassign or change that feild
// eg
// user1.created = new Date();



//Index Signature
// Index Signature = "I don't know the property names beforehand, but I know their types."
// I don't know the keys beforehand, but every key must be a string and every value must be a number
type User2 = {[key: string]: number};

const user2 : User2 = {"Mohan":1, "Sohan": 2};



// Record (TypeScript Utility Types)
// in ts their are some utility types and one of it is Record
// it's used to construct a strongly typed object mapping a specific set of keys to a uniform value type
// eg 
type User3 = Record<"likes" | "shares" | 'subscribe', number>;
const user3 : User3 = { "likes": 1, "subscribe": 20, "shares": 10 }
// it is destructure to 
// type User3 = {
//   "likes": number,
//   "shares": number,
//   "subscribe": number,
// }

// in this each key is required , no one is optional and all values are same to one (number)



// Optional -> another utility type and is used to construct a new type where all properties of the original type are made optional
// // Equivalent to making every single field optional (e.g., username?: string)
// it is as same as "?" means is absent nothing , but if present then need to be that type pecific
// eg 
type User4 = Partial<User2>
const user4: User4 = {}
const user01 : User4 = {"mOHAN": 134}
// but cannot 
// const user02 : User4 = {123: "mohan"}

