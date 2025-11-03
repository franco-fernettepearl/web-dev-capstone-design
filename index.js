// Helper function to detect mobile
function isMobile() {
  return window.innerWidth < 768; // md breakpoint
}

// Profile Menu Functionality
function initProfileMenu() {
  const profileToggle = document.getElementById("profile-toggle");
  const profileMenu = document.getElementById("profile-menu");
  const profileClose = document.getElementById("profile-close");

  function closeMenu() {
    profileMenu.classList.add("hidden");
  }

  if (profileToggle) {
    profileToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      profileMenu.classList.toggle("hidden");
    });
  }

  if (profileClose) {
    profileClose.addEventListener("click", function (e) {
      e.preventDefault();
      closeMenu();
    });
  }

  // Close when clicking outside
  document.addEventListener("click", function () {
    closeMenu();
  });

  // Keep menu open when clicking inside
  if (profileMenu) {
    profileMenu.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMenu();
    }
  });
}

// Dropdown Functionality
function toggleDropdown(dropdownName) {
  const dropdown = document.getElementById(dropdownName + "-dropdown");
  const button = document.querySelector(
    `[onclick="toggleDropdown('${dropdownName}')"]`
  );
  const arrow = button ? button.querySelector(".dropdown-arrow") : null;

  if (!dropdown) {
    console.error(`Dropdown with ID '${dropdownName}-dropdown' not found`);
    return;
  }

  // Close all other dropdowns first
  closeAllDropdowns(dropdownName);

  if (dropdown.classList.contains("hidden")) {
    // Open dropdown
    dropdown.classList.remove("hidden");
    if (arrow) arrow.style.transform = "rotate(180deg)";
    if (button) button.setAttribute("aria-expanded", "true");
  } else {
    // Close dropdown
    dropdown.classList.add("hidden");
    if (arrow) arrow.style.transform = "rotate(0deg)";
    if (button) button.setAttribute("aria-expanded", "false");
  }
}

function closeAllDropdowns(except = null) {
  const dropdowns = document.querySelectorAll(".dropdown-content");

  dropdowns.forEach((dropdown) => {
    const dropdownId = dropdown.id;
    const dropdownName = dropdownId.replace("-dropdown", "");

    if (dropdownName !== except && !dropdown.classList.contains("hidden")) {
      dropdown.classList.add("hidden");

      // Find corresponding button and arrow
      const button = document.querySelector(
        `[onclick="toggleDropdown('${dropdownName}')"]`
      );
      if (button) {
        const arrow = button.querySelector(".dropdown-arrow");
        if (arrow) arrow.style.transform = "rotate(0deg)";
        button.setAttribute("aria-expanded", "false");
      }
    }
  });
}

function initDropdownFunctionality() {
  // Prevent dropdown from closing when clicking inside it
  const dropdownContents = document.querySelectorAll(".dropdown-content");
  dropdownContents.forEach((content) => {
    content.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  });

  // Initialize ARIA attributes
  const toggleButtons = document.querySelectorAll(".dropdown-toggle");
  toggleButtons.forEach((button) => {
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("role", "button");
    button.setAttribute("aria-haspopup", "true");
  });

  // Close dropdowns on Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAllDropdowns();
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function (event) {
    const toggleButtons = document.querySelectorAll(".dropdown-toggle");
    let clickedOnToggle = false;

    toggleButtons.forEach((button) => {
      if (button.contains(event.target)) {
        clickedOnToggle = true;
      }
    });

    if (!clickedOnToggle) {
      closeAllDropdowns();
    }
  });
}

// Sidebar Functionality
function initSidebar() {
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  const closeBtn = document.getElementById("close-btn");
  const overlay = document.getElementById("sidebar-overlay");
  const content = document.getElementById("content");

  let sidebarOpen = !isMobile();

  function openSidebar() {
    sidebarOpen = true;
    sidebar.classList.remove("-translate-x-full");
    sidebar.classList.add("translate-x-0", "sidebar-open");

    if (isMobile()) {
      overlay.classList.remove("hidden");
    } else {
      // Use padding instead of margin so the content shrinks instead of overflowing
      content.classList.add("pl-64");
      overlay.classList.add("hidden");
    }
  }

  function closeSidebar() {
    sidebarOpen = false;
    sidebar.classList.remove("translate-x-0", "sidebar-open");
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
    content.classList.remove("pl-64");
  }

  function toggleSidebar() {
    if (sidebarOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  function handleResize() {
    if (isMobile()) {
      // Mobile: always close sidebar on resize, show overlay when sidebar open
      if (sidebarOpen) {
        overlay.classList.remove("hidden");
      } else {
        overlay.classList.add("hidden");
        sidebar.classList.add("-translate-x-full");
        sidebar.classList.remove("translate-x-0", "sidebar-open");
      }
      content.classList.remove("pl-64");
    } else {
      // Desktop: keep content margins responsive
      if (sidebarOpen) {
        overlay.classList.add("hidden");
        content.classList.add("pl-64");
        sidebar.classList.remove("-translate-x-full");
        sidebar.classList.add("translate-x-0", "sidebar-open");
      } else {
        overlay.classList.add("hidden");
        content.classList.remove("pl-64");
        sidebar.classList.add("-translate-x-full");
        sidebar.classList.remove("translate-x-0", "sidebar-open");
      }
    }
  }

  // Event listeners
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleSidebar);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSidebar);
  }

  if (overlay) {
    overlay.addEventListener("click", function () {
      if (isMobile()) {
        closeSidebar();
      }
    });
  }

  // Handle window resize
  window.addEventListener("resize", function () {
    handleResize();
  });

  // Initial setup
  handleResize();
}

