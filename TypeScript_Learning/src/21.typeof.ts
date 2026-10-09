
function describeTypeOf(x:unknown) {
    if(typeof x === 'string'){
        return 'string'
    }

    if(typeof x === 'number'){
        return 10
    }

    if(typeof x === "boolean"){
        return true
    }

    if(typeof x === "bigint"){
        return "bigint"
    }

    if(typeof x === "symbol"){
        return 'symbol'
    }

    if(typeof x === "undefined"){
        return "undefined"
    }

    if(typeof x=== "function"){
        return () => {

        }
    }

    if(x===null){   // in ts and js the typeof null is always object whats why we are checking the actual value not by 'typeof'
        return null;
    }

    return 'object'
}

console.log(
    describeTypeOf("hi"),
    describeTypeOf(223),
    describeTypeOf(true),
    describeTypeOf(10n),
    describeTypeOf(Symbol("mohan")),
    describeTypeOf(undefined),
    describeTypeOf(() => {}),
    describeTypeOf(null),
    describeTypeOf({})
)




function info(z: unknown) {
    if(Array.isArray(z)){
        return z;
    }

    if(z instanceof Date){
        return new Date();
    }

    if(z instanceof Error){
        return new Error("Something correctly Wrong")
    }

    return 'other'
}

console.log(
    info([1,2,3,4,5]),
    info(new Date()),
    info( new Error('Something went wrong'))
)