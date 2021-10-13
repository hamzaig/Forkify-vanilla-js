import { async } from "regenerator-runtime";
import { API_URL, API_KEY } from "./config";
import { getJSON, sendJSON } from "./helpers";
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

const createRecipeObject = (data) => {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),
    };
}

export const loadRecipe = async function (id) {
    try {

        const data = await getJSON(`${API_URL}${id}?key=${API_KEY}`);
        state.recipe = createRecipeObject(data);


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
        const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`)
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

const storeBookmarks = () => {
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

export const addBookmark = (recipe) => {
    state.bookmarks.push(recipe);
    if (recipe.id === state.recipe.id) {
        state.recipe.bookmarked = true;
    }
    storeBookmarks();
}

export const deleteBookmark = (id) => {
    // Delete Bookmark
    const index = state.bookmarks.findIndex(el => id === el.id);
    state.bookmarks.splice(index, 1);

    //mark current recipe as not bookmarked
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    storeBookmarks();
}

export const uploadRecipe = async function (newRecipe) {
    try {
        let ingredients = Object.entries(newRecipe);
        ingredients = ingredients.filter(entry => entry[0].startsWith("ingredient") && entry[1] !== "");
        // console.log(ingredients);
        ingredients = ingredients.map(ing => {
            const ingArr = ing[1].replaceAll(" ", "").split(",");
            if (ingArr.length !== 3) {
                throw new Erorr("Wrong Ingredient Format Please Use Correct Format");
            }
            const [quantity, unit, description] = ingArr;
            return { quantity: quantity ? +quantity : null, unit, description };
        });
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        }
        const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);
        console.log(data);
        state.recipe = createRecipeObject(data)
        addBookmark(state.recipe);
    } catch (err) {
        throw err;
    }
}


const init = () => {
    const storage = localStorage.getItem("bookmarks");
    if (storage) state.bookmarks = JSON.parse(storage)
};
init();