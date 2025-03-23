import db from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const [students] = await db.execute(
            "SELECT id, fullname, username, email, grade, strand, section, sex FROM users WHERE usertype = 'user'"
        );
        res.status(200).json(students);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
