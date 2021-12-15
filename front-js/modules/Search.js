import axios from "axios";
export default class Search {
  constructor() {
    this.search_icon = document.querySelector(".header-search-icon");
    this.search_overlay = document.querySelector(".search-overlay");
    this.close_button = document.querySelector(".close-live-search");
    this.inputField = document.querySelector("#live-search-field");
    this.loadingCircle = document.querySelector(".circle-loader");
    this.csrfToken = document.querySelector("[name=_csrf]");
    this.timeout;
    this.events();
  }

  // Events
  events() {
    this.search_icon.addEventListener("click", (e) => {
      this.showOverlay();
    });

    this.close_button.addEventListener("click", (e) => {
      this.hideOverlay();
    });

    this.inputField.addEventListener("keyup", (e) => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.handleSearch, 1000);
    });
  }

  // Methods
  showOverlay() {
    this.search_overlay.classList.add("search-overlay--visible");
  }

  hideOverlay() {
    this.search_overlay.classList.remove("search-overlay--visible");
  }

  handleSearch = () => {
    this.showLoadingCircle();
    console.log("Started ...");
    axios
      .post("/api/searchPost", {
        text: this.inputField.value,
        _csrf: this.csrfToken.value,
      })
      .then((result) => {
        this.hideLoadingCircle();
        console.log(result);
      });
  };

  showLoadingCircle() {
    this.loadingCircle.classList.add("circle-loader--visible");
  }

  hideLoadingCircle() {
    this.loadingCircle.classList.remove("circle-loader--visible");
  }
}
