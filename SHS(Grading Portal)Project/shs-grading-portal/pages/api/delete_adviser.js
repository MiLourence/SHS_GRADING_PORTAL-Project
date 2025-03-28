import db from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Adviser ID is required." });
  }

  try {
    // Delete adviser by ID
    const [result] = await db.query("DELETE FROM advisers WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Adviser not found." });
    }

    return res.status(200).json({ message: "Adviser deleted successfully." });
  } catch (error) {
    console.error("Error deleting adviser:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
