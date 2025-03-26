import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id, fullname, username, password, email, grade, strand, section, sex, phone_number, date_of_birth, address } = req.body;

    // Fetch current student details
    const [rows] = await pool.query("SELECT id, password FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    let hashedPassword = rows[0].password; // Keep the existing password
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10); // Hash new password
    }

    // Check for duplicate username/email (excluding current student)
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?",
      [username, email, id]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Username or Email is already taken" });
    }

    // ✅ Update student details
    const [updateResult] = await pool.query(
      `UPDATE users 
       SET fullname = ?, username = ?, password = ?, email = ?, grade = ?, strand = ?, section = ?, sex = ?, phone_number = ?, date_of_birth = ?, address = ? 
       WHERE id = ?`,
      [fullname, username, hashedPassword, email, grade, strand, section, sex, phone_number, date_of_birth, address, id]
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
