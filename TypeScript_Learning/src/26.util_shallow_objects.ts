type Address = {
  line: string;
  city: string;
};

type User01 = {
  id: string;
  name: string;
  email?: string; // Optional field
  address: Address;
};

/* ==========================================================================
   1. Partial<T>
   Makes all properties in type T optional.
   ========================================================================== */

type UserPatch01 = Partial<User01>;
// All properties of User01 are now optional in UserPatch01

const patch1: UserPatch01 = { name: "sangam" };
const patch2: UserPatch01 = {}; // Valid: empty object allowed since all keys are optional

// Error: If a property is present, its value must still conform to its type.
// const patch3: UserPatch01 = { address: {} }; 

const patch4: UserPatch01 = { address: { line: "line 121", city: "Mathura" } };

// Error: TypeScript excess property check prevents unknown/extra properties.
// const patch5: UserPatch01 = { address: { line: "line1", city: "Agra", district: "agra" } }; 


/* ==========================================================================
   2. Required<T>
   Makes all properties in type T required (removes optional flags).
   ========================================================================== */

type UserAllPatch = Required<User01>;

const userAllPatch: UserAllPatch = {
  id: "101",
  name: "Mohan",
  address: { line: "street 2", city: "jhansi" },
  email: "test@gmail.com", // Now mandatory, even though 'email' was optional in User01
};


/* ==========================================================================
   3. Readonly<T>
   Makes all top-level properties read-only (prevents reassignment).
   ========================================================================== */

type ReadOnlyUser = Readonly<User01>;

const readonlyUser: ReadOnlyUser = {
  id: "u1",
  name: "Vanshika",
  address: {
    line: "line 23",
    city: "jhansi",
  },
};

// Error: Cannot assign to 'name' because it is a read-only property.
// readonlyUser.name = "Mohan"; 


/* ==========================================================================
   4. Pick<T, K>
   Constructs a type by picking specific keys K from type T.
   ========================================================================== */

type PublicUser = Pick<User01, "id" | "name">;

const publicUser: PublicUser = { id: "u4", name: "Sahuu" };
// Adding 'email' or 'address' here will raise a type error.


/* ==========================================================================
   5. Omit<T, K>
   Constructs a type by selecting all properties from T and removing keys K.
   ========================================================================== */

type UserWithoutEmail = Omit<User01, "email">;

const omitUser: UserWithoutEmail = {
  id: "u5",
  name: "vanshika sahu",
  address: {
    line: "mauranabad",
    city: "jhansi",
  },
  // 'email' has been removed from the type shape
};


/* ==========================================================================
   6. Record<K, V>
   Constructs an object type whose keys are K and values are V.
   ========================================================================== */

type RoleK = "admin" | "user" | "editor";
type RoleCheck = Record<RoleK, User01>;

const dirN10: RoleCheck = {
  admin: {
    id: "u7",
    name: "Mohan",
    address: {
      line: "main market",
      city: "mathura",
    },
  },
  user: {
    id: "u8",
    name: "Sohan",
    address: {
      line: "main market",
      city: "mathura",
    },
  },
  editor: {
    id: "u9",
    name: "Rohan",
    address: {
      line: "main market",
      city: "mathura",
    },
  },
};