// Unions
// A union means a value can be one of multiple types.
// means values are this OR that 
// eg

let id : number | string;
id = "Mohan";
id = 12;
// id = true  // this gives error as type is boolean that is not in number and string


// Type Narrowing
//eg
function printId(id: string | number) {
    // console.log(id.toUpperCase()) // it gives error as id is also a number and in number their is no operation/property name .toUpperCase() , that's why we need to check first the type then do operation ,-> thisis what called Type Narrowing

    if(typeof id === "string"){
        console.log(id.toUpperCase()); // here no error
    }else{
        id.toFixed(2);
    }
}



// Object Union
type Admin = { role: "Admin", permissions: string[]};
type Customer = { role: "Customer", loyaltyPoints: number};

function describeUser( u : Admin | Customer ){
    // here role is common in both so we can apply check on role part

    if(u.role === "Admin"){
        console.log(u.permissions);
        u.permissions.push("manage_account");
    }else{
        console.log(u.loyaltyPoints);
    }
}


// another way of checking
function describeUserWithInOperator(u: Admin | Customer){
    if("permissions" in u){
        console.log(u.role, " Admin User")
    }else{
        console.log(u.role, " Customer User")
    }
}



// array of union
const arrayOfUnion : (string | number)[] = ["a","b",1, 2] // here it could be string or number in that array

// union of Array
const unionOfArray : string[] | number[] = Math.random() > 0.1 ? ['x',"a"] : [1,2,3];
// here each array must be wither strign array or number array only