// User Pool Table Functionality
function initUserPoolTable() {
  // Dummy user data
  const dummyUsers = [
    {
      username: "john.doe",
      email: "john.doe@example.com",
      name: "John Doe",
      status: "ACTIVE",
      created: "2024-01-15",
      lastSignIn: "2024-11-02",
    },
    {
      username: "jane.smith",
      email: "jane.smith@example.com",
      name: "Jane Smith",
      status: "ACTIVE",
      created: "2024-02-20",
      lastSignIn: "2024-11-01",
    },
    {
      username: "bob.wilson",
      email: "bob.wilson@example.com",
      name: "Bob Wilson",
      status: "INACTIVE",
      created: "2024-03-10",
      lastSignIn: "2024-10-15",
    },
    {
      username: "alice.johnson",
      email: "alice.johnson@example.com",
      name: "Alice Johnson",
      status: "ACTIVE",
      created: "2024-04-05",
      lastSignIn: "2024-11-03",
    },
    {
      username: "charlie.brown",
      email: "charlie.brown@example.com",
      name: "Charlie Brown",
      status: "ACTIVE",
      created: "2024-05-12",
      lastSignIn: "2024-10-28",
    },
    {
      username: "diana.prince",
      email: "diana.prince@example.com",
      name: "Diana Prince",
      status: "ACTIVE",
      created: "2024-06-08",
      lastSignIn: "2024-11-02",
    },
    {
      username: "evan.davis",
      email: "evan.davis@example.com",
      name: "Evan Davis",
      status: "ACTIVE",
      created: "2024-07-14",
      lastSignIn: "2024-10-25",
    },
    {
      username: "fiona.garcia",
      email: "fiona.garcia@example.com",
      name: "Fiona Garcia",
      status: "INACTIVE",
      created: "2024-08-22",
      lastSignIn: "2024-09-30",
    },
    {
      username: "george.miller",
      email: "george.miller@example.com",
      name: "George Miller",
      status: "ACTIVE",
      created: "2024-09-03",
      lastSignIn: "2024-11-01",
    },
    {
      username: "hannah.lee",
      email: "hannah.lee@example.com",
      name: "Hannah Lee",
      status: "ACTIVE",
      created: "2024-10-11",
      lastSignIn: "2024-11-03",
    },
    {
      username: "isaac.thomas",
      email: "isaac.thomas@example.com",
      name: "Isaac Thomas",
      status: "ACTIVE",
      created: "2024-10-18",
      lastSignIn: "2024-10-30",
    },
    {
      username: "julia.martinez",
      email: "julia.martinez@example.com",
      name: "Julia Martinez",
      status: "INACTIVE",
      created: "2024-10-25",
      lastSignIn: "2024-10-20",
    },
    {
      username: "kevin.anderson",
      email: "kevin.anderson@example.com",
      name: "Kevin Anderson",
      status: "ACTIVE",
      created: "2024-11-01",
      lastSignIn: "2024-11-03",
    },
    {
      username: "laura.taylor",
      email: "laura.taylor@example.com",
      name: "Laura Taylor",
      status: "INACTIVE",
      created: "2024-11-02",
      lastSignIn: "2024-11-02",
    },
    {
      username: "michael.white",
      email: "michael.white@example.com",
      name: "Michael White",
      status: "ACTIVE",
      created: "2024-11-03",
      lastSignIn: "2024-11-03",
    },
  ];

  const itemsPerPage = 10;
  let currentPage = 1;
  let filteredUsers = [...dummyUsers];

  function getStatusBadgeColor(status) {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(start, end);

    const tableBody = document.getElementById("users-table-body");
    const noResults = document.getElementById("no-results");

    if (paginatedUsers.length === 0) {
      tableBody.innerHTML = "";
      noResults.classList.remove("hidden");
      document.getElementById("prev-btn").disabled = true;
      document.getElementById("next-btn").disabled = true;
      return;
    }

    noResults.classList.add("hidden");

    tableBody.innerHTML = paginatedUsers
      .map(
        (user) => `
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${
              user.username
            }</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${
              user.email
            }</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${
              user.name
            }</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                user.status
              )}">
                ${user.status}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${
              user.created
            }</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${
              user.lastSignIn
            }</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
              <button class="text-red-600 hover:text-red-900 font-medium">View</button>
            </td>
          </tr>
        `
      )
      .join("");

    // Update pagination info
    document.getElementById("results-from").textContent = start + 1;
    document.getElementById("results-to").textContent = Math.min(
      end,
      filteredUsers.length
    );
    document.getElementById("results-total").textContent = filteredUsers.length;
    document.getElementById("page-info").textContent = `Page ${currentPage}`;

    // Update button states
    document.getElementById("prev-btn").disabled = currentPage === 1;
    document.getElementById("next-btn").disabled = end >= filteredUsers.length;
  }

  function filterUsers() {
    const searchTerm = document
      .getElementById("search-input")
      .value.toLowerCase();
    const statusFilter = document.getElementById("status-filter").value;

    filteredUsers = dummyUsers.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.name.toLowerCase().includes(searchTerm);
      const matchesStatus = !statusFilter || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    currentPage = 1;
    renderTable();
  }

  // Event listeners
  document
    .getElementById("search-input")
    .addEventListener("input", filterUsers);
  document
    .getElementById("status-filter")
    .addEventListener("change", filterUsers);

  document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    const maxPage = Math.ceil(filteredUsers.length / itemsPerPage);
    if (currentPage < maxPage) {
      currentPage++;
      renderTable();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // Initial render
  renderTable();
}

// Initialize all functionality when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  initProfileMenu();
  initDropdownFunctionality();
  initSidebar();
  initUserPoolTable();
});
