// pages/api/user-count.js
import { clerkClient } from '@clerk/nextjs/server';

export default async function handler(req, res) {
    try {
        // Fetch the list of users (by default, this will return up to 100 users)
        const users = await clerkClient.users.getUserList();

        // Count the number of users
        const userCount = users.length;

        res.status(200).json({ count: userCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get user count' });
    }
}
