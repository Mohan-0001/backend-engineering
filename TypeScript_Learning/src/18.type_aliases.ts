// Define a type alias for an object shape (similar to an interface)
type Person1 = {
  id: string;
  address: string;
  salary: number;
};

// Create a variable of type 'Person1' and assign an object matching that shape
const person1: Person1 = {
  id: "1",
  address: "address",
  salary: 12345,
};

// Define a union type allowing only specific string literal values
type Status1 = "new" | "paid" | "pending";

// Function that accepts a 'Status1' union type and returns a corresponding string
function nextActionCheck(s: Status1): string {
  switch (s) {
    case "new":
      return "new";
    case "paid":
      return "paid";
    case "pending":
      return "pending";
    default:
      return "default";
  }
}

// Define individual object types to merge later
type ToMerge1 = { price: number };
type ToMerge2 = { stock: number };

// Create an intersection type combining Person1, ToMerge1, and ToMerge2
// An object of this type must contain properties from all three types
type MergedProductInfo = Person1 & ToMerge1 & ToMerge2;
