import View from "./View";

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = "Recipe was successfully Uploaded...";
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor() {
        super();
        // console.log(this._parentElement);
        // console.log(this._btnClose);
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
        // this._addHandlerUpload();
    }

    toggleWindlow() {
        this._overlay.classList.toggle("hidden");
        this._window.classList.toggle("hidden");
    }

    _addHandlerShowWindow() {
        console.log("hello");
        this._btnOpen.addEventListener("click", this.toggleWindlow.bind(this));
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener("click", this.toggleWindlow.bind(this));
        this._overlay.addEventListener("click", this.toggleWindlow.bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener("submit", function (e) {
            e.preventDefault();
            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);
            handler(data)
        })
    }


}
export default new AddRecipeView();