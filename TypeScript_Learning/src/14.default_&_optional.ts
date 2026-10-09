// 1. OPTIONAL PARAMETERS WITH MANUAL DEFAULT HANDLING
function greetPersonOptional(name?: string): string { 
  // Without the check, name?.toUpperCase() returns undefined if no argument is passed,
  // resulting in "Hello undefined".
  // The conditional (ternary) operator checks if 'name' exists; if not, it falls back to "Guest".
  const upperRes = name ? name.toUpperCase() : "Guest"; 
  return `Hello ${upperRes}`; 
}

console.log(greetPersonOptional('mohan')); // Output: Hello MOHAN
console.log(greetPersonOptional());        // Output: Hello Guest (Fallback successfully handles missing argument)


// 2. DEFAULT PARAMETERS (Cleaner alternative to the optional parameter check)
// If no value or 'undefined' is passed, TypeScript automatically uses "Guest".
function greetPersonDefault(name: string = "Guest"): string { 
  return `Hello ${name}`; 
}

console.log(greetPersonDefault("Raj")); // Output: Hello Raj
console.log(greetPersonDefault());      // Output: Hello Guest


// 3. MIXED PARAMETERS WITH NULLISH COALESCING (??) fallback
function connect(host: string, port?: number, secure?: boolean) {
  // The Nullish Coalescing operator (??) ensures fallback values apply 
  // only when the argument is strictly null or undefined.
  const p = port ?? 80;     // Defaults to 80 if port is omitted
  const s = secure ?? true;  // Defaults to true if secure is omitted
  
  return `Connect ${host} ${p} ${s}`; 
}

console.log(connect('localhost'));             // Output: Connect localhost 80 true
console.log(connect('localhost', 8080, false)); // Output: Connect localhost 8080 false (false is preserved!)
