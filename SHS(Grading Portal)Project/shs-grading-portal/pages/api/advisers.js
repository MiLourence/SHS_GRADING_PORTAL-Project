import db from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const [advisers] = await db.execute(`
            SELECT advisers.id, advisers.fullname, advisers.email, advisers.strand, 
                   COALESCE(sections.name, 'No Section') AS section
            FROM advisers
            LEFT JOIN sections ON advisers.section_id = sections.id
        `);
        res.status(200).json(advisers);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
