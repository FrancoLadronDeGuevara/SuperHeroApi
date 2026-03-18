import { fetchHeroes } from "./api.js";
import { createAppState } from "./state.js";
import { showLoader, openHeroModal, renderHeroes } from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {
  const appState = createAppState(20);

  const $gridHeroes = document.getElementById("heroesGrid");

  const refreshUI = () => {
    const pageData = appState.getPaginatedHeroes();
    renderHeroes(pageData, $gridHeroes, openHeroModal);
    //updatePagination(appState, pagControls);

    // Solo hacer scroll si el usuario no está ya en la parte de arriba
    /*const controlsTop = document.querySelector(".controls-section").offsetTop;
    if (window.scrollY > controlsTop) {
      window.scrollTo({ top: controlsTop - 20, behavior: "smooth" });
    }*/
  };

  //Proceso de carga inicial
  showLoader(true);
  const heroes = await fetchHeroes();

  if (heroes && heroes.length > 0) {
    appState.setHeroes(heroes);
    refreshUI();
  } else {
    $gridHeroes.innerHTML =
      '<div class="no-results">Error al cargar superhéroes. Por favor, intenta conectar a internet o revisa la URL de la API.</div>';
  }
  showLoader(false);
});
