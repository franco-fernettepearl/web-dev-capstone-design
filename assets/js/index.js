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

    // Handle logout submit: redirect to index.html
    const logoutForm = profileMenu.querySelector("form");
    if (logoutForm) {
      logoutForm.addEventListener("submit", function (e) {
        e.preventDefault();
        closeMenu();
        window.location.href = "index.html";
      });
    }
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
  // Only run on pages that have the users table
  const tableBodyCheck = document.getElementById("users-table-body");
  if (!tableBodyCheck) return;
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
  const searchEl = document.getElementById("search-input");
  const statusEl = document.getElementById("status-filter");
  if (searchEl) searchEl.addEventListener("input", filterUsers);
  if (statusEl) statusEl.addEventListener("change", filterUsers);

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

  if (nextBtn)
    nextBtn.addEventListener("click", () => {
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

// Add User form functionality (for addUser.html)
function initAddUserForm() {
  const form = document.getElementById("add-user-form");
  // Run only on Add User page
  if (!form) return;

  const inviteRadios = document.querySelectorAll('input[name="inviteMode"]');
  const inviteOptions = document.getElementById("invite-options");
  const tempPasswordOptions = document.getElementById("temp-password-options");

  function updateMode() {
    const mode = [...inviteRadios].find((r) => r.checked)?.value || "invite";
    const isInvite = mode === "invite";
    if (inviteOptions) inviteOptions.classList.toggle("hidden", !isInvite);
    if (tempPasswordOptions)
      tempPasswordOptions.classList.toggle("hidden", isInvite);
  }

  inviteRadios.forEach((r) => r.addEventListener("change", updateMode));
  updateMode();

  // Optional dynamic attributes support (only if elements exist)
  const addAttrBtn = document.getElementById("add-attr");
  const attrList = document.getElementById("attributes-list");
  function addAttributeRow(name = "", value = "") {
    if (!attrList) return;
    const row = document.createElement("div");
    row.className = "grid grid-cols-1 md:grid-cols-12 gap-3 items-end";
    row.innerHTML = `
      <div class="md:col-span-5">
        <label class="block text-sm font-medium text-gray-700">Attribute name</label>
        <input type="text" name="attr_name" placeholder="e.g. custom:department" value="${name}"
          class="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500" />
      </div>
      <div class="md:col-span-6">
        <label class="block text-sm font-medium text-gray-700">Value</label>
        <input type="text" name="attr_value" placeholder="e.g. Engineering" value="${value}"
          class="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500" />
      </div>
      <div class="md:col-span-1 flex md:justify-end">
        <button type="button" class="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 remove-attr" title="Remove">Remove</button>
      </div>`;
    const removeBtn = row.querySelector(".remove-attr");
    if (removeBtn) removeBtn.addEventListener("click", () => row.remove());
    attrList.appendChild(row);
  }
  if (addAttrBtn) addAttrBtn.addEventListener("click", () => addAttributeRow());

  // Secure password generator
  function generateSecurePassword(length = 16) {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const symbols = "!@#$%^&*()-_=+[]{};:,.<>?";
    const all = upper + lower + digits + symbols;
    let pwd = [
      upper[Math.floor(Math.random() * upper.length)],
      lower[Math.floor(Math.random() * lower.length)],
      digits[Math.floor(Math.random() * digits.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ];
    const remaining = length - pwd.length;
    if (window.crypto && window.crypto.getRandomValues) {
      const randomValues = new Uint32Array(remaining);
      window.crypto.getRandomValues(randomValues);
      for (let i = 0; i < remaining; i++) {
        pwd.push(all[randomValues[i] % all.length]);
      }
    } else {
      for (let i = 0; i < remaining; i++) {
        pwd.push(all[Math.floor(Math.random() * all.length)]);
      }
    }
    for (let i = pwd.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pwd[i], pwd[j]] = [pwd[j], pwd[i]];
    }
    return pwd.join("");
  }

  const genBtn = document.getElementById("generate-temp-password");
  if (genBtn)
    genBtn.addEventListener("click", () => {
      const input = document.getElementById("temp_password");
      if (!input) return;
      const pwd = generateSecurePassword(16);
      input.value = pwd;
      const tempRadio = [...inviteRadios].find((r) => r.value === "temp");
      if (tempRadio && !tempRadio.checked) {
        tempRadio.checked = true;
        updateMode();
      }
      input.classList.add("ring-2", "ring-green-400");
      setTimeout(() => input.classList.remove("ring-2", "ring-green-400"), 600);
    });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = (document.getElementById("email")?.value || "").trim();
    const phone = (document.getElementById("phone")?.value || "").trim();
    const mode = [...inviteRadios].find((r) => r.checked)?.value || "invite";
    const tempPassword = (
      document.getElementById("temp_password")?.value || ""
    ).trim();
    if (!email && !phone) {
      alert("Please provide at least an email or a phone number.");
      return;
    }
    if (mode === "temp" && tempPassword.length < 8) {
      alert("Temporary password must be at least 8 characters.");
      return;
    }
    const attrs = [];
    const names = form.querySelectorAll('input[name="attr_name"]');
    const values = form.querySelectorAll('input[name="attr_value"]');
    names.forEach((n, i) => {
      const key = (n.value || "").trim();
      const val = (values[i]?.value || "").trim();
      if (key && val) attrs.push({ name: key, value: val });
    });
    const payload = {
      username: (document.getElementById("username")?.value || "").trim(),
      email,
      phone,
      given_name: (document.getElementById("given_name")?.value || "").trim(),
      family_name: (document.getElementById("family_name")?.value || "").trim(),
      inviteMode: mode,
      delivery:
        document.querySelector('input[name="delivery"]:checked')?.value ||
        "email",
      temp_password: tempPassword,
      require_reset: document.getElementById("require_reset")?.checked ?? true,
      email_verified:
        document.getElementById("email_verified")?.checked ?? false,
      phone_verified:
        document.getElementById("phone_verified")?.checked ?? false,
      attributes: attrs,
    };
    console.log("Create user payload:", payload);
    alert(
      "User would be created with these details. Check console for payload."
    );
  });
}

// Initialize all functionality when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  initProfileMenu();
  initDropdownFunctionality();
  initSidebar();
  initUserPoolTable();
  initAddUserForm();
  initAppClientManagement();
});

