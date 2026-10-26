import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    return NextResponse.json({
        name:"Ayush",
        age:30
    })
}

export async function POST(req: NextRequest){
    const {user, age} = await req.json();
    return NextResponse.json({
        user, age
    })
}