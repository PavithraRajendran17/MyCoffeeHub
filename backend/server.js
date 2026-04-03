const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path'); // Pudhusa add panniyachu

const app = express();
app.use(cors());
app.use(express.json());

// 1. MySQL Connection (Idhu correct-ah irukku!)
const db = mysql.createConnection({
    host: 'mysql-2193fcb4-pavithrapanimalar30-96c9.a.aivencloud.com',
    port: 14781,
    user: 'avnadmin', 
    password: 'AVNS_ityXQbHyo1sN5vb1xFh', 
    database: 'defaultdb',
    ssl: { rejectUnauthorized: false }
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database! ✅');
});

// 2. Frontend Files-ah Connect Panna (STATIC FOLDERS)
// Idhu dhaan unga website-ah live-la kaattum
app.use(express.static(path.join(__dirname, '../frontend')));

// 3. API Routes

// Route to get ALL recipes
app.get('/api/recipes', (req, res) => {
    const sql = "SELECT * FROM recipes";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result); 
    });
});

// Route to get random recipe
app.get('/api/recipe/random', (req, res) => {
    const sql = "SELECT * FROM recipes ORDER BY RAND() LIMIT 1";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result[0]);
    });
});

// 4. Fallback Route: Website-ku poga podhu index.html-ah kaatta
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// 5. Server Start
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
});