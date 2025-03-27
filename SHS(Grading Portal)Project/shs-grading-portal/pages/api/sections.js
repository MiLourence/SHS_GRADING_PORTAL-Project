import db from '@/lib/db';

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const [sections] = await db.query("SELECT id, name FROM sections");
            res.status(200).json(sections);
        } catch (error) {
            res.status(500).json({ message: "Error fetching sections" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
