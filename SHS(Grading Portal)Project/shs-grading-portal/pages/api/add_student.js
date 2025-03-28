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
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if fullname, email, or username already exists in users or advisers table
        const [[existingUser]] = await db.query(
            "SELECT fullname, email, username FROM users WHERE fullname = ? OR email = ? OR username = ? LIMIT 1",
            [fullname, email, username]
        );

        const [[existingAdviser]] = await db.query(
            "SELECT fullname, email FROM advisers WHERE fullname = ? OR email = ? LIMIT 1",
            [fullname, email]
        );

        let errorMessages = [];
        if (existingUser || existingAdviser) {
            if ((existingUser && existingUser.fullname === fullname) || (existingAdviser && existingAdviser.fullname === fullname)) {
                errorMessages.push("Full name already exists.");
            }
            if ((existingUser && existingUser.email === email) || (existingAdviser && existingAdviser.email === email)) {
                errorMessages.push("Email already exists.");
            }
            if (existingUser && existingUser.username === username) {
                errorMessages.push("Username already exists.");
            }
            return res.status(409).json({ message: errorMessages.join(" ") });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new student into the database
        const query = `
            INSERT INTO users (fullname, email, username, password, phone_number, sex, grade, strand, section_id, date_of_birth, address, usertype, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'user', 'active')
        `;

        await db.execute(query, [fullname, email, username, hashedPassword, phone_number, sex, grade, strand, section_id, date_of_birth, address]);

        return res.status(201).json({ message: 'Student added successfully!' });
    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
