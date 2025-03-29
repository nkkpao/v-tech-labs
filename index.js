const http = require('http');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3000;
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'db',
    database: process.env.DB_NAME || 'usersdb',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

async function initDB() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL
        );
    `);
    console.log("Database initialized");
}

const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET' && req.url === '/users') {
        const users = await pool.query('SELECT * FROM users');
        res.end(JSON.stringify(users.rows));
    } else if (req.method === 'POST' && req.url === '/users') {
        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', async () => {
            const { name, email } = JSON.parse(body);
            const result = await pool.query(
                'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
                [name, email]
            );
            res.end(JSON.stringify(result.rows[0]));
        });
    } else if (req.method === 'GET' && req.url.startsWith('/users/')) {
        const id = req.url.split('/')[2];
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        res.end(JSON.stringify(user.rows[0] || {}));
    } else if (req.method === 'DELETE' && req.url.startsWith('/users/')) {
        const id = req.url.split('/')[2];
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.end(JSON.stringify({ message: 'User deleted' }));
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(PORT, async () => {
    await initDB();
    console.log(`Server is running on port ${PORT}`);
});
