export default class Chat {
  constructor() {
    this.chatIcon = document.querySelector(".header-chat-icon");
    this.socket;
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
    if (this.socket == undefined) this.socket = io();
    console.log("Chat opened");
  }
}
