const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 1. MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'mysql-2193fcb4-pavithrapanimalar30-96c9.a.aivencloud.com',
    port: process.env.DB_PORT || 14781,
    user: process.env.DB_USER || 'avnadmin', 
    password: process.env.DB_PASSWORD, // <--- Indha maari env variable-ah podanum!
    database: process.env.DB_NAME || 'defaultdb',
    ssl: { rejectUnauthorized: false }
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database! ✅');

    // Automatically create 'recipes' table and insert recipes if empty
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS recipes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            ingredients TEXT,
            steps TEXT,
            image_url VARCHAR(255),
            type VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table: ', err);
            return;
        }
        console.log('Recipes table checked/created successfully! 📋');

        db.query('SELECT COUNT(*) as count FROM recipes', (err, results) => {
            if (err) throw err;
            
            if (results[0].count === 0) {
                const insertQuery = `
                    INSERT INTO recipes (name, ingredients, steps, image_url, type) VALUES 
                    ('South Indian Filter Coffee', 'Coffee powder, Milk, Sugar, Water', '1. Add 3 tsp coffee powder to filter. 2. Pour boiling water and brew 15m. 3. Collect thick decoction. 4. Boil full-fat milk. 5. Mix decoction, milk, and sugar. 6. Froth with Davara.', 'https://images.unsplash.com/photo-1594631252845-29fc4586c552', 'Hot'),
                    ('Dalgona Coffee', 'Instant coffee, Sugar, Hot water, Cold milk', '1. Whisk coffee, sugar, and water. 2. Beat until thick foam. 3. Fill 3/4 glass with cold milk. 4. Add ice cubes. 5. Dollop foam on top. 6. Stir and serve.', 'https://images.unsplash.com/photo-1585515320310-259814833e62', 'Cold'),
                    ('Cappuccino', 'Espresso, Steamed milk, Milk foam', '1. Brew strong espresso. 2. Pour into large cup. 3. Steam milk for foam. 4. Pour milk slowly. 5. Top with thick foam. 6. Sprinkle cocoa on top.', 'https://images.unsplash.com/photo-1534778101976-62847782c213', 'Hot'),
                    ('Americano', 'Espresso, Hot water', '1. Boil fresh water. 2. Brew double espresso. 3. Fill mug with hot water. 4. Add espresso to water. 5. Keep crema intact. 6. Serve black or with sugar.', 'https://images.unsplash.com/photo-1551030173-122aabc4489c', 'Hot'),
                    ('Cafe Latte', 'Espresso, Steamed milk, Thin foam', '1. Prep single espresso shot. 2. Pour into tall mug. 3. Steam milk (200ml). 4. Pour milk over coffee. 5. Add thin foam layer. 6. Try creating latte art.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
                    ('Mocha', 'Espresso, Chocolate syrup, Steamed milk', '1. Add chocolate syrup to cup. 2. Brew espresso over it. 3. Stir to melt chocolate. 4. Add steamed milk. 5. Top with thin foam. 6. Garnish with cream.', 'https://images.unsplash.com/photo-1553909489-cd47e0907980', 'Hot'),
                    ('Flat White', 'Espresso, Microfoam milk', '1. Brew strong espresso. 2. Steam milk to microfoam. 3. Pour milk into espresso. 4. Aim for silky texture. 5. No stiff foam on top. 6. Serve in medium ceramic.', 'https://images.unsplash.com/photo-1520624973347-1904791e8473', 'Hot'),
                    ('Affogato', 'Vanilla gelato, Hot espresso', '1. Chill a dessert bowl. 2. Add vanilla ice cream. 3. Brew hot double espresso. 4. Pour over the ice cream. 5. Let it melt slightly. 6. Serve with a small spoon.', 'https://images.unsplash.com/photo-1592663527359-cf6642f54cff', 'Dessert'),
                    ('Turkish Coffee', 'Finely ground coffee, Water, Cardamom', '1. Add fine grounds to pot. 2. Add water and sugar. 3. Heat until foam rises. 4. Pour foam into cups. 5. Reheat once more. 6. Settle and drink slowly.', 'https://images.unsplash.com/photo-1515693517429-7681f211796d', 'Hot'),
                    ('Irish Coffee', 'Coffee, Whiskey, Sugar, Cream', '1. Warm a glass with water. 2. Mix coffee and whiskey. 3. Add brown sugar. 4. Stir until dissolved. 5. Float thick cream on top. 6. Do not stir the cream.', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e', 'Cocktail'),
                    ('Vietnamese Iced Coffee', 'Coffee, Condensed milk, Ice', '1. Add condensed milk to cup. 2. Set Phin filter on top. 3. Add dark roast coffee. 4. Add hot water to bloom. 5. Let it drip fully. 6. Stir and pour over ice.', 'https://images.unsplash.com/photo-1504630083234-14137512ef08', 'Cold'),
                    ('Cortado', 'Espresso, Warm milk', '1. Brew double espresso shot. 2. Steam equal amount of milk. 3. Pour milk slowly into cup. 4. Maintain 1:1 ratio. 5. Keep foam very thin. 6. Serve in a small glass.', 'https://images.unsplash.com/photo-1533087355953-a4a5dbdc111d', 'Hot'),
                    ('Macchiato', 'Espresso, Foam dollop', '1. Pull a single espresso. 2. Steam a bit of milk. 3. Use a spoon for foam. 4. Place foam on espresso. 5. Keep the "stain" look. 6. Serve in a demitasse.', 'https://images.unsplash.com/photo-1485808191679-5f86510681a2', 'Hot'),
                    ('Frappe', 'Instant coffee, Water, Ice, Sugar', '1. Add instant coffee/sugar. 2. Add water and ice. 3. Shake vigorously. 4. Build a thick foam. 5. Pour into cold glass. 6. Serve with a straw.', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Cold'),
                    ('Nitro Cold Brew', 'Cold brew, Nitrogen gas', '1. Prepare cold brew concentrate. 2. Infuse with nitrogen gas. 3. Use a pressurized tap. 4. Pour into a tall glass. 5. Watch for cascading bubbles. 6. Serve without ice or sugar.', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c', 'Cold'),
                    ('French Press', 'Coarse coffee, Hot water', '1. Place grounds in press. 2. Add hot (not boiling) water. 3. Stir gently once. 4. Steep for 4 minutes. 5. Press the plunger slowly. 6. Pour and drink immediately.', 'https://images.unsplash.com/photo-1442512595331-e89e73853f31', 'Hot'),
                    ('V60 Pour Over', 'Coffee, Hot water', '1. Place filter in V60. 2. Rinse filter with water. 3. Add medium-fine coffee. 4. Pour water in circles. 5. Let it drip through. 6. Enjoy a clean cup.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085', 'Hot'),
                    ('Moka Pot', 'Fine coffee, Water', '1. Fill base with water. 2. Add coffee to basket. 3. Assemble the Moka pot. 4. Heat on low stovetop. 5. Listen for the gurgle. 6. Remove and serve hot.', 'https://images.unsplash.com/photo-1544921670-387ea3be3929', 'Hot'),
                    ('Espresso Tonic', 'Espresso, Tonic water, Ice, Lemon', '1. Fill glass with ice. 2. Add 150ml tonic water. 3. Add lemon/lime slice. 4. Brew espresso separately. 5. Pour espresso over tonic. 6. Watch the layers form.', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Cold'),
                    ('Bulletproof Coffee', 'Coffee, Butter, MCT oil', '1. Brew fresh hot coffee. 2. Add 1 tbsp grass-fed butter. 3. Add 1 tsp MCT/Coconut oil. 4. Put in a high-speed blender. 5. Blend until frothy latte. 6. Drink for high energy.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085', 'Hot')
                `;
                
                db.query(insertQuery, (err, result) => {
                    if (err) throw err;
                    console.log('Default coffee recipes added successfully! ☕✨');
                });
            } else {
                console.log('Recipes already exist in database. Skipping insert.');
            }
        });
    });
});

// 2. Public Folder Connect Pannuthu (Fixed for current structure)
app.use(express.static(path.join(__dirname, 'public')));

// 3. API Routes
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

app.get('/api/recipe/random', (req, res) => {
    const sql = "SELECT * FROM recipes ORDER BY RAND() LIMIT 1";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result[0]);
    });
});

// 4. Fallback Route
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. Server Start
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
});