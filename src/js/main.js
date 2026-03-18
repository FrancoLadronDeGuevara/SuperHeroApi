import { fetchHeroes } from "./api.js";
import { createAppState } from "./state.js";
import {
  showLoader,
  renderHeroes,
  updatePagination,
  populatePublishers,
  initModal,
  openHeroModal,
} from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {
  const appState = createAppState(20); // 20 héroes por página

  const gridEl = document.getElementById("heroesGrid");
  const searchInput = document.getElementById("searchInput");
  const genderFilter = document.getElementById("genderFilter");
  const alignmentFilter = document.getElementById("alignmentFilter");
  const publisherFilter = document.getElementById("publisherFilter");

  const pagControls = {
    prevBtn: document.getElementById("prevBtn"),
    nextBtn: document.getElementById("nextBtn"),
    pageInfo: document.getElementById("pageInfo"),
  };

  initModal("heroModal", "closeModalBtn");

  const refreshUI = () => {
    const pageData = appState.getPaginatedHeroes();
    renderHeroes(pageData, gridEl, openHeroModal);
    updatePagination(appState, pagControls);

    // Solo hacer scroll si el usuario no está ya en la parte de arriba
    const controlsTop = document.querySelector(".controls-section").offsetTop;
    if (window.scrollY > controlsTop) {
      window.scrollTo({ top: controlsTop - 20, behavior: "smooth" });
    }
  };

  // Events debounce para búsqueda (opcional, pero mejora UX)
  let searchTimeout;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      appState.setFilter("search", e.target.value);
      refreshUI();
    }, 300);
  });

  genderFilter.addEventListener("change", (e) => {
    appState.setFilter("gender", e.target.value);
    refreshUI();
  });

  alignmentFilter.addEventListener("change", (e) => {
    appState.setFilter("alignment", e.target.value);
    refreshUI();
  });

  publisherFilter.addEventListener("change", (e) => {
    appState.setFilter("publisher", e.target.value);
    refreshUI();
  });

  pagControls.prevBtn.addEventListener("click", () => {
    if (appState.setPage(appState.currentPage - 1)) {
      refreshUI();
    }
  });

  pagControls.nextBtn.addEventListener("click", () => {
    if (appState.setPage(appState.currentPage + 1)) {
      refreshUI();
    }
  });

  // Proceso de carga inicial
  showLoader(true);
  const heroes = await fetchHeroes();

  if (heroes && heroes.length > 0) {
    populatePublishers(heroes, publisherFilter);
    appState.setHeroes(heroes);
    refreshUI();
  } else {
    gridEl.innerHTML =
      '<div class="no-results">Error al cargar superhéroes. Por favor, intenta conectar a internet o revisa la URL de la API.</div>';
  }
  showLoader(false);
});
