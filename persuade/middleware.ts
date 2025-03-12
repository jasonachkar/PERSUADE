import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
    matcher: [
        // Exclude static assets and specific public routes (update as needed)
        '/((?!_next|home|about-us|pricing|api/user-count\\.js).*)',
        '/(api|trpc)(.*)',
    ],
};