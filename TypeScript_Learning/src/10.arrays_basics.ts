const all : number[] = [1,2,4];         // T[]
const a22 :  Array<number> = [1,2,3];   // Array<T>

const scores = [10, 20, 30];
scores.push('49');  // It is not possible as scores is an Array<Number> and we are assigning the string in them that's not in type

const mix = [1,"2",3,[1,23]];  // const mix: (string | number | number[])[]
