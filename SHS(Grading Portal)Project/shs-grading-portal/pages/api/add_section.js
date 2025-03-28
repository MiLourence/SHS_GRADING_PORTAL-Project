import db from "@/lib/db";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ error: "Section name is required" });
        }

        const query = "INSERT INTO sections (name) VALUES (?)";
        await db.execute(query, [name]);

        return res.status(201).json({ message: "Section added successfully" });
    } catch (error) {
        console.error("Error adding section:", error);
        return res.status(500).json({ error: "Error adding section" });
    }
}
