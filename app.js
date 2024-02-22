

const searchBtn = document.getElementById("search");
const mealList = document.getElementById("meal");

const mealDetails = document.querySelector('.modal-body')

searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);

function getMealList(){
    let searchInput = document.getElementById("search-input").value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                <div class="col-sm mb-5" data-id="${meal.idMeal}">
                        <div class="card-hover">
                            <div class="card-hover__content">
                                <h3 class="card-hover__title">
                                    ${meal.strMeal}
                                </h3>
                                <button class="card-hover__link get-recipe" id="get-recipe" data-bs-toggle="modal" data-bs-target="#myLargeModal">
                                    <span class="get-recipe">Get recipe</span>
                                    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </button>
                            </div>
                            <div class="card-hover__extra">
                                <h4>Learn <span>now</span> and get <span>40%</span> discount!</h4>
                            </div>
                            <img src="${meal.strMealThumb}"
                                alt="" />
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove("notFound");
        }else{
            html = "Sorry, no meals found!";
            mealList.classList.add("notFound");
        }


        mealList.innerHTML = html;
    });
}

function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains("get-recipe")){
        let mealItem = e.target.parentElement.parentElement.parentElement.parentElement;
        // console.log(mealItem);
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => recipeModal(data.meals));
    }else{
        return false;
    }
}

function recipeModal(meal) {
    meal = meal[0];
    let html = `
        <div class="meal-image-container">
            <img src="${meal.strMealThumb}"
                alt="" srcset="">
            <h1 class="meal-title">${meal.strMeal}</h1>
            <p class="meal-category">${meal.strCategory}</p>
            <h5 class="cook-time"><i
                class="fas fa-clock py-1 px-2"></i> TBH</h5>
        </div>
        <div class="meal-details">
            <div class="instructions">
                <h3>Instructions</h3>
                <p>${meal.strInstructions}</p>
            </div>
            <div class="ingredients">
                <h3>Ingredients</h3>
                <ul>
    `;
    
    // Loop through the ingredients and measures
    for (let i = 1; i <= 20; i++) {
        let ingredient = meal[`strIngredient${i}`];
        let measure = meal[`strMeasure${i}`];
        // Check if ingredient is not null and not an empty string
        if (ingredient && ingredient.trim() !== "") {
            html += `<li>${measure} ${ingredient}</li>`;
        }
    }
    
    html += `
                </ul>
            </div>
        </div>
        <p>Here's a link to the original recipe: <a href="${meal.strYoutube}">${meal.strMeal}</a>.</p>
    `;
    
    mealDetails.innerHTML = html;
    mealDetails.parentElement.classList.add("showRecipe");
}