import db from '@/lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const [students] = await db.execute(`
                SELECT users.id, users.fullname, users.username, users.email, users.phone_number, 
                       users.grade, users.strand, users.sex, users.date_of_birth, users.address, 
                       COALESCE(sections.name, 'No Section') AS section
                FROM users 
                LEFT JOIN sections ON users.section_id = sections.id 
                WHERE users.usertype = 'user'
            `);
            return res.status(200).json(students);
        } catch (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ message: "Student ID is required" });
            }

            await db.execute("DELETE FROM users WHERE id = ?", [id]);

            return res.status(200).json({ message: "Student deleted successfully" });
        } catch (error) {
            console.error('Error deleting student:', error);
            return res.status(500).json({ message: "Failed to delete student" });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
