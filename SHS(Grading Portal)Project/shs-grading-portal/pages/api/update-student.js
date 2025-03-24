import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { fullname, username, password, email, grade, strand, section, sex, date_of_birth, address } = req.body;

    // Check if student exists
    const [rows] = await pool.query("SELECT password FROM users WHERE username = ?", [username]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    let hashedPassword = rows[0].password;

    // If the password is provided, hash the new one
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update student details
    const [updateResult] = await pool.query(
      "UPDATE users SET fullname = ?, password = ?, email = ?, grade = ?, strand = ?, section = ?, sex = ?, date_of_birth = ?, address = ? WHERE username = ?",
      [fullname, hashedPassword, email, grade, strand, section, sex, date_of_birth, address, username]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ message: "No changes made" });
    }

    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
