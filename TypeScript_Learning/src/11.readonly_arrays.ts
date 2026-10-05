//ways of wirting readonly arrays

//  1.  with readonly keyword
const ys : readonly number[] = [1,2,3];
// ys.push(1);  // this command will not run as ys is a readonly array(immutable) and cannot be updated later

//  2.  with Generic readonlyArray 
const yss : ReadonlyArray<number> = [1,2,3,4];



let xss = [1,2,3,4];

function sum(nums: readonly number[]) : number {
    let s = 0;
    for(const n of nums) s+= n;
    return s;
}

console.log(sum(xss)); // here passing mutable array in readonly param is allowed

// pure work is in the xss as when it is declare then type is number[] , now when we pass it as an argument then this array type is convert to readonly number[] now inside this function you cannot do -> nums.push(2) as the nums(xss) is now readonly

