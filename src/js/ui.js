export function showLoader(show) {
  const loader = document.getElementById("loader");
  const grid = document.getElementById("heroesGrid");
  if (show) {
    loader.style.display = "flex";
    grid.style.display = "none";
  } else {
    loader.style.display = "none";
    grid.style.display = "grid";
  }
}

function getAlignmentClass(alignment) {
  if (!alignment) return "neutral";
  const align = alignment.toLowerCase();
  if (align === "good") return "good";
  if (align === "bad") return "bad";
  return "neutral";
}

function getStatColor(value) {
  if (value > 80) return "var(--accent-color)";
  if (value > 50) return "var(--primary-color)";
  return "var(--neutral-color)";
}

export function renderHeroes(heroes, container, openModalFn) {
  container.innerHTML = "";

  if (heroes.length === 0) {
    container.style.display = "block";
    container.innerHTML =
      '<div class="no-results">No se encontraron héroes que coincidan con la búsqueda. 🦇</div>';
    return;
  }
  container.style.display = "grid";

  heroes.forEach((hero) => {
    const card = document.createElement("div");
    card.className = "hero-card";

    const alignmentClass = getAlignmentClass(hero.biography?.alignment);
    const imageUrl =
      hero.images?.sm ||
      hero.images?.md ||
      "https://via.placeholder.com/320x480?text=No+Image";

    card.innerHTML = `
            <div class="hero-image-container">
                <img src="${imageUrl}" alt="${hero.name}" loading="lazy" />
                <div class="hero-alignment indicator-${alignmentClass}" title="Alignment: ${
      hero.biography?.alignment || "Unknown"
    }"></div>
            </div>
            <div class="hero-info">
                <h3>${hero.name}</h3>
                <p><i class="fa-solid fa-book-open"></i> ${
                  hero.biography?.publisher || "Desconocido"
                }</p>
            </div>
        `;

    card.addEventListener("click", () => openModalFn(hero));
    container.appendChild(card);
  });
}

export function updatePagination(currentState, uiElements) {
  const { prevBtn, nextBtn, pageInfo } = uiElements;
  const totalPages = currentState.getTotalPages();

  pageInfo.textContent = `Página ${currentState.currentPage} de ${totalPages}`;

  prevBtn.disabled = currentState.currentPage === 1;
  nextBtn.disabled =
    currentState.currentPage === totalPages || totalPages === 0;
}

export function populatePublishers(heroes, selectElement) {
  const publishers = new Set();
  heroes.forEach((h) => {
    if (
      h.biography?.publisher &&
      h.biography.publisher !== "-" &&
      h.biography.publisher !== "null"
    ) {
      publishers.add(h.biography.publisher);
    }
  });

  const sortedPublishers = Array.from(publishers).sort();

  // Clear existings except 'all'
  selectElement.innerHTML =
    '<option value="all">Todas las Editoriales</option>';

  sortedPublishers.forEach((pub) => {
    const option = document.createElement("option");
    option.value = pub.toLowerCase();
    option.textContent = pub;
    selectElement.appendChild(option);
  });
}

let modalElement = null;

export function initModal(modalId, closeBtnId) {
  modalElement = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeBtnId);

  if (!modalElement || !closeBtn) return;

  closeBtn.addEventListener("click", closeModal);
  modalElement.addEventListener("click", (e) => {
    if (e.target === modalElement) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalElement.classList.contains("active")) {
      closeModal();
    }
  });
}

function closeModal() {
  if (modalElement) modalElement.classList.remove("active");
}

export function openHeroModal(hero) {
  const modalBody = document.getElementById("modalBody");
  if (!modalElement || !modalBody) return;

  const imgUrl =
    hero.images?.lg ||
    hero.images?.md ||
    "https://via.placeholder.com/600x800?text=No+Image";

  const stats = hero.powerstats || {};
  const getStat = (val) => (val && val !== "null" ? parseInt(val) : 0);

  modalBody.innerHTML = `
        <div class="modal-grid">
            <div class="modal-image">
                <img src="${imgUrl}" alt="${hero.name}">
            </div>
            <div class="modal-details">
                <h2>${hero.name}</h2>
                <div class="real-name">${
                  hero.biography?.fullName || "Nombre Desconocido"
                }</div>
                
                <div class="stats-section">
                    ${[
                      "intelligence",
                      "strength",
                      "speed",
                      "durability",
                      "power",
                      "combat",
                    ]
                      .map((stat) => {
                        const val = getStat(stats[stat]);
                        return `
                        <div class="stat-row">
                            <div class="stat-label">
                                <span>${stat.toUpperCase()}</span>
                                <span style="color: ${getStatColor(
                                  val
                                )}; font-weight: bold;">${val}</span>
                            </div>
                            <div class="stat-bar-bg">
                                <div class="stat-bar-fill" style="width: ${val}%; background: ${getStatColor(
                          val
                        )};"></div>
                            </div>
                        </div>
                        `;
                      })
                      .join("")}
                </div>
                
                <div class="info-cards">
                    <div class="info-card">
                        <h4>Género</h4>
                        <p>${hero.appearance?.gender || "-"}</p>
                    </div>
                    <div class="info-card">
                        <h4>Raza</h4>
                        <p>${hero.appearance?.race || "-"}</p>
                    </div>
                    <div class="info-card">
                        <h4>Alineación</h4>
                        <p style="text-transform: capitalize; color: ${
                          hero.biography?.alignment === "good"
                            ? "var(--good-color)"
                            : hero.biography?.alignment === "bad"
                            ? "var(--bad-color)"
                            : "var(--neutral-color)"
                        };">
                            ${hero.biography?.alignment || "-"}
                        </p>
                    </div>
                    <div class="info-card">
                        <h4>Editorial</h4>
                        <p>${hero.biography?.publisher || "-"}</p>
                    </div>
                    <div class="info-card" style="grid-column: 1 / -1;">
                        <h4>Lugar de Nacimiento</h4>
                        <p>${
                          hero.biography?.placeOfBirth === "-"
                            ? "Desconocido"
                            : hero.biography?.placeOfBirth || "Desconocido"
                        }</p>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Añadir timeout para la animación de las barras de estadísticas (de 0 a valor)
  setTimeout(() => {
    const bars = modalBody.querySelectorAll(".stat-bar-fill");
    bars.forEach((bar) => {
      const width = bar.style.width;
      bar.style.width = "0";
      setTimeout(() => {
        bar.style.width = width;
      }, 50);
    });
  }, 10);

  modalElement.classList.add("active");
}
