/**
 * Interfaces in TypeScript
 * Used to define the structure or blueprint of an object.
 * They act as a named shape that objects must conform to.
 */
interface User333 {
  id: number;                // Required property
  name: string;              // Required property
  email?: string;            // Optional property (indicated by the '?')
  readonly createdAt: Date;  // Read-only property (cannot be reassigned after initialization)
}

// Creating an object that conforms to the User333 interface
const user333: User333 = {
  id: 1,
  name: "mohan",
  createdAt: new Date()      // email is omitted here since it is optional
};


/**
 * Single Inheritance (Extending an Interface)
 * The 'extends' keyword allows one interface to inherit properties from another.
 * Admin333 now contains all properties of User333 plus its own new properties.
 */
interface Admin333 extends User333 {
  permissions: string[];     // Array of strings representing roles/permissions (e.g., ["Admin", "User"])
}

// Creating an object that conforms to the inherited Admin333 interface
const admin333: Admin333 = {
  id: 2,
  name: "Mohan",
  createdAt: new Date(),
  email: "xyz@gmail.com",    // Including the optional email property from User333
  permissions: ["admin"]     // Required property defined in Admin333
};


/**
 * Multiple Inheritance
 * An interface can extend multiple interfaces simultaneously by separating them with commas.
 * AdminWithMeta inherits all properties from both Admin333 (and by extension User333) and WithMeta1.
 */
interface WithMeta1 {
  meta: {
    active: boolean;         // Nested object property
  };
}

// Combining Admin333 and WithMeta1 into a single interface
interface AdminWithMeta extends Admin333, WithMeta1 {}

// Creating an object that must satisfy all combined structural requirements
const adminWithMeta333: AdminWithMeta = {
  // Properties inherited from User333
  id: 3,
  name: "Sohan",
  createdAt: new Date(),
  email: "abc@gmail.com",
  
  // Property inherited from Admin333
  permissions: ["admin"],
  
  // Property inherited from WithMeta1
  meta: {
    active: true
  }
};
