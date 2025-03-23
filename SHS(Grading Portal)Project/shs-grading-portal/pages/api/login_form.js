import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username/Email and password are required.' });
    }

    try {
        let user;

        // Check in the users table (by username OR email)
        const [usersRows] = await db.query(
            'SELECT * FROM users WHERE username = ? OR email = ?', 
            [username, username]
        );

        if (usersRows.length > 0) {
            user = usersRows[0];
        } else {
            // Check in the advisers table (email only)
            const [advisersRows] = await db.query(
                'SELECT * FROM advisers WHERE email = ?', 
                [username]
            );
            if (advisersRows.length > 0) {
                user = advisersRows[0];
                user.usertype = 'adviser'; // Manually set usertype for advisers
            }
        }

        // If no user found
        if (!user) {
            return res.status(401).json({ error: 'Invalid username/email or password.' });
        }

        // Validate password
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid username/email or password.' });
        }

        // Determine the dashboard route
        let dashboardRoute = '/StudentDashboard';
        if (user.usertype === 'admin') {
            dashboardRoute = '/AdminDashboard';
        } else if (user.usertype === 'adviser') {
            dashboardRoute = '/AdviserDashboard';
        }

        // Send response with user type
return res.status(200).json({
    message: 'Login successful',
    fullname: user.fullname,
    usertype: user.usertype,  // Ensure user type is returned
    dashboardRoute
});

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
