class Temperature {
    // Private JavaScript field (# prefix) to store the raw temperature value in Celsius securely.
    // It cannot be accessed or modified directly from outside the class.
    #c = 0;

    // Constructor runs automatically when a new Temperature object is created.
    // Notice it assigns to 'this.celsius' (the setter) instead of '#c' directly, 
    // ensuring the initial value goes through our validation check.
    constructor(celsius: number) {
        this.celsius = celsius;
    }

    // --- CELSIUS GETTER & SETTER ---

    // Getter: Allows code outside the class to READ the Celsius value naturally (e.g., console.log(t.celsius)).
    get celsius(): number {
        return this.#c;
    }

    // Setter: Intercepts assignments to 't.celsius' (e.g., t.celsius = 30).
    // It validates that the input is a real number before safely saving it into the private '#c' field.
    set celsius(value: number) {
        if (Number.isNaN(value)) {
            throw new Error("Not a number! Please provide a valid number.");
        }
        this.#c = value;
    }

    // --- FAHRENHEIT COMPUTED GETTER & SETTER ---

    // Computed Getter: Calculates and returns the Fahrenheit value on-the-fly 
    // based on the current Celsius value stored in '#c'. No separate storage is needed!
    get fahrenheit(): number {
        return (this.#c * 9) / 5 + 32;
    }

    // Setter: Allows you to assign a Fahrenheit temperature directly (e.g., t.fahrenheit = 232).
    // Behind the scenes, it converts that Fahrenheit value into Celsius and hands it 
    // over to the Celsius setter to be validated and saved.
    set fahrenheit(f: number) {
        this.celsius = ((f - 32) * 5) / 9;
    }
}

// --- USAGE EXAMPLE ---

// 1. Create a new Temperature instance initialized to 25°C.
//    (The constructor passes 25 through the celsius setter, so #c becomes 25).
const t = new Temperature(25);

// 2. Assign a Fahrenheit value. 
//    This triggers the fahrenheit setter, which converts 232°F (~111.11°C) 
//    and updates the internal private #c field safely.
t.fahrenheit = 232;