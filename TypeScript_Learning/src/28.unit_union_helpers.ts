// ==========================================
// 1. Exclude<T, U>
// Removes from T those types that are assignable to U (built for union types)
// ==========================================
type EventType1 = "click" | "submit" | "hover" | "keydown" | "keyup";
type EventType2 = Exclude<EventType1, "keydown">;  // Result: "click" | "submit" | "hover" | "keyup"

function handleEvent1(e: EventType2) {
    console.log(e);
}

handleEvent1("click"); // Valid
// handleEvent1("keydown"); // Error: "keydown" was excluded from EventType2


// ==========================================
// 2. Extract<T, U>
// Keeps only the parts of T that are assignable to U (filters out everything else)
// ==========================================
type ActionsN1 = "create" | "update" | "delete" | "read";
type ActionsN2 = Extract<ActionsN1, "create" | "update" | "delete">; // Result: "create" | "update" | "delete"

function handleEvent2(e: ActionsN2) {
    console.log(e);
}

handleEvent2("create"); // Valid
// handleEvent2("read"); // Error: "read" was not extracted into ActionsN2


// ==========================================
// 3. NonNullable<T>
// Strips away null and undefined from a union type, leaving only valid types
// ==========================================
type MayBeNumber = number | null | undefined;
type CleanNumber = NonNullable<MayBeNumber>; // Result: number

function square(num: CleanNumber) {
    return num * 2;
}

square(23); // Valid
// square(null); // Error: null and undefined are stripped out of CleanNumber