document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector('input[type="search"]');
  const filterOptions = document.querySelectorAll(".dropdown-content a");
  const systemCards = document.querySelectorAll(".system-card");

  let activeFilter = "";
  let searchQuery = "";
  let isFiltering = false;

  systemCards.forEach(card => {
    card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  });

  function showAllCards() {
    systemCards.forEach(card => {
      card.style.display = "";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
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
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 50);
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(10px)";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
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
