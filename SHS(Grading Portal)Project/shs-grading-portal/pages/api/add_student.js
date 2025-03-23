import db from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { fullname, email, username, password, sex, grade, strand, section } = req.body;

        // Ensure all required fields are provided
        if (!fullname || !email || !username || !password || !sex || !grade || !strand || !section) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const query = `
            INSERT INTO users (fullname, email, username, password, sex, grade, strand, section, usertype, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'user', 'active')
        `;

        await db.execute(query, [fullname, email, username, password, sex, grade, strand, section]);

        return res.status(200).json({ message: 'Student added successfully' });
    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}