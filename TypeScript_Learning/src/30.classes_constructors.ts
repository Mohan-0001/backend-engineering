class UserN15 {
  id: string;
  name: string;
  email?: string; // Optional property (can be undefined)
  createdAt: Date = new Date(); // Initialized at declaration (automatically set for all instances)

  constructor(id: string, name: string, email?: string) {
    // Assigning values to all required fields to satisfy TypeScript's strict initialization checks
    this.id = id;
    this.name = name;
    
    // Only assign email if a value is explicitly passed, otherwise it remains undefined
    if (email) {
      this.email = email;
    }
  }
}

// Creating instances
const result4 = new UserN15("1", "mohan"); // email is omitted -> result4.email is undefined
const result5 = new UserN15("2", "vanshi", "xyz@gmail.com"); // email is provided


// class Bad {
//   a: string; 

//   // ERROR: Property 'a' has no initializer and is not definitely assigned in the constructor.
//   // In strict mode, TypeScript requires class properties to be initialized 
//   // either at the declaration line or inside the constructor function.
//   constructor() {
//     // To fix this, you must assign a value here: this.a = "some string";
//   }
// }
