import "./index.css";
import loadHome from "./loadHome";
import loadMenu from "./loadMenu";
import loadAbout from "./loadAbout";

loadHome();

const home = document.querySelector("#home");
const menu = document.querySelector("#menu");
const about = document.querySelector("#about");

home.addEventListener("click", () => loadHome());
menu.addEventListener("click", () => loadMenu());
about.addEventListener("click", () => loadAbout());
