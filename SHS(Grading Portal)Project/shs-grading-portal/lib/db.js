import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Change if you have a different MySQL username
    password: '', // Change if you have a MySQL password
    database: 'gradingportal',
  });

  export default pool;