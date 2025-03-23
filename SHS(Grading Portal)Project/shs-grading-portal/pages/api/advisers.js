import db from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const [advisers] = await db.execute(
            "SELECT id, fullname, email, strand, section FROM advisers"
        );
        res.status(200).json(advisers);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
