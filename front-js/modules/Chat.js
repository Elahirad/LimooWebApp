export default class Chat {
  constructor() {
    this.chatIcon = document.querySelector(".header-chat-icon");
    this.socket = io();
    this.events();
  }

  // Events

  events() {
    this.chatIcon.addEventListener("click", (e) => {
        this.handleChat();
    });
  }

  // Methods

  handleChat() {
      console.log("Chat opened");
  }
}
