import db from "@/lib/db";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const [sections] = await db.query("SELECT id, name FROM sections");
            res.status(200).json(sections);
        } catch (error) {
            res.status(500).json({ message: "Error fetching sections" });
        }
    } else if (req.method === "DELETE") {
        try {
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ message: "Section ID is required" });
            }

            // Delete the section
            const query = "DELETE FROM sections WHERE id = ?";
            await db.execute(query, [id]);

            return res.status(200).json({ message: "Section deleted successfully" });
        } catch (error) {
            console.error("Error deleting section:", error);
            return res.status(500).json({ message: "Error deleting section" });
        }
    } else {
        res.setHeader("Allow", ["GET", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}