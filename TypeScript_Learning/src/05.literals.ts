// Literals 
// The type is one exact value, not just a general type
//  you can actually define your own type not just the string 
// the other thing that you not define in the type , cannot be assignable like in below example "ordering" is not assigne to the status type
// Normaly -> let status: string = "success"; here status can contain any string but for status we only want either "success" or "failed" thats where type literals come instead of let status: "success" = "success"; we do

type Status = "success" | "failed";
const status01 : Status = "success";

// eg
type Direction = "left" | "right" | "up" | "down"
function move(D: Direction){
    console.log(D);
}

const d1 = "left";
move(d1)

// here if i do let d1 = "left" and then call move(d1) , it gives error as let can reassign a new value that is not in the Direction type ,that the tsc actually predict 
// thats why either you define the type when using the let using let d1 : Direction = "left" , this restrict you to only assign these 4 values that are define in the type Direction

let d2:Direction = "left";
move(d2);

//  Enum Type Literals -> An enum is a way to define a named set of related constants:
enum Status {
  Success,
  Error,
  Loading
}

let status: Status = Status.Success;