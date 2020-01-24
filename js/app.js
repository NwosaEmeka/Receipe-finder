const APP_ID = config.ID;
const APP_KEY = config.KEY;

let result;
const btn_submit = document.querySelector('.form-element').addEventListener('submit', getInput);

//On window load, initialize the search input to chicken
window.addEventListener('DOMContentLoaded', (event) => {
	fetchrecipe('chicken');
});

function getInput(e) {
	let input_value = document.querySelector('#search-input').value;
	if (input_value === '') {
		fetchrecipe('chicken');
	} else {
		fetchrecipe(input_value);
	}
	input_value = '';
	e.preventDefault();
}

async function fetchrecipe(user_input) {
	const receipeResponse = await fetch(
		`https://api.edamam.com/search?q=${user_input}&app_id=${APP_ID}&app_key=${APP_KEY}`
	);
	const recipes = await receipeResponse.json();
	if (recipes.q === user_input) {
		let recipe = recipes.hits;
		let output = '';
		if (recipe.length === 0) {
			//if the searched recipe is not found
			const errMsg = document.querySelector('.errdiv');
			//display an error message
			errMsg.textContent = `${user_input} recipe is not available`;
			errMsg.classList.add('errmsg');
			//clear the error
			setTimeout(clearMsg, 3000, errMsg);
		} else {
			const recipe_card = document.querySelector('.recipes'); //get the card that holds all recipes
			//clear all the recipes
			clearRecipe(recipe_card);

			for (let i = 0; i < recipe.length; i++) {
				//console.log(recipe[i].recipe.label);
				//label = recipe[i].recipe.label
				//full information at recipe.shareAs
				//image = recipe.image
				// total cooking time in minutes recipe[i].recipe.totalTime
				//ingridients
				output = `
			<div class="recipe-items">
			<h2 class="recipeName">${recipe[i].recipe.label}</h2>
			<img class="recipe_image" src="${recipe[i].recipe.image}" alt="">
			<h3>Ingridients</h3>
			<ol class="recipe-ingridients">
			`;
				const ingridients = recipe[i].recipe.ingredients;

				for (let j = 0; j < ingridients.length; j++) {
					output += `
				<li>${ingridients[j].text}</li>
				`;
				}
				output += `
			</ol >
				<div class="info">
					<a href="${recipe[i].recipe.shareAs}" target="_blank" class="btn btn-readMore">Read More</a>
				</div> 
			`;
				recipe_card.innerHTML += output;
			}
		}
	}
}

//clear error message

function clearMsg(elemenetName) {
	elemenetName.textContent = '';
	elemenetName.classList.remove('errmsg');
}

function clearRecipe(el) {
	//el.innerHTML = "";
	//While loop is faster than innerHTML = ""
	//Reference on how to clear the DOM https://jsperf.com/innerhtml-vs-removechild/418
	while (el.lastChild) {
		el.removeChild(el.lastChild);
	}
}
