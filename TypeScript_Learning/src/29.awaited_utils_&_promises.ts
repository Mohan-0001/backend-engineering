// In TypeScript if a function fetch user data from an API, it does not return the user immediatly , returns a Promise
// The Promise will resolve to the user data once the API call is complete
// eg
async function fetchUserName(userId: string) : Promise<string> {
    // some api calling
    return "Mohan";
}

// Awaited<T>
// When working with complex asynchronous code (especially nested async functions, APIs, or async/await chains), you often get a Promise inside a Promise inside a Promise, and you want to extract the final underlying value.
// This is where Awaited<T> comes in. It recursively "unwraps" a Promise to give you the actual value it resolves to.
type PromisedString = Promise<string>

type ResolvedString = Awaited<PromisedString>; /// type -> sting

// real word usecase
// An API function that returns a complex object wrapped in a Promise
async function fetchUserProfile() {
    return {
        id: 1,
        name: "Mohan",
        role: "Developer"
    };
}

// Without Awaited, typeof fetchUserProfile gives you: 
// () => Promise<{ id: number; name: string; role: string; }>

// With Awaited and ReturnType combined, you can extract the exact resolved data shape:
type UserProfile = Awaited<ReturnType<typeof fetchUserProfile>>;
// Result type: { id: number; name: string; role: string; }


//// ==========================================
// 1. Basic Promise
// ==========================================
const fetchData = async () => ({ status: 200, data: "Success" });

// Extracting the return type using ReturnType + Awaited
type APIResponse = Awaited<ReturnType<typeof fetchData>>;
// Result: { status: number; data: string; }


// ==========================================
// 2. Handling Nested Promises
// ==========================================
type NestedPromise = Promise<Promise<number>>;

// Awaited unwraps all layers of promises
type FinalNumber = Awaited<NestedPromise>;
// Result: number



// ========================================================================================================================
// lets come the real picture , when we use async on any function we tell js ok this is gona to be a asynchronous call so we need to wrap it inside a Promise now come the part the await it tell the js ok i know the return work you can proceed 
// lets first come to promise and await in js then ts
// in js 
// when we declare a function with async(As prefix) we are saying to the js that this function is doing some event loop calling so we need to wrap this function is Promise 
// when calling await inside function then we calling that this api call or request being go to the event loop and once it done we get to notify you(js main thread) till that please halt this function from here and do your work after that function call 
// await helps you to unwrap the api calls layer after layer to at the end give the actual reponse even if you have Promisse inside Promise and so on it till unwrap the apicall  until got to the end 

// in ts
// similar to the js when calling a function using async we are saying that this function will return a Promise of type T -> Promise<T?
// and Awaited<T> similar to that unwrap the Type of the api calling function that we are returning 

type MyPromiseType = Promise<string>;

// Awaited strips away the Promise box
type Unwrapped = Awaited<MyPromiseType>;
// Result: string

async function getData() {
    return Promise.all([
        Promise.resolve(1 as const),
        Promise.resolve("x" as const)
    ] as const)
}

type DataTupleWithPromise = Awaited<ReturnType<typeof getData>>   // [1,"x"];