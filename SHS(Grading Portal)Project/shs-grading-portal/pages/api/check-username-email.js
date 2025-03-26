import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { username, email, studentId } = req.body;

    const [existingUsers] = await pool.query(
      "SELECT id, username, email FROM users WHERE (username = ? OR email = ?) AND id != ?",
      [username, email, studentId]
    );

    let errors = {};
    existingUsers.forEach((user) => {
      if (user.username === username) errors.username = "Username already taken";
      if (user.email === email) errors.email = "Email already taken";
    });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    res.status(200).json({ message: "Username and Email are available" });
  } catch (error) {
    console.error("Check error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
