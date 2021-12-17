import axios from "axios";
export default class Search {
  constructor() {
    this.search_icon = document.querySelector(".header-search-icon");
    this.search_overlay = document.querySelector(".search-overlay");
    this.close_button = document.querySelector(".close-live-search");
    this.inputField = document.querySelector("#live-search-field");
    this.loadingCircle = document.querySelector(".circle-loader");
    this.csrfToken = document.querySelector("[name=_csrf]");
    this.resultArea = document.querySelector(".live-search-results");
    this.timeout;
    this.events();
  }

  // Events
  events() {
    this.search_icon.addEventListener("click", (e) => {
      this.inputField.value = "";
      this.hideResults();
      this.showOverlay();
      setTimeout(() => this.inputField.focus(), 50);
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
    this.hideResults();
    this.showLoadingCircle();
    axios
      .post("/api/searchPost", {
        text: this.inputField.value,
        _csrf: this.csrfToken.value,
      })
      .then((result) => {
        this.hideLoadingCircle();
        this.showResults(result.data);
      });
  };

  showLoadingCircle() {
    this.loadingCircle.classList.add("circle-loader--visible");
  }

  hideLoadingCircle() {
    this.loadingCircle.classList.remove("circle-loader--visible");
  }

  showResults(data) {
    let count = "";
    if (data.length == 0) count = "No items found";
    else if (data.length == 1) count = "an item found";
    else count = `${data.length} item's found`;
    this.resultArea.innerHTML = `<div class="list-group shadow-sm">
    <div class="list-group-item active"><strong>Search Results</strong> (${count})</div>
    ${data
      .map(
        (post) => `<a href="/post/${
          post._id
        }" class="list-group-item list-group-item-action">
    <img class="avatar-tiny" src="${post.avatar}"> <strong>${
          post.title
        }</strong>
    <span class="text-muted small">by ${post.author} on ${new Date(
          post.createdDate
        ).getDay()}/${new Date(post.createdDate).getMonth() + 1}/${new Date(
          post.createdDate
        ).getFullYear()}</span>
  </a>`
      )
      .join("")}
    
  </div>`;
    this.resultArea.classList.add("live-search-results--visible");
  }

  hideResults() {
    this.resultArea.innerHTML = "";
    this.resultArea.classList.remove("live-search-results--visible");
  }
}
