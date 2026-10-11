// 1. Public properties are the default and can be accessed from anywhere (inside or outside the class).
// 2. Private properties (using the TS 'private' keyword or JS '#' private fields) cannot be accessed outside the class.

class BankAccount {
    // Public property: accessible anywhere
    public owner: string;  

    // TypeScript private property: enforced at compile-time (hidden outside the class)
    private balance = 0;  

    // ECMAScript/JavaScript private field: enforced at runtime (true private privacy in JS)
    #otp = 12345;   

    constructor(owner: string) {
        this.owner = owner;
    }

    // Public method to deposit money
    deposit(amt: number) {
        if (amt < 0) throw new Error('Amount must be positive');
        this.balance += amt;
    }

    // Public method to get the private balance safely
    getBalance() {
        return this.balance;
    }

    // Public method to verify OTP using the private field internally
    verifyOtp(code: number) {
        return this.#otp === code; // Only accessible inside the class
    }
}

const acc = new BankAccount("Mohan");
acc.deposit(5000);
console.log(acc.verifyOtp(12345)); // Works: called from inside the class logic
console.log(acc.getBalance());     // Works: accessing via a public getter method

// --- Error Examples ---
// The following lines will throw errors because they attempt 
// to access private/hidden properties directly from outside the class:

// acc.balance; // Error: 'balance' is private and only accessible within class 'BankAccount'.
// acc.#otp;    // Error: Property '#otp' is not accessible outside class 'BankAccount' because it has a private identifier.