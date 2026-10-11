// ==========================================
// 1. ReturnType<F>
// Extracts and returns the return type of a function type F
// ==========================================
function getUser() {
    return { id: 1, name: "Mohan", role: "Admin" };
}

// typeof getUser gets the full function type: () => { id: number; name: string; role: string; }
type UserFunction = typeof getUser;

// ReturnType extracts specifically what the function returns
type User02 = ReturnType<typeof getUser>; 
// Result type: { id: number; name: string; role: string; }


// ==========================================
// 2. Parameters<F>
// Extracts the parameter types of a function as a tuple type
// ==========================================
function createUser01(name: string, age: number, isAdmin: boolean): { status: string } {
    return { status: "ok" };
}

// Parameters extracts all parameter types in order: [string, number, boolean]
type CreateUserParams = Parameters<typeof createUser01>;


// ==========================================
// 3. InstanceType<Constructor>
// Extracts the instance type created by a constructor function or class
// ==========================================
class Person {
    name = "Aman";
    constructor(name: string) {
        this.name = name;
    }
}

// InstanceType extracts the type of the object returned when using the 'new' keyword
type PersonInstance = InstanceType<typeof Person>;
const p: PersonInstance = new Person("Mohan");


// ==========================================
// 4. ConstructorParameters<C>
// Extracts the parameter types of a class constructor as a tuple
// ==========================================
class Car11 {
    constructor(public brand: string, public year: number) {}
}

// ConstructorParameters extracts the constructor arguments as a tuple: [string, number]
type CarParams = ConstructorParameters<typeof Car11>;
const myCarArgs: CarParams = ["BMW", 2026];