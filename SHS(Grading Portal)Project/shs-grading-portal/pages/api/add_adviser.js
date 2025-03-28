import db from '@/lib/db';
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { fullname, email, password, strand, section } = req.body;
    const section_id = section; // `section` is actually `section_id`

    // Validate required fields
    if (!fullname || !email || !password || !strand || !section_id) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if email or fullname exists in `advisers` or `users` tables
        const [[adviserCheck]] = await db.query(
            "SELECT email, fullname FROM advisers WHERE email = ? OR fullname = ? LIMIT 1", 
            [email, fullname]
        );
        const [[userCheck]] = await db.query(
            "SELECT email, fullname FROM users WHERE email = ? OR fullname = ? LIMIT 1", 
            [email, fullname]
        );

        let errorMessages = [];
        if (adviserCheck || userCheck) {
            if ((adviserCheck && adviserCheck.fullname === fullname) || (userCheck && userCheck.fullname === fullname)) {
                errorMessages.push("Full name already exists.");
            }
            if ((adviserCheck && adviserCheck.email === email) || (userCheck && userCheck.email === email)) {
                errorMessages.push("Email already exists.");
            }
            return res.status(409).json({ message: errorMessages.join(" ") });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert adviser into the database
        const result = await db.query(
            "INSERT INTO advisers (fullname, email, password, strand, section_id) VALUES (?, ?, ?, ?, ?)",
            [fullname, email, hashedPassword, strand, section_id]
        );

        return res.status(201).json({ message: "Adviser added successfully!", adviserId: result.insertId });
    } catch (error) {
        console.error("Error adding adviser:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
