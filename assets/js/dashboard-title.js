document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector('input[type="search"]');
  const filterOptions = document.querySelectorAll(".dropdown-content a");
  const systemCards = document.querySelectorAll(".system-card");

  let activeFilter = "";
  let searchQuery = "";
  let isFiltering = false;

  function showAllCards() {
    systemCards.forEach(card => {
      card.classList.remove("hidden-card");
      card.style.display = "";
    });
  }

  function filterSystems() {
    if (isFiltering) return;
    isFiltering = true;
    document.body.classList.add("cursor-wait");

    if (!searchQuery && !activeFilter) {
      showAllCards();
      document.body.classList.remove("cursor-wait");
      isFiltering = false;
      return;
    }

    systemCards.forEach(card => {
      const title = card.querySelector(".card-title")?.textContent.toLowerCase() || "";
      const category = card.querySelector(".badge")?.textContent.toLowerCase() || "";

      const matchesSearch = !searchQuery || title.includes(searchQuery);
      const matchesFilter = !activeFilter || category === activeFilter;

      if (matchesSearch && matchesFilter) {
        card.style.display = "";
        setTimeout(() => card.classList.remove("hidden-card"), 10);
      } else {
        card.classList.add("hidden-card");
        setTimeout(() => (card.style.display = "none"), 300);
      }
    });

    setTimeout(() => {
      document.body.classList.remove("cursor-wait");
      isFiltering = false;
    }, 350);
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase();
      filterSystems();
    });
  }

  if (filterOptions.length) {
    filterOptions.forEach(option => {
      option.addEventListener("click", () => {
        activeFilter =
          option.textContent.trim().toLowerCase() === "all"
            ? ""
            : option.textContent.trim().toLowerCase();

        filterOptions.forEach(o => o.classList.remove("bg-pup-yellow", "text-black"));
        option.classList.add("bg-pup-yellow", "text-black");

        filterSystems();
      });
    });
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".system-card").forEach(card => {
  observer.observe(card);
});