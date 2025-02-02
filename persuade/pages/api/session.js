export const dynamic = "force-dynamic"; // Ensures fresh API responses

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        console.log("Fetching ephemeral key from OpenAI...");

        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-realtime-preview-2024-12-17",
                voice: "alloy",
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenAI API Error:", data);
            return res.status(response.status).json({ error: data.error.message });
        }

        console.log("Ephemeral key received:", data);
        return res.status(200).json(data);
    } catch (error) {
        console.error("Failed to fetch ephemeral key:", error);
        return res.status(500).json({ error: "Failed to fetch ephemeral key" });
    }
}
