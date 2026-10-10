
type UserN7 = {
    id: string,
    name: string,
    email? : string
}

function getUserN7<T , K extends keyof T>(objN7:T , keyN7: K) : T[K] {
    return objN7[keyN7]
}

const userN7 : UserN7 = {
    id:'7' , name: "Mohan"
}

const idValN7 = getUserN7(userN7, "id");

//here we are updating the feilds in the object with generiic definition
// 1. K is restricted to valid keys of T ("id" | "name" | "email"), and newVal is strictly typed as T[K] to match the property's exact type.
function setUserPropN7<T, K extends keyof T>(
    objN7: T, keyN7: K, newVal: T[K]
): void {
    // 2. Direct mutation overwrites the existing property value inside the passed object reference in memory.
    objN7[keyN7] = newVal;
}

// 3. TypeScript ensures that the new value ("123") matches the expected type of the "id" property (string).
setUserPropN7(userN7, "id", "123");