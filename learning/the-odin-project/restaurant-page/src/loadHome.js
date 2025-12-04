export default function loadHome() {
  const content = document.querySelector("#content");

  content.innerHTML = "";

  const h1 = document.createElement("h1");
  const h1_content = document.createTextNode("Welcome to La Bella Cucina");
  h1.appendChild(h1_content);

  content.appendChild(h1);

  const img = document.createElement("img");
  img.src = require("./images/pizza.png");
  img.alt = "Delicious Italian Food";

  content.appendChild(img);

  const p = document.createElement("p");
  const p_content = document.createTextNode(
    "At La Bella Cucina, we bring you the heart of Italy on every plate. Enjoy our cozy atmosphere, homemade pasta, fresh ingredients, and a winelist that will make your evening unforgettable. Whether it's a romantic dinner or a family feast, you're always welcome at our table."
  );
  p.appendChild(p_content);

  content.appendChild(p);
}
