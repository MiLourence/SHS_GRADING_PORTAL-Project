import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { fullname, email, username, password, phone_number, sex, grade, strand, section_id, date_of_birth, address } = req.body;

        // Ensure all fields are provided
        if (![fullname, email, username, password, phone_number, sex, grade, strand, section_id, date_of_birth, address].every(field => field && field.toString().trim() !== "")) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if email or username already exists
        const [existingUsers] = await db.execute("SELECT email, username FROM users WHERE email = ? OR username = ?", [email, username]);

        if (existingUsers.length > 0) {
            const conflictFields = [];
            if (existingUsers.some(user => user.email === email)) conflictFields.push("Email");
            if (existingUsers.some(user => user.username === username)) conflictFields.push("Username");

            return res.status(400).json({ message: `${conflictFields.join(" and ")} already taken.` });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new student into the database
        const query = `
            INSERT INTO users (fullname, email, username, password, phone_number, sex, grade, strand, section_id, date_of_birth, address, usertype, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'user', 'active')
        `;

        await db.execute(query, [fullname, email, username, hashedPassword, phone_number, sex, grade, strand, section_id, date_of_birth, address]);

        return res.status(200).json({ message: 'Student added successfully' });
    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
