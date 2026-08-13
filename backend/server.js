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
('Bulletproof Coffee', 'Coffee, Butter, MCT oil', '1. Brew fresh hot coffee. 2. Add 1 tbsp grass-fed butter. 3. Add 1 tsp MCT/Coconut oil. 4. Put in a high-speed blender. 5. Blend until frothy latte. 6. Drink for high energy.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085', 'Hot'),
('Red Eye', 'Drip coffee, 1 shot Espresso', '1. Fill mug with drip coffee. 2. Leave space at top. 3. Pull one espresso shot. 4. Add espresso to coffee. 5. Mix gently once. 6. Drink for extra caffeine.', 'https://images.unsplash.com/photo-1551030173-122aabc4489c', 'Hot'),
('Black Eye', 'Drip coffee, 2 shots Espresso', '1. Fill mug with drip coffee. 2. Pull two espresso shots. 3. Add both to the mug. 4. Mix with a spoon. 5. Add sugar if needed. 6. Very high caffeine alert.', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Hot'),
('Vienna Coffee', 'Black coffee, Whipped cream', '1. Brew strong black coffee. 2. Pour into a tall cup. 3. Whip heavy cream stiff. 4. Top coffee with cream. 5. Do not mix them. 6. Sip through the cream.', 'https://images.unsplash.com/photo-1515693517429-7681f211796d', 'Hot'),
('Mazagran', 'Coffee, Lemon, Sugar, Ice', '1. Brew strong coffee. 2. Mix with lemon and sugar. 3. Shake with plenty of ice. 4. Strain into a tall glass. 5. Add a lemon garnish. 6. Perfect for summer days.', 'https://images.unsplash.com/photo-1504630083234-14137512ef08', 'Cold'),
('Eiskaffee', 'Cold coffee, Ice cream, Cream', '1. Brew coffee and chill. 2. Place ice cream in glass. 3. Pour chilled coffee over. 4. Add whipped cream top. 5. Sprinkle chocolate flakes. 6. Serve with a straw/spoon.', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Cold'),
('Espresso Romano', 'Espresso, Lemon slice', '1. Brew a fresh shot of espresso. 2. Cut a thin slice of lemon. 3. Rub the lemon rim on the cup. 4. Drop the slice into the coffee. 5. Add sugar if needed. 6. Serve hot for a citrus kick.', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Hot'),
('Bicerin', 'Espresso, Chocolate, Cream', '1. Prepare thick Italian hot chocolate. 2. Pour it into a small glass. 3. Layer a shot of espresso on top. 4. Gently float cold heavy cream. 5. Do not stir the layers. 6. Sip through the cold cream.', 'https://images.unsplash.com/photo-1553909489-cd47e0907980', 'Hot'),
('Yuanyang', 'Coffee, Black tea, Condensed milk', '1. Brew strong black tea and coffee. 2. Mix them in equal parts. 3. Add 2 tbsp of condensed milk. 4. Stir until creamy and brown. 5. Serve hot or over ice cubes. 6. A classic Hong Kong style treat.', 'https://images.unsplash.com/photo-1504630083234-14137512ef08', 'Mixed'),
('Galão', 'Espresso, Foamed milk', '1. Brew a shot of espresso. 2. Steam milk until very foamy. 3. Use 1 part coffee to 3 parts milk. 4. Pour into a tall glass. 5. Ensure a thick head of foam. 6. Common breakfast drink in Portugal.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Ristretto', 'Espresso, Less water', '1. Use standard amount of grounds. 2. Use only half the usual water. 3. Extract for only 15 seconds. 4. Collect the short, intense shot. 5. Look for the dark crema. 6. Drink quickly for bold flavor.', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Hot'),
('Lungo', 'Espresso, More water', '1. Set up the espresso machine. 2. Use double the water for extraction. 3. Let the pull run for 60 seconds. 4. Collect the thin, bitter coffee. 5. Do not add extra hot water. 6. Enjoy the extra caffeine punch.', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Hot'),
('Espresso con Panna', 'Espresso, Whipped cream', '1. Brew a single or double espresso. 2. Whip heavy cream until very stiff. 3. Dollop the cream onto the coffee. 4. Do not stir the mixture. 5. Let the coffee heat the cream. 6. Serve as a dessert-style coffee.', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Hot'),
('Cafe Bombon', 'Espresso, Condensed milk', '1. Pour condensed milk into a small glass. 2. Gently brew espresso on top. 3. Observe the beautiful clear layers. 4. Stir together just before drinking. 5. Popular in Spanish cafes. 6. Very sweet and satisfying.', 'https://images.unsplash.com/photo-1551030173-122aabc4489c', 'Hot'),
('Dirty Chai Latte', 'Espresso, Chai tea, Milk', '1. Steep chai tea in hot water. 2. Steam milk until frothy. 3. Combine tea and steamed milk. 4. Add a single shot of espresso. 5. Add honey or cinnamon for spice. 6. Perfect blend of tea and coffee.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Caffè Mocha', 'Espresso, Chocolate, Milk', '1. Add 20ml chocolate sauce to mug. 2. Pour in one espresso shot. 3. Stir until well combined. 4. Steam milk to a light froth. 5. Pour milk over the mixture. 6. Garnish with chocolate powder.', 'https://images.unsplash.com/photo-1553909489-cd47e0907980', 'Hot'),
('Peppermint Mocha', 'Espresso, Milk, Chocolate, Peppermint', '1. Mix chocolate and peppermint syrup. 2. Brew espresso and stir well. 3. Steam milk and pour over. 4. Add whipped cream on top. 5. Garnish with crushed candy canes. 6. Seasonal favorite for cold days.', 'https://images.unsplash.com/photo-1553909489-cd47e0907980', 'Hot'),
('Iced Caramel Macchiato', 'Espresso, Milk, Ice, Caramel', '1. Pour vanilla syrup into glass. 2. Add ice and cold milk. 3. Gently pour espresso on top. 4. Do not stir to keep layers. 5. Drizzle caramel sauce heavily. 6. Serve with a straw.', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Cold'),
('Salted Caramel Latte', 'Espresso, Milk, Salt, Caramel', '1. Mix caramel and sea salt. 2. Brew espresso into the syrup. 3. Steam milk and pour slowly. 4. Top with a pinch of salt. 5. Drizzle more caramel on foam. 6. Sweet and salty perfection.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Hazelnut Latte', 'Espresso, Milk, Hazelnut syrup', '1. Add 2 pumps of hazelnut syrup. 2. Brew espresso into the mug. 3. Steam milk to microfoam. 4. Pour milk over the espresso. 5. Add a light dusting of nuts. 6. Enjoy the nutty aroma.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Pumpkin Spice Latte', 'Espresso, Milk, Pumpkin spice', '1. Mix pumpkin puree and spices. 2. Brew espresso and whisk together. 3. Steam milk and pour over. 4. Add whipped cream on top. 5. Sprinkle nutmeg and cinnamon. 6. Classic autumn morning drink.', 'https://images.unsplash.com/photo-1534778101976-62847782c213', 'Hot'),
('Gingerbread Latte', 'Espresso, Milk, Ginger, Molasses', '1. Combine ginger, cinnamon, molasses. 2. Brew espresso into the spices. 3. Steam milk and pour gently. 4. Add whipped cream for texture. 5. Top with a ginger cookie. 6. Spicy and warm festive drink.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('White Chocolate Mocha', 'Espresso, White chocolate, Milk', '1. Melt white chocolate in espresso. 2. Stir until completely smooth. 3. Steam milk and pour over. 4. Top with whipped cream. 5. Add white chocolate shavings. 6. Rich and creamy indulgence.', 'https://images.unsplash.com/photo-1553909489-cd47e0907980', 'Hot'),
('Caffe Breve', 'Espresso, Half-and-half milk', '1. Brew a rich espresso shot. 2. Steam half-and-half instead of milk. 3. Pour gently into the espresso. 4. Aim for an extra creamy feel. 5. Keep foam layer thin. 6. A decadent version of a latte.', 'https://images.unsplash.com/photo-1534778101976-62847782c213', 'Hot'),
('Egg Coffee', 'Espresso, Egg yolk, Condensed milk', '1. Whisk egg yolk and milk until fluffy. 2. Brew strong Vietnamese coffee. 3. Pour coffee into a small glass. 4. Gently spoon egg foam on top. 5. Place glass in hot water bowl. 6. Famous creamy Hanoi specialty.', 'https://images.unsplash.com/photo-1504630083234-14137512ef08', 'Hot'),
('Swedish Egg Coffee', 'Coffee, Raw egg, Water', '1. Mix grounds with a raw egg. 2. Boil water in a large pot. 3. Add the egg-coffee mixture. 4. Simmer for 3 minutes. 5. Add cold water to settle grounds. 6. Result is a crystal clear cup.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085', 'Hot'),
('Black Honey Coffee', 'Coffee, Honey, Hot water', '1. Brew a clean pour-over coffee. 2. Add 1 tbsp raw organic honey. 3. Stir until honey is dissolved. 4. Add a pinch of sea salt. 5. Serve black to taste honey. 6. Natural sweetness and energy.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085', 'Hot'),
('Matcha Coffee', 'Espresso, Matcha, Milk', '1. Whisk matcha powder with water. 2. Pour matcha into a tall glass. 3. Add ice and cold milk. 4. Gently pour espresso on top. 5. Observe the green-brown layers. 6. Earthy and energizing blend.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Mixed'),
('Toffee Nut Latte', 'Espresso, Toffee syrup, Milk', '1. Add toffee syrup to a mug. 2. Brew espresso and stir. 3. Steam milk for a smooth foam. 4. Pour milk into the mixture. 5. Top with whipped cream. 6. Garnish with toffee bits.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Cinnamon Dolce Latte', 'Espresso, Cinnamon, Milk', '1. Mix cinnamon and brown sugar. 2. Brew espresso and whisk. 3. Steam milk until frothy. 4. Pour over the espresso base. 5. Add whipped cream on top. 6. Sprinkle extra cinnamon.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Honey Almondmilk Flat White', 'Espresso, Almond milk, Honey', '1. Brew a double shot espresso. 2. Stir in 1 tbsp of honey. 3. Steam almond milk carefully. 4. Pour milk for a silky texture. 5. Keep the foam layer minimal. 6. Dairy-free nutty delight.', 'https://images.unsplash.com/photo-1520624973347-1904791e8473', 'Hot'),
('Oatmilk Honey Latte', 'Espresso, Oat milk, Honey', '1. Add honey to a large mug. 2. Brew hot espresso over honey. 3. Steam oat milk for microfoam. 4. Pour milk gently into mug. 5. Garnish with toasted oats. 6. Creamy and eco-friendly drink.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Iced Vanilla Latte', 'Espresso, Vanilla, Ice, Milk', '1. Put vanilla syrup in glass. 2. Fill glass with ice cubes. 3. Add cold milk (3/4th full). 4. Pour fresh espresso shots. 5. Stir well with a spoon. 6. Refreshing and sweet.', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Cold'),
('Iced Caffè Mocha', 'Espresso, Chocolate, Ice, Milk', '1. Mix espresso and chocolate sauce. 2. Fill a glass with ice. 3. Pour chocolate-coffee mix over. 4. Add cold milk and stir. 5. Top with whipped cream. 6. Drizzle extra chocolate.', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Cold'),
('Caffè Misto', 'Drip coffee, Steamed milk', '1. Fill mug halfway with coffee. 2. Steam milk to a light froth. 3. Fill meedhi mug with milk. 4. Stir gently to combine. 5. Add a touch of foam. 6. Lighter than a standard latte.', 'https://images.unsplash.com/photo-1534778101976-62847782c213', 'Hot'),
('Dead Eye', 'Drip coffee, 3 shots Espresso', '1. Prepare a mug of drip coffee. 2. Pull three shots of espresso. 3. Add all shots to the coffee. 4. Warning: extremely high caffeine. 5. Sip very slowly. 6. Not for the faint-hearted.', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Hot'),
('Lazy Eye', 'Decaf coffee, 2 shots Espresso', '1. Brew a mug of decaf coffee. 2. Pull two shots of espresso. 3. Mix espresso into the decaf. 4. Best of both worlds flavor. 5. Moderate caffeine kick. 6. Serve hot and fresh.', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Hot'),
('Cortadito', 'Espresso, Condensed milk', '1. Brew a double espresso. 2. Add 1 tsp condensed milk. 3. Steam a little whole milk. 4. Mix espresso and condensed milk. 5. Top with the steamed milk. 6. Cuban style sweet coffee.', 'https://images.unsplash.com/photo-1533087355953-a4a5dbdc111d', 'Hot'),
('Cafe Zorro', 'Double Espresso, Hot water', '1. Brew a double shot espresso. 2. Add equal part hot water (1:1). 3. Keep the crema on top. 4. Stronger than an Americano. 5. Serve in an espresso cup. 6. Bold and intense flavor.', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Hot'),
('Guillermo', 'Espresso, Lime, Ice', '1. Brew two shots of espresso. 2. Slice a fresh lime into pieces. 3. Place lime in a glass with ice. 4. Pour hot espresso over the lime. 5. Let the flavors mingle. 6. Drink chilled without milk.', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Cold'),
('Espressino', 'Espresso, Cocoa, Milk', '1. Sprinkle cocoa in a glass. 2. Brew espresso on top of it. 3. Steam milk to a light foam. 4. Pour milk into the glass. 5. Sprinkle more cocoa on top. 6. Small but flavorful Italian drink.', 'https://images.unsplash.com/photo-1485808191679-5f86510681a2', 'Hot'),
('Belmonte', 'Espresso, Condensed milk, Brandy', '1. Add condensed milk to glass. 2. Pour espresso on top. 3. Add a splash of Brandy. 4. Do not stir initially. 5. Enjoy the alcoholic kick. 6. Popular in Spanish regions.', 'https://images.unsplash.com/photo-1551030173-122aabc4489c', 'Cocktail'),
('Cafe de Olla', 'Coffee, Cinnamon, Piloncillo', '1. Boil water with cinnamon sticks. 2. Add Mexican dark sugar (Piloncillo). 3. Stir until sugar is dissolved. 4. Add medium-coarse grounds. 5. Steep for 5 minutes in pot. 6. Strain and serve in clay cups.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085', 'Hot'),
('Pharisäer', 'Coffee, Rum, Whipped cream', '1. Brew strong hot black coffee. 2. Add 2 cubes of sugar. 3. Add a shot of dark rum. 4. Stir until sugar melts. 5. Top with thick whipped cream. 6. German alcoholic specialty.', 'https://images.unsplash.com/photo-1515693517429-7681f211796d', 'Cocktail'),
('Black Russian', 'Coffee, Vodka, Kahlua', '1. Fill a glass with ice. 2. Add 50ml of vodka. 3. Add 20ml of Kahlua/Coffee liqueur. 4. Stir gently for 30 seconds. 5. Garnish with a cherry. 6. Classic coffee-based cocktail.', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e', 'Cocktail'),
('White Russian', 'Coffee, Vodka, Cream', '1. Fill glass with ice cubes. 2. Add vodka and coffee liqueur. 3. Gently pour heavy cream on top. 4. Let it swirl naturally. 5. Stir slightly before drinking. 6. Smooth and creamy cocktail.', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e', 'Cocktail'),
('Espresso Martini', 'Espresso, Vodka, Sugar', '1. Brew fresh espresso and chill. 2. Add ice to a cocktail shaker. 3. Add vodka and coffee liqueur. 4. Shake vigorously for 20 seconds. 5. Strain into a chilled glass. 6. Garnish with 3 coffee beans.', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Cocktail'),
('Cold Brew Soda', 'Cold brew, Soda water, Ice', '1. Fill a tall glass with ice. 2. Pour 100ml cold brew coffee. 3. Top with chilled soda water. 4. Add a slice of orange. 5. Stir gently to combine. 6. Fizzy and refreshing twist.', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c', 'Cold'),
('Dirty Soda Coffee', 'Coffee, Soda, Cream, Lime', '1. Mix coffee and cola together. 2. Add a splash of heavy cream. 3. Squeeze fresh lime juice. 4. Pour over a glass of ice. 5. Stir until it foams up. 6. Unique trendy Utah drink.', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c', 'Cold'),
('Coconut Milk Latte', 'Espresso, Coconut milk', '1. Brew a hot espresso shot. 2. Steam coconut milk until frothy. 3. Pour milk into the espresso. 4. Add a dash of vanilla. 5. Garnish with toasted coconut. 6. Tropical dairy-free latte.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Soy Latte', 'Espresso, Soy milk', '1. Brew espresso into a mug. 2. Steam soy milk until creamy. 3. Pour milk gently over coffee. 4. Maintain a thin foam layer. 5. Add cinnamon if preferred. 6. Classic plant-based option.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Affogato al Cafe', 'Gelato, Espresso, Amaretto', '1. Put vanilla gelato in glass. 2. Add a splash of Amaretto. 3. Brew hot espresso shot. 4. Pour over the ice cream. 5. Top with crushed almonds. 6. Boozy dessert coffee.', 'https://images.unsplash.com/photo-1592663527359-cf6642f54cff', 'Dessert'),
('Carajillo', 'Espresso, Licor 43, Ice', '1. Fill a glass with ice. 2. Pour 50ml of Licor 43. 3. Brew hot espresso separately. 4. Pour espresso over the liqueur. 5. Stir and watch it foam. 6. Popular Mexican after-dinner drink.', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Cocktail'),
('Iced Oatmilk Shaken Espresso', 'Espresso, Oat milk, Brown sugar', '1. Add espresso, sugar, ice to shaker. 2. Shake vigorously for 10 seconds. 3. Strain into a fresh glass of ice. 4. Top with creamy oat milk. 5. Do not stir to keep texture. 6. Trendy and frothy cold drink.', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Cold'),
('Spanish Latte', 'Espresso, Condensed milk, Milk', '1. Mix condensed and fresh milk. 2. Steam the milk mixture. 3. Brew espresso into the mug. 4. Pour the sweet milk over it. 5. Sprinkle with cinnamon powder. 6. Creamier and sweeter than latte.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Thai Iced Coffee', 'Coffee, Spices, Condensed milk', '1. Brew coffee with cardamom. 2. Mix with condensed milk. 3. Fill a tall glass with ice. 4. Pour coffee mixture over ice. 5. Float evaporated milk on top. 6. Sweet and spicy iced drink.', 'https://images.unsplash.com/photo-1504630083234-14137512ef08', 'Cold'),
('Kopi Tubruk', 'Coffee grounds, Sugar, Water', '1. Add fine grounds to a cup. 2. Add plenty of sugar. 3. Pour boiling water directly. 4. Stir well and let it sit. 5. Wait for grounds to sink. 6. Traditional Indonesian method.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085', 'Hot'),
('Kopi Joss', 'Coffee, Burning charcoal', '1. Brew sweet black coffee. 2. Pick up a red-hot charcoal. 3. Drop charcoal into the coffee. 4. Wait for the fizzing to stop. 5. Remove charcoal and drink. 6. Unique charcoal-infused flavor.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085', 'Hot'),
('Ipoh White Coffee', 'Coffee, Margarine, Condensed milk', '1. Roast beans with margarine. 2. Brew a very strong cup. 3. Add condensed milk and stir. 4. Pull the coffee to create foam. 5. Serve hot and frothy. 6. Malaysian specialty drink.', 'https://images.unsplash.com/photo-1504630083234-14137512ef08', 'Hot'),
('Flat Red', 'Espresso, Beetroot, Milk', '1. Extract fresh beetroot juice. 2. Mix juice with an espresso shot. 3. Steam milk to microfoam. 4. Pour milk for a pink latte. 5. Garnish with rose petals. 6. Healthy and colorful coffee.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Blue Latte', 'Espresso, Butterfly pea, Milk', '1. Steep butterfly pea flowers. 2. Mix blue extract with milk. 3. Steam blue milk to foam. 4. Pour over a hot espresso. 5. Watch the purple swirls form. 6. Visually stunning unique drink.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Lavender Latte', 'Espresso, Lavender, Milk', '1. Infuse milk with dried lavender. 2. Strain and steam the milk. 3. Brew espresso and add honey. 4. Pour lavender milk over coffee. 5. Garnish with lavender buds. 6. Calming and floral beverage.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Rose Latte', 'Espresso, Rose syrup, Milk', '1. Add rose syrup to a mug. 2. Brew espresso and mix well. 3. Steam milk and pour gently. 4. Add rose water drop on foam. 5. Sprinkle dried rose petals. 6. Elegant and fragrant latte.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Turmeric Latte Coffee', 'Espresso, Turmeric, Ginger, Milk', '1. Mix turmeric, ginger, pepper. 2. Whisk spices into hot milk. 3. Brew a single shot espresso. 4. Pour spicy milk over coffee. 5. Add honey for sweetness. 6. Anti-inflammatory golden drink.', 'https://images.unsplash.com/photo-1534778101976-62847782c213', 'Hot'),
('Charcoal Latte', 'Espresso, Activated charcoal, Milk', '1. Mix charcoal powder with water. 2. Combine with a shot of espresso. 3. Steam milk and pour over. 4. Create a striking black foam. 5. Garnish with edible silver. 6. Bold black detoxifying coffee.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Tonic Cold Brew', 'Cold brew, Tonic, Rosemary', '1. Fill glass with large ice. 2. Add 120ml tonic water. 3. Slowly pour cold brew on top. 4. Add a sprig of fresh rosemary. 5. Garnish with a grapefruit peel. 6. Sophisticated non-alcoholic drink.', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c', 'Cold'),
('Coffee Lemonade', 'Coffee, Lemon juice, Sparking water', '1. Mix cold brew and lemon juice. 2. Add sugar syrup to taste. 3. Pour over a glass of ice. 4. Top with sparkling water. 5. Garnish with fresh mint. 6. Zesty and bubbly coffee treat.', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c', 'Cold'),
('Banana Milk Coffee', 'Coffee, Banana, Milk', '1. Blend a ripe banana with milk. 2. Pour banana milk into glass. 3. Add ice cubes to the glass. 4. Gently pour espresso on top. 5. Stir slightly to mix flavors. 6. Naturally sweet and creamy.', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Cold'),
('Avocado Coffee', 'Coffee, Avocado, Chocolate', '1. Blend avocado, milk, and ice. 2. Pour into a large tall glass. 3. Drizzle chocolate sauce inside. 4. Pour a shot of espresso on top. 5. Mix for a thick smoothie feel. 6. Popular Indonesian powerhouse.', 'https://images.unsplash.com/photo-1504630083234-14137512ef08', 'Cold'),
('Sea Salt Coffee', 'Coffee, Cream, Sea salt', '1. Brew a hot Americano. 2. Whip cream with sea salt. 3. Float salty cream on coffee. 4. Do not stir the layers. 5. Sip coffee through the cream. 6. Famous Taiwanese trendy drink.', 'https://images.unsplash.com/photo-1485808191679-5f86510681a2', 'Hot'),
('Cheese Coffee', 'Coffee, Cream cheese, Milk', '1. Whip cream cheese and milk. 2. Add a pinch of salt to foam. 3. Brew hot black coffee. 4. Layer cheese foam on top. 5. Drink at a 45-degree angle. 6. Savory and sweet combination.', 'https://images.unsplash.com/photo-1485808191679-5f86510681a2', 'Hot'),
('Butterscotch Latte', 'Espresso, Butterscotch, Milk', '1. Melt butterscotch sauce in mug. 2. Brew espresso and stir well. 3. Steam milk to a light froth. 4. Pour milk over the syrup. 5. Garnish with butterscotch bits. 6. Sweet and buttery flavor.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Smores Latte', 'Espresso, Chocolate, Marshmallows', '1. Line mug with chocolate sauce. 2. Add crushed graham crackers. 3. Pour espresso and steamed milk. 4. Top with mini marshmallows. 5. Toast marshmallows with torch. 6. Campfire in a coffee cup.', 'https://images.unsplash.com/photo-1534778101976-62847782c213', 'Hot'),
('Nutella Latte', 'Espresso, Nutella, Milk', '1. Put 1 tbsp Nutella in a mug. 2. Brew hot espresso over it. 3. Whisk until Nutella melts. 4. Steam milk and pour over. 5. Add whipped cream on top. 6. Ultimate chocolate-hazelnut fix.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Pistachio Latte', 'Espresso, Pistachio sauce, Milk', '1. Add pistachio syrup to mug. 2. Brew espresso and stir well. 3. Steam milk until frothy. 4. Pour milk into the mixture. 5. Garnish with crushed pistachios. 6. Unique green nutty flavor.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Maple Latte', 'Espresso, Maple syrup, Milk', '1. Pour maple syrup into mug. 2. Brew espresso and mix. 3. Steam milk for microfoam. 4. Pour milk gently into mug. 5. Dust with cinnamon powder. 6. Natural woody sweetness.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Honey Lavender Iced Coffee', 'Coffee, Honey, Lavender, Ice', '1. Make lavender-honey syrup. 2. Fill glass with ice and coffee. 3. Add 2 tbsp of the syrup. 4. Add a splash of almond milk. 5. Stir until well combined. 6. Refreshing floral iced coffee.', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Cold'),
('Affogato Mocha', 'Gelato, Espresso, Chocolate', '1. Add chocolate gelato to bowl. 2. Drizzle with chocolate sauce. 3. Brew a hot double espresso. 4. Pour espresso over gelato. 5. Top with whipped cream. 6. Double chocolate dessert treat.', 'https://images.unsplash.com/photo-1592663527359-cf6642f54cff', 'Dessert'),
('Cardamom Latte', 'Espresso, Cardamom, Milk', '1. Crush 2 cardamom pods in cup. 2. Brew espresso over the spice. 3. Steam milk until creamy. 4. Pour milk and strain pods. 5. Add a hint of honey. 6. Fragrant Middle Eastern style.', 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7', 'Hot'),
('Espresso on Ice', 'Double Espresso, Large Ice', '1. Fill a glass with large ice. 2. Brew a double espresso shot. 3. Pour espresso over ice fast. 4. Shake or stir to chill. 5. Drink immediately for bold taste. 6. Pure and simple cold caffeine.', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Cold'),
('Caffè Macchiato Caldo', 'Espresso, Hot milk foam', '1. Brew a single espresso shot. 2. Steam milk for very dry foam. 3. Use a spoon to lift foam. 4. Place 1-2 spoons of foam on. 5. Serve in a small warm cup. 6. Strong with a touch of milk.', 'https://images.unsplash.com/photo-1485808191679-5f86510681a2', 'Hot');
                `;
                
             db.query(insertQuery, (err, result) => {
            if (err) {
                console.log('Note: Recipes might already exist in database.');
            } else {
                console.log('All coffee recipes added successfully! ☕✨');
            }
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