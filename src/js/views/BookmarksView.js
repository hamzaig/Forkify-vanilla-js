import View from "./View";
import icons from "url:../../img/icons.svg";

class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = "No Bookmarks Yet Find a nice recipe and bookmark it!";
    _message = "";

    _generateMarkup() {
        return this._data.map(this._generateMarkupReview).join("");
    }

    addHandlerRander(handler) {
        window.addEventListener("load", handler);
    }

    _generateMarkupReview(element) {
        const id = window.location.hash.slice(1);
        // console.log(element.id === id);
        return (
            ` <li class="preview">
                    <a class="preview__link ${element.id === id ? "preview__link--active" : ""}" href="#${element.id}">
                    <figure class="preview__fig">
                        <img src="${element.image}" alt="Image Not Found" />
                    </figure>
                    <div class="preview__data">
                        <h4 class="preview__title">${element.title}</h4>
                        <p class="preview__publisher">${element.publisher}</p>
                    </div>
                    </a>
                </li>`
        );
    }
}
export default new BookmarksView();