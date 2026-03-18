export function createAppState(initialItemsPerPage = 20) {
  const state = {
    allHeroes: [],
    filteredHeroes: [],
    currentPage: 1,
    itemsPerPage: initialItemsPerPage,
    filters: {
      search: "",
      gender: "all",
      alignment: "all",
      publisher: "all",
    },
  };

  const applyFilters = () => {
    state.filteredHeroes = state.allHeroes.filter((hero) => {
      const searchLower = state.filters.search;
      const matchesSearch =
        hero.name.toLowerCase().includes(searchLower) ||
        (hero.biography.fullName &&
          hero.biography.fullName.toLowerCase().includes(searchLower));

      let heroGender = hero.appearance.gender
        ? hero.appearance.gender.toLowerCase()
        : "-";
      const matchesGender =
        state.filters.gender === "all" || heroGender === state.filters.gender;

      let heroAlignment = hero.biography.alignment
        ? hero.biography.alignment.toLowerCase()
        : "-";
      if (
        heroAlignment !== "good" &&
        heroAlignment !== "bad" &&
        heroAlignment !== "neutral"
      ) {
        heroAlignment = "-";
      }
      const matchesAlignment =
        state.filters.alignment === "all" ||
        heroAlignment === state.filters.alignment;

      let heroPublisher = hero.biography.publisher
        ? hero.biography.publisher.toLowerCase()
        : "-";
      const matchesPublisher =
        state.filters.publisher === "all" ||
        heroPublisher === state.filters.publisher;

      return (
        matchesSearch && matchesGender && matchesAlignment && matchesPublisher
      );
    });
  };

  return {
    get currentPage() {
      return state.currentPage;
    },
    get itemsPerPage() {
      return state.itemsPerPage;
    },
    setHeroes(heroes) {
      state.allHeroes = heroes;
      applyFilters();
    },
    setFilter(key, value) {
      state.filters[key] = value.toLowerCase();
      state.currentPage = 1;
      applyFilters();
    },
    getPaginatedHeroes() {
      const startIndex = (state.currentPage - 1) * state.itemsPerPage;
      const endIndex = startIndex + state.itemsPerPage;
      return state.filteredHeroes.slice(startIndex, endIndex);
    },
    getTotalPages() {
      return Math.max(
        1,
        Math.ceil(state.filteredHeroes.length / state.itemsPerPage)
      );
    },
    setPage(pageNumber) {
      const totalPages = this.getTotalPages();
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        state.currentPage = pageNumber;
        return true;
      }
      return false;
    },
  };
}
