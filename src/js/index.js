const DATA_URL = `${import.meta.env.BASE_URL}data/db.json`;

const loadBtn = document.getElementById("loadBtn");
const tableWrapper = document.getElementById("tableWrapper");
const transactionsTable = document.getElementById("transactionsTable");
const transactionsBody = document.getElementById("transactionsBody");
const transactionStatus = document.getElementById("transactionStatus");
const searchInput = document.getElementById("searchInput");
const sortButtons = document.querySelectorAll(".btn-sort");
const sortHeaders = document.querySelectorAll("th[data-column]");

let currentSort = { sort: null, order: "asc" };
let searchTimeout = null;
let activeRequest = null;

function showStatus(state, message) {
  transactionStatus.className = `${state}-state`;
  transactionStatus.textContent = message;
  transactionStatus.hidden = !message;
}

async function fetchTransactions() {
  clearTimeout(searchTimeout);
  activeRequest?.abort();
  const controller = new AbortController();
  activeRequest = controller;

  const referenceId = searchInput.value.trim().replace(/[۰-۹٠-٩]/g, (digit) =>
    String(digit.charCodeAt(0) % 16),
  );

  transactionsBody.replaceChildren();
  transactionsTable.hidden = true;
  tableWrapper.setAttribute("aria-busy", "true");
  loadBtn.disabled = true;
  loadBtn.textContent = "در حال بارگذاری...";
  showStatus("loading", "در حال دریافت تراکنش‌ها...");

  try {
    const response = await fetch(DATA_URL, { signal: controller.signal });
    if (!response.ok) throw new Error("Request failed");

    const data = await response.json();
    if (activeRequest !== controller || controller.signal.aborted) return;
    if (!Array.isArray(data.transactions)) throw new Error("Invalid transactions");

    let transactions = data.transactions;

    if (referenceId) {
      transactions = transactions.filter((transaction) =>
        String(transaction.refId).includes(referenceId),
      );
    }

    if (currentSort.sort) {
      const direction = currentSort.order === "asc" ? 1 : -1;
      transactions = [...transactions].sort((first, second) =>
        (Number(first[currentSort.sort]) - Number(second[currentSort.sort])) * direction,
      );
    }

    renderTable(transactions);
  } catch (error) {
    if (activeRequest !== controller || controller.signal.aborted) return;
    showStatus("error", "دریافت تراکنش‌ها ناموفق بود. لطفاً دوباره تلاش کنید.");
  } finally {
    if (activeRequest === controller) {
      tableWrapper.setAttribute("aria-busy", "false");
      loadBtn.disabled = false;
      loadBtn.textContent = "بارگذاری تراکنش‌ها";
      activeRequest = null;
    }
  }
}

function formatPrice(price) {
  return `${Number(price).toLocaleString("fa-IR")} تومان`;
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function renderTable(transactions) {
  const rows = document.createDocumentFragment();

  transactions.forEach((transaction, index) => {
    const row = document.createElement("tr");
    const isIncoming = transaction.type === "افزایش اعتبار";
    row.className = isIncoming ? "transaction-income" : "transaction-expense";

    const values = [
      (index + 1).toLocaleString("fa-IR"),
      transaction.type,
      formatPrice(transaction.price),
      transaction.refId,
      formatDate(transaction.date),
    ];

    values.forEach((value, columnIndex) => {
      const cell = document.createElement("td");
      cell.textContent = String(value);
      if (columnIndex === 1) {
        cell.className = isIncoming ? "type-income" : "type-expense";
      }
      row.appendChild(cell);
    });

    rows.appendChild(row);
  });

  transactionsBody.replaceChildren(rows);
  transactionsTable.hidden = false;
  showStatus("empty", transactions.length ? "" : "نتیجه‌ای یافت نشد.");
}

// Open before the existing loading handler disables the button.
loadBtn.addEventListener("click", () => {
  document.getElementById("transactionsDialog").showModal();
}, { capture: true });

loadBtn.addEventListener("click", fetchTransactions);

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  activeRequest?.abort();
  searchTimeout = setTimeout(fetchTransactions, 400);
});

sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const sort = button.dataset.sort;
    const order = currentSort.sort === sort && currentSort.order === "asc"
      ? "desc"
      : "asc";
    currentSort = { sort, order };

    sortButtons.forEach((sortButton) => {
      const isActive = sortButton === button;
      const buttonOrder = isActive ? order : "asc";
      const label = sortButton.dataset.sort === "price" ? "مبلغ" : "تاریخ";
      sortButton.classList.toggle("active", isActive);
      sortButton.setAttribute("aria-pressed", String(isActive));
      sortButton.dataset.order = buttonOrder;
      sortButton.textContent = `${label} ${buttonOrder === "asc" ? "صعودی ↑" : "نزولی ↓"}`;
    });

    sortHeaders.forEach((header) => {
      header.setAttribute("aria-sort", header.dataset.column === sort
        ? (order === "asc" ? "ascending" : "descending")
        : "none");
    });

    fetchTransactions();
  });
});
