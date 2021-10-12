import { async } from "regenerator-runtime";
import { API_URL } from "./config";
import { getJSON } from "./helpers";
import { RESULT_PER_PAGE } from "./config";

export const state = {
    recipe: {},
    search: {
        query: "",
        results: [],
        page: 1,
        resultsPerPage: RESULT_PER_PAGE,
    },
    bookmarks: [],
}

export const loadRecipe = async function (id) {
    try {

        const data = await getJSON(`${API_URL}${id}`);
        const recipe = data.data.recipe;
        // console.log(recipe);
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
        }
        if (state.bookmarks.some(bookmark => {
            return bookmark.id === id
        })) {
            state.recipe.bookmarked = true;
        } else {
            // state.recipe.bookmarked = false;
        }
        // console.log(state.recipe);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const loadSearchResults = async (query) => {
    try {
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}`)
        // console.log(data);
        state.search.results = data.data.recipes.map(row => {
            return {
                id: row.id,
                title: row.title,
                publisher: row.publisher,
                image: row.image_url,
            };
        })
        state.search.page = 1;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


export const getSearchResultsPage = (page = state.search.page) => {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
}

export const updateServings = (newServings) => {
    // console.log(state.recipe);
    state.recipe.ingredients.forEach(element => {
        element.quantity = (element.quantity * newServings) / state.recipe.servings;
    });
    state.recipe.servings = newServings;
}

export const addBookmark = (recipe) => {
    state.bookmarks.push(recipe);
    if (recipe.id === state.recipe.id) {
        state.recipe.bookmarked = true;
    }
}

export const deleteBookmark = (id) => {
    // Delete Bookmark
    const index = state.bookmarks.findIndex(el => id === el.id);
    state.bookmarks.splice(index, 1);

    //mark current recipe as not bookmarked
    if (id === state.recipe.id) state.recipe.bookmarked = false;
}