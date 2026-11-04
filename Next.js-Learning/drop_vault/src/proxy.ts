import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
    const {pathname} = req.nextUrl;
    const publicRoutes = [
        "/login",
        "/register",
        "/api/auth",
        "/favicon.ico",
        "/_next"
    ];

    if(publicRoutes.some(path => pathname.startsWith(path))){
        return NextResponse.next();
    }

    const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    if(!token){
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
}