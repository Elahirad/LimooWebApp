export default class Chat {
  constructor() {
    this.chatIcon = document.querySelector(".header-chat-icon");
    this.chatOverlay = document.querySelector(".chat-wrapper");
    this.closeButton = document.querySelector(".chat-title-bar-close");
    this.inputForm = document.querySelector("#chatForm");
    this.inputField = document.querySelector("#chatField");
    this.userNameField = document.querySelector("._userName");
    this.emailField = document.querySelector("._email");
    this.chatSpace = document.querySelector("#chat");
    this.isOpen = false;
    this.socket;
    this.events();
  }

  // Events

  events() {
    this.chatIcon.addEventListener("click", (e) => {
      this.handleChat();
    });

    this.closeButton.addEventListener("click", (e) => {
      this.hideOverlay();
    });

    this.inputForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let text = this.inputField.value;
      this.inputField.value = "";
      this.sendMessage(text);
    });
  }

  // Methods

  handleChat() {
    if (this.socket == undefined) {
      this.socket = io();
      this.socket.on("incomingMsg", (data) => {
        this.receiveMessage(data);
      });
    }
    if (this.isOpen) {
      this.hideOverlay();
      this.isOpen = false;
    } else {
      this.showOverlay();
      this.isOpen = true;
    }
  }

  showOverlay() {
    this.chatOverlay.classList.add("chat--visible");
  }

  hideOverlay() {
    this.chatOverlay.classList.remove("chat--visible");
  }

  sendMessage(text) {
    this.socket.emit("newMessage", [
      { sender: this.userNameField.value, email: this.emailField.value, text },
    ]);
  }

  receiveMessage(data) {
    if (data[0].sender == this.userNameField.value) {
      this.chatSpace.insertAdjacentHTML(
        "beforeend",
        `<div class="chat-self">
      <div class="chat-message">
        <div class="chat-message-inner">
          ${data[0].text}
        </div>
      </div>
      <img class="chat-avatar avatar-tiny" src="${data[0].avatar}">
    </div>`
      );
    } else {
      console.log(data);
      this.chatSpace.insertAdjacentHTML(
        "beforeend",
        `<div class="chat-other">
      <a href="#"><img class="avatar-tiny" src="${data[0].avatar}"></a>
      <div class="chat-message"><div class="chat-message-inner">
        <a href="#"><strong>${data[0].sender}:</strong></a>
        ${data[0].text}
      </div></div>
    </div>`
      );
    }
    this.chatSpace.lastChild.scrollIntoView();
  }
}
