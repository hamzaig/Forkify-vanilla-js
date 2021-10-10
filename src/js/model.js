import { async } from "regenerator-runtime";
import { API_URL } from "./config";
import { getJSON } from "./helpers";

export const state = {
    recipe: {},
    search: {
        query: "",
        results: [],
    },
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
    } catch (err) {
        console.log(err);
        throw err;
    }
}


