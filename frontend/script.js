let allRecipes = [];

document.addEventListener("DOMContentLoaded", fetchRecipes);

async function fetchRecipes() {
    try {
        // Backend connection check
        const response = await fetch('http://localhost:5000/api/recipes');
        if (!response.ok) throw new Error('API connecting error');
        
        allRecipes = await response.json();
        console.log("Recipes loaded:", allRecipes.length); 
        displayList(allRecipes);
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

function displayList(recipes) {
    const list = document.getElementById('coffee-list');
    list.innerHTML = ""; 

    recipes.forEach(recipe => {
        const li = document.createElement('li');
        li.innerText = recipe.name;
        li.onclick = () => {
            // Selection highlight logic
            document.querySelectorAll('#coffee-list li').forEach(item => item.classList.remove('active'));
            li.classList.add('active');
            showRecipe(recipe);
        };
        list.appendChild(li);
    });
}

function showRecipe(recipe) {
    document.getElementById('placeholder-text').classList.add('hidden');
    document.getElementById('recipe-card').classList.remove('hidden');

    document.getElementById('coffee-name').innerText = recipe.name;
    document.getElementById('ingredients').innerText = recipe.ingredients;
    document.getElementById('coffee-type').innerText = recipe.type || "Specialty";

    // PHOTO FIX: Database link work aagala na default image varum
    const coffeeImg = document.getElementById('coffee-image');
    coffeeImg.src = recipe.image_url;
    coffeeImg.onerror = function() {
        this.src = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500";
    };

    // STEPS FIX: Splitting numbers correctly
    const stepsDiv = document.getElementById('steps');
    stepsDiv.innerHTML = "";
    
    // Split by numbers (1. or 2.) or dots
    const stepsArray = recipe.steps.split(/\d+\./).filter(s => s.trim() !== "");

    stepsArray.forEach((step, index) => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>Step ${index + 1}:</strong> ${step.trim()}`;
        stepsDiv.appendChild(p);
    });
}

function filterMenu() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const filtered = allRecipes.filter(r => r.name.toLowerCase().includes(query));
    displayList(filtered);
}