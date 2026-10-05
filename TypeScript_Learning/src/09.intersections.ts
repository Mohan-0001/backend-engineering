//  Intersections
//  Intersection means: combine multiple types together.

type Inter1 = {id: string};
type Inter2 = { createdAt : Date}

type Entity = Inter1 & Inter2; // must have both id and createdAt

const e: Entity = { id: "i23d", createdAt: new Date()};


type NumberHolderUnique = {a: number};
type StringHolderUnique = {a: string};

type NumberStringMix = NumberHolderUnique & StringHolderUnique;

// const obj : NumberStringMix = { 1, "A","2" } // as any value at a time cannot be number and string so it gives error


type Product = { id: string, title: string };
type Priced = { price: number }

type PricedProduct = Product & Priced;
// here intersection is used to add extra feilds or i can say to extend the types of one
const priceProduct : PricedProduct = { id: "234", title: "Dillage", price:123}