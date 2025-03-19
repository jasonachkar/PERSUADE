import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, req) => {
    const isAuth = !!auth;
    const path = req.nextUrl.pathname;

    if (!isAuth && path !== "/welcome-page" && !path.match(/^\/(home|about-us|api\/user-count|api\/create-checkout-session)/)) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (isAuth && path === "/") {
        return NextResponse.redirect(new URL("/welcome-page", req.url));
    }
});

export const config = {
    matcher: [
        "/((?!.+\\.[\\w]+$|_next).*)",
        "/(api|trpc)(.*)"
    ]
};