import { NextRequest, NextResponse } from "next/server";

interface ParamsType{
    params: {
        id:number
    }
}

export async function GET(request: NextRequest, {params}: ParamsType){
    const { id } = await params;
    console.log(id)
    return NextResponse.json({
        postId: id
    })
}   