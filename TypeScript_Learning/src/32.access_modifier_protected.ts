// 'protected' access modifier:
// The property/method is accessible inside the declaring class and its subclasses (child classes),
// but CANNOT be accessed directly from outside instances.

class Animal {
    // Protected property: accessible within 'Animal' and any class that inherits from 'Animal'
    protected energy = 23;

    // Public method to restore energy
    eat(amount: number) {
        this.energy = Math.min(100, this.energy + amount); // Accessible inside the parent class
    }
}

// Subclass (child class) that extends the parent class (Animal)
class Dog extends Animal {
    run() {
        this.energy -= 10; // ✅ Works: 'energy' is protected, so 'Dog' can access and modify it
    }

    status() {
        return this.energy; // ✅ Works: Subclasses can read protected members
    }
}

const d = new Dog();

d.eat(10);   // Works: 'eat' is a public method inherited from 'Animal'
d.run();     // Works: 'run' is a public method on 'Dog'
console.log(d.status()); // Works: returns the current energy level (23 + 10 - 10 = 23)

// --- Error Example ---
// The line below throws a TypeScript error because 'energy' is protected:
// console.log(d.energy); // ❌ Error: Property 'energy' is protected and only accessible within class 'Animal' and its subclasses.