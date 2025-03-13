import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, req) => {
    const isAuth = !!auth;
    const path = req.nextUrl.pathname;

    if (!isAuth && path !== "/welcome-page") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (isAuth && path === "/") {
        return NextResponse.redirect(new URL("/welcome-page", req.url));
    }
});

export const config = {
    matcher: [
        // Exclude static assets and specific public routes (update as needed)
        '/((?!_next|home|about-us|pricing|api/user-count\\.js).*)',
        '/(api|trpc)(.*)',
    ],
};