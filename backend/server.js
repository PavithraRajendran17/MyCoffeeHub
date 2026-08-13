const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path'); // Pudhusa add panniyachu

const app = express();
app.use(cors());
app.use(express.json());

// 1. MySQL Connection (Idhu correct-ah irukku!)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
});

// 3. Database connection error check (Improved)
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.message);
        // Error iruntha server start aagum but queries work aagathu. 
        // Adhukku badhula server-ai stop pannidalam.
        process.exit(1); 
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

// 4. Fallback Route
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// 5. Server Start
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
});