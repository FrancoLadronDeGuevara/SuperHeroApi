import { fetchHeroes } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const $gridHeroes = document.getElementById("heroesGrid");

  const heroes = await fetchHeroes();

  if (heroes && heroes.length > 0) {
    console.log(heroes);
  } else {
    $gridHeroes.innerHTML =
      '<div class="no-results">Error al cargar superhéroes. Por favor, intenta conectar a internet o revisa la URL de la API.</div>';
  }
});
