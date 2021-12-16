import Chat from "./modules/Chat";
import Search from "./modules/Search";

if (document.querySelector(".header-search-icon")) new Search();
if (document.querySelector(".header-chat-icon")) new Chat();