// App Client management (for appclient.html)
function initAppClientManagement() {
  // Cache DOM elements used by this feature
  const tableBody = document.getElementById("appclients-table-body");
  const openBtn = document.getElementById("open-create-client-modal");
  const modal = document.getElementById("create-client-modal");
  const overlay = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("close-create-client-modal");
  const cancelBtn = document.getElementById("cancel-create-client");
  const form = document.getElementById("create-client-form");

  if (!tableBody && !openBtn) return; // Only run on appclient page

  const els = {
    tableBody,
    openBtn,
    modal,
    overlay,
    closeBtn,
    cancelBtn,
    form,
    search: document.getElementById("appclients-search"),
    prev: document.getElementById("appclients-prev-btn"),
    next: document.getElementById("appclients-next-btn"),
    noResults: document.getElementById("appclients-no-results"),
    resultsFrom: document.getElementById("appclients-results-from"),
    resultsTo: document.getElementById("appclients-results-to"),
    resultsTotal: document.getElementById("appclients-results-total"),
    pageInfo: document.getElementById("appclients-page-info"),
    idRow: document.getElementById("client_id_row"),
    inputs: {
      id: document.getElementById("client_id"),
      name: document.getElementById("client_name"),
      callbacks: document.getElementById("callback_urls"),
      logouts: document.getElementById("logout_urls"),
      scopes: document.querySelectorAll('input[name="scopes"]'),
      submit: document.getElementById("client-submit-btn"),
    },
  };

  // Dummy clients data
  const clients = [
    {
      name: "Admission System",
      clientId: "as-ewfc2mewf",
      created: "2024-06-22",
      lastUsed: "2024-10-28",
      callbacks: "puptas.com",
      logouts: "",
      scopes: "openid profile",
      secret: undefined,
    },
  ];

  let filtered = [...clients];
  const itemsPerPage = 10;
  let currentPage = 1;

  function generateId(prefix = "app", length = 8) {
    const chars = "abcdef0123456789";
    const arr = new Uint32Array(length);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(arr);
    } else {
      for (let i = 0; i < length; i++) arr[i] = Math.floor(Math.random() * 16);
    }
    let out = "";
    for (let i = 0; i < length; i++) out += chars[arr[i] % chars.length];
    return `${prefix}-${out}`;
  }

  function generateSecret(length = 40) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_~.";
    const arr = new Uint32Array(length);
    if (window.crypto && window.crypto.getRandomValues)
      window.crypto.getRandomValues(arr);
    return Array.from({ length }, (_, i) => chars[arr[i] % chars.length]).join(
      ""
    );
  }

  function updateMeta(start, end) {
    if (els.resultsFrom) els.resultsFrom.textContent = String(start + 1);
    if (els.resultsTo)
      els.resultsTo.textContent = String(Math.min(end, filtered.length));
    if (els.resultsTotal) els.resultsTotal.textContent = String(filtered.length);
    if (els.pageInfo) els.pageInfo.textContent = `Page ${currentPage}`;
    if (els.prev) els.prev.disabled = currentPage === 1;
    if (els.next) els.next.disabled = end >= filtered.length;
  }

  function render() {
    if (!els.tableBody) return;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filtered.slice(start, end);

    if (pageItems.length === 0) {
      els.tableBody.innerHTML = "";
      if (els.noResults) els.noResults.classList.remove("hidden");
      if (els.prev) els.prev.disabled = true;
      if (els.next) els.next.disabled = true;
      if (els.resultsFrom) els.resultsFrom.textContent = "0";
      if (els.resultsTo) els.resultsTo.textContent = "0";
      if (els.resultsTotal)
        els.resultsTotal.textContent = String(filtered.length);
      if (els.pageInfo) els.pageInfo.textContent = `Page ${currentPage}`;
      return;
    }

    if (els.noResults) els.noResults.classList.add("hidden");

    els.tableBody.innerHTML = pageItems
      .map(
        (c) => `
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${c.name}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${c.clientId}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${c.created}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${c.lastUsed}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
            <button data-action="view" data-id="${c.clientId}" class="text-red-600 hover:text-red-900 mr-3" aria-label="View" title="View">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" />
              </svg>
            </button>
            <button data-action="edit" data-id="${c.clientId}" class="text-red-600 hover:text-red-900 mr-3" aria-label="Edit" title="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M4 17.25V20h2.75L17.81 8.94l-2.75-2.75L4 17.25Zm14.71-9.04a1.003 1.003 0 0 0 0-1.42l-1.5-1.5a1.003 1.003 0 0 0-1.42 0l-1.12 1.12 2.75 2.75 1.29-1.29Z" />
              </svg>
            </button>
            <button data-action="delete" data-id="${c.clientId}" class="text-gray-600 hover:text-gray-900" aria-label="Delete" title="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M6 7h12v2H6V7Zm1 3h10l-1 9H8l-1-9Zm3-5h4v1H10V5Z" />
              </svg>
            </button>
          </td>
        </tr>
      `
      )
      .join("");

    updateMeta(start, end);
  }

  function applyFilter() {
    const q = (
      document.getElementById("appclients-search")?.value || ""
    ).toLowerCase();
    filtered = clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.clientId.toLowerCase().includes(q)
    );
    currentPage = 1;
  }

  // Search input
  if (els.search) {
    els.search.addEventListener("input", () => {
      applyFilter();
      render();
    });
  }

  // Pagination
  if (els.prev)
    els.prev.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  if (els.next)
    els.next.addEventListener("click", () => {
      const maxPage = Math.ceil(filtered.length / itemsPerPage);
      if (currentPage < maxPage) {
        currentPage++;
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

  // Modal helpers
  function openModal() {
    if (els.overlay) els.overlay.classList.remove("hidden");
    if (els.modal) els.modal.classList.remove("hidden");
  }
  function closeModal() {
    if (els.overlay) els.overlay.classList.add("hidden");
    if (els.modal) els.modal.classList.add("hidden");
  }

  if (els.openBtn) els.openBtn.addEventListener("click", () => openForCreate());
  if (els.closeBtn) els.closeBtn.addEventListener("click", closeModal);
  if (els.cancelBtn) els.cancelBtn.addEventListener("click", closeModal);
  if (els.overlay) els.overlay.addEventListener("click", closeModal);

  // Modal modes
  let currentMode = "create";
  let currentId = null;

  function setFormDisabled(disabled) {
    if (!els.form) return;
    Array.from(els.form.elements).forEach((el) => {
      const elem = el;
      if (elem.id === "cancel-create-client" || elem.id === "client-submit-btn")
        return;
      if (elem.id === "client_id") {
        elem.readOnly = true;
        return;
      }
      if (
        elem.type === "radio" ||
        elem.type === "checkbox" ||
        elem.tagName === "INPUT" ||
        elem.tagName === "TEXTAREA"
      ) {
        elem.disabled = disabled;
      }
    });
  }

  function fillFormFromClient(c) {
    if (els.inputs.id) els.inputs.id.value = c.clientId;
    if (els.inputs.name) els.inputs.name.value = c.name || "";
    if (els.inputs.callbacks) els.inputs.callbacks.value = c.callbacks || "";
    if (els.inputs.logouts) els.inputs.logouts.value = c.logouts || "";
    // flows are fixed to Authorization Code ('code') for all clients
    const currentScopes = (c.scopes || "").split(/[\s,]+/).filter(Boolean);
    document.querySelectorAll('input[name="scopes"]').forEach((cb) => {
      cb.checked = currentScopes.includes(cb.value);
    });
  }

  function clearForm() {
    els.form?.reset();
    if (els.idRow) els.idRow.classList.add("hidden");
  }

  function openForCreate() {
    currentMode = "create";
    currentId = null;
    clearForm();
    setFormDisabled(false);
    if (els.inputs.submit) {
      els.inputs.submit.textContent = "Create";
      els.inputs.submit.classList.remove("hidden");
    }
    openModal();
  }

  function openForEdit(c) {
    currentMode = "edit";
    currentId = c.clientId;
    if (els.idRow) els.idRow.classList.remove("hidden");
    setFormDisabled(false);
    fillFormFromClient(c);
    if (els.inputs.submit) {
      els.inputs.submit.textContent = "Save";
      els.inputs.submit.classList.remove("hidden");
    }
    openModal();
  }

  function openForView(c) {
    currentMode = "view";
    currentId = c.clientId;
    if (els.idRow) els.idRow.classList.remove("hidden");
    fillFormFromClient(c);
    setFormDisabled(true);
    if (els.inputs.submit) els.inputs.submit.classList.add("hidden");
    openModal();
  }

  // Form submission (create/save)
  // Event delegation for row actions to avoid re-wiring on every render
  if (els.tableBody) {
    els.tableBody.addEventListener("click", (e) => {
      const target = e.target.closest("button[data-action]");
      if (!target) return;
      const id = target.getAttribute("data-id");
      const action = target.getAttribute("data-action");
      const idx = clients.findIndex((c) => c.clientId === id);
      if (idx === -1) return;
      if (action === "view") {
        openForView(clients[idx]);
      } else if (action === "edit") {
        openForEdit(clients[idx]);
      } else if (action === "delete") {
        if (confirm("Delete this app client?")) {
          clients.splice(idx, 1);
          applyFilter();
          const maxPage = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
          if (currentPage > maxPage) currentPage = maxPage;
          render();
        }
      }
    });
  }

  if (els.form)
    els.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (els.inputs.name?.value || "").trim();
      if (!name) {
        alert("Please provide a client name.");
        return;
      }
      const callbacksRaw = els.inputs.callbacks?.value || "";
      const logoutRaw = els.inputs.logouts?.value || "";
      const scopesSelected = Array.from(
        document.querySelectorAll('input[name="scopes"]:checked')
      ).map((el) => el.value);
      const flows = ["code"];
      const scopes = scopesSelected;

      if (currentMode === "create") {
        const clientId = generateId("conf");
        const secret = generateSecret(48);
        clients.unshift({
          name,
          clientId,
          type: "Confidential",
          flows: flows.join(", "),
          created: new Date().toISOString().slice(0, 10),
          lastUsed: "-",
          callbacks: callbacksRaw,
          logouts: logoutRaw,
          scopes: scopes.join(" "),
          secret,
        });
        closeModal();
        applyFilter();
        render();
        alert(
          `App client created.\nName: ${name}\nClient ID: ${clientId}\nClient Secret: ${secret}`
        );
      } else if (currentMode === "edit" && currentId) {
        const idx = clients.findIndex((c) => c.clientId === currentId);
        if (idx !== -1) {
          clients[idx].name = name;
          clients[idx].callbacks = callbacksRaw;
          clients[idx].logouts = logoutRaw;
          clients[idx].flows = flows.join(", ");
          clients[idx].scopes = scopes.join(" ");
        }
        closeModal();
        applyFilter();
        render();
      }
    });

  // Initial render
  applyFilter();
  render();
}
