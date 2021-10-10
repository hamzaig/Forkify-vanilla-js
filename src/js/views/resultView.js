import View from "./View";
import icons from "url:../../img/icons.svg";

class ResultView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = "No recipes found for your query!";
    _message = "";

    _generateMarkup() {
        return this._data.map(this._generateMarkupReview).join("");
    }

    _generateMarkupReview(element) {
        return (
            ` <li class="preview">
                    <a class="preview__link" href="#${element.id}">
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
export default new ResultView();