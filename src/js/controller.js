import * as model from "./model";
import recipeView from "./views/recipeView";
import "core-js/stable";
import "regenerator-runtime/runtime";
import searchView from "./views/searchView";
import resultView from "./views/resultView";
import paginationView from "./views/paginationView";
import BookmarksView from "./views/BookmarksView";


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

    resultView.update(model.getSearchResultsPage())

    // Rendring Recipe
    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
    BookmarksView.update(model.state.bookmarks)
    // Test
    // controlServings();

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
    // console.log(model.state.search.results);
    resultView.render(model.getSearchResultsPage())
    paginationView.render(model.state.search)
  } catch (err) {
    console.log(err);
  }
}

const controlPagination = (goToPage) => {
  resultView.render(model.getSearchResultsPage(goToPage))
  paginationView.render(model.state.search)
}

const controlServings = (newServings) => {
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
  // console.log(model.state);
}

const controlAddBookmark = () => {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked) model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  BookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = () => {
  BookmarksView.render(model.state.bookmarks);
}

function init() {
  BookmarksView.addHandlerRander(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHanderClick(controlPagination);
}

init();
