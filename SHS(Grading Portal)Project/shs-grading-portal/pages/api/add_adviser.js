import db from '@/lib/db';
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { fullname, email, password, strand, section } = req.body;

    // Validate required fields
    if (!fullname || !email || !password || !strand || !section) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if adviser already exists
        const [rows] = await db.query("SELECT * FROM advisers WHERE email = ? LIMIT 1", [email]);

        console.log("Existing Adviser:", rows); // Debugging

        // Ensure rows is an array and check if it contains any results
        if (rows.length > 0) {
            return res.status(409).json({ message: "Email already exists." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert adviser into the database
        const result = await db.query(
            "INSERT INTO advisers (fullname, email, password, strand, section) VALUES (?, ?, ?, ?, ?)",
            [fullname, email, hashedPassword, strand, section]
        );

        return res.status(201).json({ message: "Adviser added successfully!", adviserId: result.insertId });
    } catch (error) {
        console.error("Error adding adviser:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
