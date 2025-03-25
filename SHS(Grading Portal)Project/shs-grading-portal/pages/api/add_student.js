import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { fullname, email, username, password, phone_number, sex, grade, strand, section, date_of_birth, address } = req.body;

        // Ensure all required fields are provided
        if (!fullname || !email || !username || !password || !phone_number || !sex || !grade || !strand || !section || !date_of_birth || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if email already exists
        const [existingEmail] = await db.execute("SELECT email FROM users WHERE email = ?", [email]);
        if (existingEmail.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new student into the database
        const query = `
            INSERT INTO users (fullname, email, username, password, phone_number, sex, grade, strand, section, date_of_birth, address, usertype, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'user', 'active')
        `;

        await db.execute(query, [fullname, email, username, hashedPassword, phone_number, sex, grade, strand, section, date_of_birth, address]);

        return res.status(200).json({ message: 'Student added successfully' });
    } catch (error) {
        console.error('Database Error:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Duplicate entry: Email already exists' });
        }

        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
