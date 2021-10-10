import * as model from "./model";
import recipeView from "./views/recipeView";
import "core-js/stable";
import "regenerator-runtime/runtime";
import searchView from "./views/searchView";
import resultView from "./views/resultView";


const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////



const controlRecipes = async () => {
  try {

    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    // loading Recipe
    recipeView.renderSpinner();

    // Rendring Recipe
    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);

  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
}

const controlSearchResults = async () => {
  try {
    resultView.renderSpinner()
    const query = searchView.getQuery()
    if (!query) return;
    await model.loadSearchResults(query);
    console.log(model.state.search.results);
    resultView.render(model.state.search.results)
  } catch (err) {
    console.log(err);
  }
}


function init() {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
}

init();
