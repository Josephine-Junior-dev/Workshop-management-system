import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

/* =========================================================
   GARAGE OPERATIONS PRO
   COMPLETE APP.JS
   MATCHED TO CURRENT INDEX.HTML
   ========================================================= */


/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL =
  "https://ptluwoeogfkqavhspdjj.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_wDsWINauH0jX9rezsEwczw_RovrM6Nv";

const sb = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);


/* =========================================================
   DOM HELPER
   ========================================================= */

const $ = id =>
  document.getElementById(id);


/* =========================================================
   DATA
   ========================================================= */

let vehicles = [];
let expenses = [];
let petty = [];
let requisitions = [];

let currentUser = "";


/* =========================================================
   LOGIN USERS
   ========================================================= */

const USERS = {
  username: "1234",
  Josephine: "1234",
  Boss: "1234",
  Staff: "1234"
};


/* =========================================================
   HELPERS
   ========================================================= */

function money(value) {

  return (
    "KSh " +
    Number(value || 0).toLocaleString(
      "en-KE",
      {
        maximumFractionDigits: 0
      }
    )
  );

}


function todayISO() {

  return new Date()
    .toISOString()
    .slice(0, 10);

}


function esc(value) {

  return String(value ?? "")
    .replace(
      /[&<>"']/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[character])
    );

}


function toast(message) {

  const box = $("toast");

  if (!box) {

    console.log(message);

    return;
  }

  box.textContent = message;
  box.style.display = "block";

  clearTimeout(
    window.__garageToast
  );

  window.__garageToast =
    setTimeout(() => {

      box.style.display = "none";

    }, 3000);

}


/* =========================================================
   USER
   ========================================================= */

function setUser(username) {

  currentUser = username;

  document
    .querySelectorAll(".top-user b")
    .forEach(element => {

      element.textContent =
        username;

    });

}


/* =========================================================
   COMPACT PROFESSIONAL DASHBOARD
   Does not change HTML structure.
   ========================================================= */

function applyDashboardPolish() {

  if ($("garageCompactStyle")) {
    return;
  }

  const style =
    document.createElement("style");

  style.id =
    "garageCompactStyle";

  style.textContent = `

    /* -----------------------------------------------------
       DASHBOARD COMPACT MODE
       ----------------------------------------------------- */

    #dashboard .summary-grid {
      gap: 12px !important;
    }

    #dashboard .summary {
      min-height: 118px !important;
      padding: 16px !important;
    }

    #dashboard .summary strong {
      font-size: 25px !important;
    }

    #dashboard .summary em {
      font-size: 11px !important;
    }

    #dashboard .dash-grid,
    #dashboard .dash-grid {
      gap: 14px !important;
    }

    #dashboard .panel {
      padding: 16px !important;
    }

    #dashboard .panel-title {
      margin-bottom: 10px !important;
    }

    #dashboard .panel-title h2 {
      font-size: 15px !important;
    }

    #dashboard .panel-title small {
      font-size: 11px !important;
    }

    #dashboard .chart-panel,
    #dashboard .status-panel {
      min-height: 230px !important;
    }

    #dashboard .activity-row {
      padding: 9px 4px !important;
      min-height: 40px !important;
    }

    #dashboard .quick .qa {
      padding: 10px 12px !important;
      margin-bottom: 7px !important;
    }

    /* clickable visual feedback */

    #dashboard .summary,
    #dashboard .qa,
    #dashboard .panel,
    .vehicle-click,
    .expense-row {
      transition:
        transform .15s ease,
        box-shadow .15s ease,
        border-color .15s ease;
    }

    #dashboard .summary:hover,
    #dashboard .qa:hover,
    .vehicle-click:hover,
    .expense-row:hover {
      transform: translateY(-1px);
    }

    /* status buttons */

    .status-select {
      width: 100%;
      padding: 11px 12px;
      border: 1px solid #d7dde5;
      border-radius: 10px;
      background: #fff;
      font-size: 14px;
      box-sizing: border-box;
    }

    .approved-badge {
      display:inline-block;
      padding:5px 9px;
      border-radius:999px;
      background:#e8f7ef;
      color:#13834f;
      font-size:11px;
      font-weight:700;
    }

    .pending-badge {
      display:inline-block;
      padding:5px 9px;
      border-radius:999px;
      background:#fff4df;
      color:#b56a00;
      font-size:11px;
      font-weight:700;
    }

    .rejected-badge {
      display:inline-block;
      padding:5px 9px;
      border-radius:999px;
      background:#fdecec;
      color:#c52d2d;
      font-size:11px;
      font-weight:700;
    }

    .paid-badge {
      display:inline-block;
      padding:5px 9px;
      border-radius:999px;
      background:#e9f0ff;
      color:#315fba;
      font-size:11px;
      font-weight:700;
    }

    .detail-label {
      display:block;
      color:#7a8491;
      font-size:11px;
      margin-bottom:3px;
    }

    .detail-value {
      display:block;
      font-weight:600;
      color:#18212b;
    }

  `;

  document.head.appendChild(style);

}


/* =========================================================
   LOGIN
   ========================================================= */

const loginForm =
  $("loginForm");

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      const username =
        $("username")
          .value
          .trim();

      const password =
        $("password")
          .value;

      if (
        !USERS[username] ||
        USERS[username] !== password
      ) {

        if ($("loginMsg")) {

          $("loginMsg").textContent =
            "Incorrect username or password.";

        }

        return;
      }

      setUser(username);

      if ($("loginMsg")) {

        $("loginMsg").textContent =
          "";

      }

      $("login")
        .classList
        .add("hidden");

      $("app")
        .classList
        .remove("hidden");

      updateDate();

      await loadData();

      showPage("dashboard");

    }
  );

}


/* =========================================================
   DATE
   ========================================================= */

function updateDate() {

  if (!$("today")) {
    return;
  }

  $("today").textContent =
    new Date().toLocaleDateString(
      "en-KE",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

if ($("logout")) {

  $("logout").addEventListener(
    "click",
    () => {

      $("app")
        .classList
        .add("hidden");

      $("login")
        .classList
        .remove("hidden");

      if ($("password")) {
        $("password").value = "";
      }

      currentUser = "";

    }
  );

}


/* =========================================================
   LOAD DATA
   ========================================================= */

async function loadData() {

  try {

    const [
      vehicleResult,
      expenseResult,
      pettyResult,
      requisitionResult
    ] = await Promise.all([

      sb
        .from("vehicles")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false
          }
        ),

      sb
        .from("expenses")
        .select("*")
        .order(
          "expense_date",
          {
            ascending: false
          }
        ),

      sb
        .from("petty_cash")
        .select("*")
        .order(
          "cash_date",
          {
            ascending: false
          }
        ),

      sb
        .from("requisitions")
        .select("*")
        .order(
          "req_date",
          {
            ascending: false
          }
        )

    ]);


    if (vehicleResult.error)
      console.error(
        "Vehicles:",
        vehicleResult.error
      );

    if (expenseResult.error)
      console.error(
        "Expenses:",
        expenseResult.error
      );

    if (pettyResult.error)
      console.error(
        "Petty cash:",
        pettyResult.error
      );

    if (requisitionResult.error)
      console.error(
        "Requisitions:",
        requisitionResult.error
      );


    vehicles =
      vehicleResult.data || [];

    expenses =
      expenseResult.data || [];

    petty =
      pettyResult.data || [];

    requisitions =
      requisitionResult.data || [];


    renderAll();

  } catch (error) {

    console.error(
      "Supabase load error:",
      error
    );

    toast(
      "Unable to load garage data."
    );

  }

}


/* =========================================================
   RENDER ALL
   ========================================================= */

function renderAll() {

  renderDashboard();
  renderVehicles();
  renderExpenses();
  renderPettyCash();
  renderRequisitions();

}


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function showPage(pageName) {

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove(
        "active-page"
      );

    });


  const page =
    $(pageName);

  if (page) {

    page.classList.add(
      "active-page"
    );

  }


  document
    .querySelectorAll(".nav")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.page ===
        pageName
      );

    });


  if (pageName === "dashboard")
    renderDashboard();

  if (pageName === "vehicles")
    renderVehicles();

  if (pageName === "expenses")
    renderExpenses();

  if (pageName === "petty")
    renderPettyCash();

  if (pageName === "requisitions")
    renderRequisitions();

}


/* =========================================================
   NAVIGATION
   ========================================================= */

document
  .querySelectorAll(".nav[data-page]")
  .forEach(button => {

    button.addEventListener(
      "click",
      event => {

        event.preventDefault();

        showPage(
          button.dataset.page
        );

      }
    );

  });


/* =========================================================
   DASHBOARD
   ========================================================= */

function renderDashboard() {

  const totalExpenses =
    expenses.reduce(
      (sum, item) =>
        sum +
        Number(item.amount || 0),
      0
    );


  const totalPetty =
    petty.reduce(
      (sum, item) =>
        sum +
        Number(item.amount || 0),
      0
    );


  const pendingRequests =
    requisitions.filter(
      item =>
        String(
          item.status || ""
        ).toLowerCase() ===
        "pending"
    ).length;


  const repair =
    vehicles.filter(
      item =>
        item.status ===
        "Under Repair"
    ).length;


  const active =
    vehicles.filter(
      item =>
        item.status === "Completed" ||
        item.status === "Released"
    ).length;


  const out =
    vehicles.filter(
      item =>
        item.status ===
        "Storage"
    ).length;


  if ($("dashVehicles"))
    $("dashVehicles").textContent =
      vehicles.length;

  if ($("dashActive"))
    $("dashActive").textContent =
      active;

  if ($("dashRepair"))
    $("dashRepair").textContent =
      repair;

  if ($("dashExpenses"))
    $("dashExpenses").textContent =
      money(totalExpenses);

  if ($("dashPetty"))
    $("dashPetty").textContent =
      money(totalPetty);

  if ($("dashReq"))
    $("dashReq").textContent =
      pendingRequests;


  if ($("reportExpenses"))
    $("reportExpenses").textContent =
      money(totalExpenses);

  if ($("reportFleet"))
    $("reportFleet").textContent =
      vehicles.length;

  if ($("reportPetty"))
    $("reportPetty").textContent =
      money(totalPetty);

  if ($("reportReq"))
    $("reportReq").textContent =
      pendingRequests;

  if ($("pettyPage"))
    $("pettyPage").textContent =
      money(totalPetty);


  renderDonut(
    active,
    repair,
    out
  );

  renderExpenseChart();

  renderActivity();

}


/* =========================================================
   DONUT
   ========================================================= */

function renderDonut(
  active,
  repair,
  out
) {

  const donut =
    $("donut");

  if (!donut)
    return;


  const total =
    active +
    repair +
    out;


  if (!total) {

    donut.style.background =
      "#e5e7eb";

  } else {

    const activePercent =
      active / total * 100;

    const repairPercent =
      repair / total * 100;


    donut.style.background =
      `conic-gradient(
        #16a36a 0 ${activePercent}%,
        #f79009 ${activePercent}% ${activePercent + repairPercent}%,
        #ef4444 ${activePercent + repairPercent}% 100%
      )`;

  }


  if ($("donutTotal"))
    $("donutTotal").textContent =
      vehicles.length;

  if ($("activeLegend"))
    $("activeLegend").textContent =
      active;

  if ($("repairLegend"))
    $("repairLegend").textContent =
      repair;

  if ($("outLegend"))
    $("outLegend").textContent =
      out;

}


/* =========================================================
   EXPENSE CHART
   ========================================================= */

function renderExpenseChart() {

  const chart =
    $("expenseChart");

  if (!chart)
    return;


  const months = [
    "Jan","Feb","Mar","Apr",
    "May","Jun","Jul","Aug",
    "Sep","Oct","Nov","Dec"
  ];


  const year =
    new Date().getFullYear();


  const values =
    months.map(
      (_, index) => {

        return expenses
          .filter(item => {

            const date =
              new Date(
                item.expense_date ||
                item.created_at
              );

            return (
              date.getFullYear() === year &&
              date.getMonth() === index
            );

          })
          .reduce(
            (sum, item) =>
              sum +
              Number(item.amount || 0),
            0
          );

      }
    );


  const max =
    Math.max(...values, 1);


  chart.innerHTML =
    values
      .map(
        (value, index) => {

          const height =
            Math.max(
              5,
              value / max * 100
            );


          return `
            <div
              class="bar-wrap"
              data-month="${index}"
              style="
                height:100%;
                cursor:pointer;
              "
              title="${months[index]} — ${money(value)}"
            >

              <div
                class="bar"
                style="height:${height}%"
              ></div>

              <span class="bar-label">
                ${months[index]}
              </span>

            </div>
          `;

        }
      )
      .join("");


  chart
    .querySelectorAll(".bar-wrap")
    .forEach(bar => {

      bar.addEventListener(
        "click",
        () => {

          showPage("expenses");

        }
      );

    });

}


/* =========================================================
   RECENT ACTIVITY
   ========================================================= */

function renderActivity() {

  const box =
    $("activityList");

  if (!box)
    return;


  const activities = [];


  expenses
    .slice(0, 4)
    .forEach(item => {

      activities.push({

        type: "expense",
        id: item.id,
        text:
          item.description ||
          "Expense",
        value:
          money(item.amount)

      });

    });


  requisitions
    .slice(0, 4)
    .forEach(item => {

      activities.push({

        type: "requisition",
        id: item.id,
        text:
          item.req_no ||
          "Requisition",
        value:
          item.status ||
          "Pending"

      });

    });


  if (!activities.length) {

    box.innerHTML =
      "<p>No recent activity.</p>";

    return;

  }


  box.innerHTML =
    activities
      .slice(0, 6)
      .map(
        item => `

          <div
            class="activity-row"
            data-type="${esc(item.type)}"
            data-id="${esc(item.id)}"
            style="cursor:pointer"
          >

            <span class="activity-icon">
              ◈
            </span>

            <b>
              ${esc(item.text)}
            </b>

            <small>
              ${esc(item.value)}
            </small>

          </div>

        `
      )
      .join("");


  box
    .querySelectorAll(".activity-row")
    .forEach(row => {

      row.addEventListener(
        "click",
        () => {

          openRecord(
            row.dataset.type,
            row.dataset.id
          );

        }
      );

    });

}


/* =========================================================
   VEHICLES
   ========================================================= */

function renderVehicles() {

  const list =
    $("list");

  if (!list)
    return;


  const search =
    (
      $("search")?.value ||
      ""
    )
      .trim()
      .toLowerCase();


  const filter =
    $("filter")?.value ||
    "";


  const filtered =
    vehicles.filter(
      vehicle => {

        const reg =
          String(
            vehicle.registration ||
            ""
          ).toLowerCase();

        const customer =
          String(
            vehicle.customer ||
            ""
          ).toLowerCase();


        return (
          (
            !search ||
            reg.includes(search) ||
            customer.includes(search)
          ) &&
          (
            !filter ||
            vehicle.status === filter
          )
        );

      }
    );


  if (!filtered.length) {

    list.innerHTML = `
      <div
        style="
          padding:30px;
          text-align:center;
        "
      >
        <p>No vehicles found.</p>
      </div>
    `;

    return;

  }


  list.innerHTML =
    filtered
      .map(vehicle =>
        vehicleCard(vehicle)
      )
      .join("");


  list
    .querySelectorAll(".vehicle-click")
    .forEach(card => {

      card.addEventListener(
        "click",
        event => {

          if (
            event.target.closest("button")
          ) {
            return;
          }

          openVehicleDetails(
            card.dataset.id
          );

        }
      );

    });


  /*
   * Search such as KBN:
   * display matching vehicle and
   * its expenses directly below.
   */

  if (search) {

    const matchedVehicle =
      filtered.find(
        vehicle =>
          String(
            vehicle.registration ||
            ""
          )
            .toLowerCase()
            .includes(search)
      );


    if (matchedVehicle) {

      list.insertAdjacentHTML(
        "beforeend",
        vehicleExpensesHTML(
          matchedVehicle
        )
      );


      list
        .querySelectorAll(
          "[data-searched-expense]"
        )
        .forEach(row => {

          row.addEventListener(
            "click",
            () => {

              openExpenseDetails(
                row.dataset.searchedExpense
              );

            }
          );

        });

    }

  }

}


/* =========================================================
   VEHICLE CARD
   ========================================================= */

function vehicleCard(vehicle) {

  const vehicleExpenses =
    getVehicleExpenses(
      vehicle.id
    );


  const expenseTotal =
    vehicleExpenses.reduce(
      (sum, item) =>
        sum +
        Number(item.amount || 0),
      0
    );


  const billed =
    Number(vehicle.billed || 0);

  const paid =
    Number(vehicle.paid || 0);

  const outstanding =
    Math.max(
      0,
      billed - paid
    );


  return `
    <article
      class="vehicle vehicle-click"
      data-id="${esc(vehicle.id)}"
      style="cursor:pointer"
    >

      <div class="vehicle-top">

        <div>

          <h3>
            ${esc(
              vehicle.registration
            )}
          </h3>

          <span class="muted">
            ${esc(
              vehicle.customer
            )}
            •
            ${esc(
              vehicle.date_in || ""
            )}
          </span>

        </div>

        <span class="badge">
          ${esc(
            vehicle.status || ""
          )}
        </span>

      </div>


      <p class="muted">
        ${esc(
          vehicle.description ||
          "No description"
        )}
      </p>


      <div class="grid">

        <div>
          <small>Expenses</small>
          <b>
            ${money(expenseTotal)}
          </b>
        </div>

        <div>
          <small>Charge-out</small>
          <b>
            ${money(billed)}
          </b>
        </div>

        <div>
          <small>Paid</small>
          <b>
            ${money(paid)}
          </b>
        </div>

        <div>
          <small>Outstanding</small>
          <b>
            ${money(outstanding)}
          </b>
        </div>

      </div>


      <div class="actions">

        <button
          onclick="
            window.addVehicleExpense(
              '${esc(vehicle.id)}'
            )
          "
        >
          + Expense
        </button>

        <button
          class="secondary"
          onclick="
            window.editVehicle(
              '${esc(vehicle.id)}'
            )
          "
        >
          Edit
        </button>

        <button
          class="secondary"
          onclick="
            window.deleteVehicle(
              '${esc(vehicle.id)}'
            )
          "
        >
          Delete
        </button>

      </div>

    </article>
  `;

}


/* =========================================================
   VEHICLE EXPENSES
   ========================================================= */

function vehicleExpensesHTML(vehicle) {

  const list =
    getVehicleExpenses(
      vehicle.id
    );


  const total =
    list.reduce(
      (sum, item) =>
        sum +
        Number(item.amount || 0),
      0
    );


  return `
    <section
      class="panel"
      style="margin-top:16px"
    >

      <div class="panel-title">

        <div>

          <h2>
            ${esc(vehicle.registration)}
            — Related Expenses
          </h2>

          <small>
            ${list.length}
            expense record${list.length === 1 ? "" : "s"}
          </small>

        </div>

        <strong>
          ${money(total)}
        </strong>

      </div>


      ${
        list.length
          ? list
              .map(
                expense => `
                  <div
                    class="expense-row"
                    data-searched-expense="${esc(expense.id)}"
                    style="cursor:pointer"
                  >

                    <span>

                      <b>
                        ${esc(
                          expense.description ||
                          "Expense"
                        )}
                      </b>

                      <small class="muted">
                        ${esc(
                          expense.expense_date ||
                          ""
                        )}
                        •
                        ${esc(
                          expense.category ||
                          ""
                        )}
                      </small>

                    </span>

                    <b>
                      ${money(
                        expense.amount
                      )}
                    </b>

                  </div>
                `
              )
              .join("")
          : `
              <p style="padding:10px">
                No expenses recorded for this vehicle.
              </p>
            `
      }

    </section>
  `;

}


/* =========================================================
   GET VEHICLE EXPENSES
   ========================================================= */

function getVehicleExpenses(vehicleId) {

  return expenses.filter(
    expense =>
      String(expense.vehicle_id) ===
      String(vehicleId)
  );

}


/* =========================================================
   VEHICLE SEARCH
   ========================================================= */

if ($("search")) {

  $("search")
    .addEventListener(
      "input",
      renderVehicles
    );

}


if ($("filter")) {

  $("filter")
    .addEventListener(
      "change",
      renderVehicles
    );

}


/* =========================================================
   VEHICLE DETAILS
   ========================================================= */

function openVehicleDetails(vehicleId) {

  const vehicle =
    vehicles.find(
      item =>
        String(item.id) ===
        String(vehicleId)
    );


  if (!vehicle)
    return;


  const vehicleExpenses =
    getVehicleExpenses(
      vehicle.id
    );


  const expenseTotal =
    vehicleExpenses.reduce(
      (sum, item) =>
        sum +
        Number(item.amount || 0),
      0
    );


  const billed =
    Number(vehicle.billed || 0);

  const paid =
    Number(vehicle.paid || 0);

  const outstanding =
    Math.max(
      0,
      billed - paid
    );


  showDetailsModal(`
    <div class="head">

      <h2>
        ${esc(vehicle.registration)}
      </h2>

      <button
        class="x"
        data-detail-close
      >
        ×
      </button>

    </div>


    <div style="
      display:grid;
      gap:14px;
    ">

      <div>
        <span class="detail-label">
          Customer
        </span>

        <strong class="detail-value">
          ${esc(vehicle.customer)}
        </strong>
      </div>


      <div>
        <span class="detail-label">
          Status
        </span>

        <strong class="detail-value">
          ${esc(vehicle.status)}
        </strong>
      </div>


      <div>
        <span class="detail-label">
          Date received
        </span>

        <strong class="detail-value">
          ${esc(vehicle.date_in || "")}
        </strong>
      </div>


      <div>
        <span class="detail-label">
          Job type
        </span>

        <strong class="detail-value">
          ${esc(vehicle.job_type || "")}
        </strong>
      </div>


      <div>
        <span class="detail-label">
          Charge-out
        </span>

        <strong class="detail-value">
          ${money(billed)}
        </strong>
      </div>


      <div>
        <span class="detail-label">
          Payment received
        </span>

        <strong class="detail-value">
          ${money(paid)}
        </strong>
      </div>


      <div>
        <span class="detail-label">
          Outstanding
        </span>

        <strong class="detail-value">
          ${money(outstanding)}
        </strong>
      </div>


      <div>
        <span class="detail-label">
          Total expenses
        </span>

        <strong class="detail-value">
          ${money(expenseTotal)}
        </strong>
      </div>


      <div>
        <span class="detail-label">
          Description
        </span>

        <p>
          ${esc(
            vehicle.description ||
            "No description"
          )}
        </p>
      </div>


      <hr>


      <h3>
        Vehicle Expenses
      </h3>


      ${
        vehicleExpenses.length
          ? vehicleExpenses
              .map(
                expense => `
                  <div
                    class="expense-row"
                    data-detail-expense="${esc(expense.id)}"
                    style="cursor:pointer"
                  >

                    <span>

                      <b>
                        ${esc(
                          expense.description ||
                          "Expense"
                        )}
                      </b>

                      <small>
                        ${esc(
                          expense.category ||
                          ""
                        )}
                        •
                        ${esc(
                          expense.expense_date ||
                          ""
                        )}
                      </small>

                    </span>

                    <b>
                      ${money(
                        expense.amount
                      )}
                    </b>

                  </div>
                `
              )
              .join("")
          : `
              <p>No expenses recorded.</p>
            `
      }


      <div class="actions">

        <button
          data-detail-add-expense="${esc(vehicle.id)}"
        >
          + Add Expense
        </button>

        <button
          class="secondary"
          data-detail-edit-vehicle="${esc(vehicle.id)}"
        >
          Edit Vehicle
        </button>

      </div>

    </div>
  `);


  const modal =
    $("recordDetailsModal");

  if (!modal)
    return;


  modal
    .querySelectorAll(
      "[data-detail-expense]"
    )
    .forEach(row => {

      row.addEventListener(
        "click",
        () => {

          openExpenseDetails(
            row.dataset.detailExpense
          );

        }
      );

    });


  const addButton =
    modal.querySelector(
      "[data-detail-add-expense]"
    );


  if (addButton) {

    addButton.addEventListener(
      "click",
      () => {

        closeDetailsModal();

        window.addVehicleExpense(
          vehicle.id
        );

      }
    );

  }


  const editButton =
    modal.querySelector(
      "[data-detail-edit-vehicle]"
    );


  if (editButton) {

    editButton.addEventListener(
      "click",
      () => {

        closeDetailsModal();

        openVehicleModal(
          vehicle
        );

      }
    );

  }

}


/* =========================================================
   VEHICLE MODAL
   ========================================================= */

function openVehicleModal(vehicle = null) {

  if ($("vTitle")) {

    $("vTitle").textContent =
      vehicle
        ? "Edit Vehicle"
        : "Add Vehicle";

  }


  $("vid").value =
    vehicle?.id || "";

  $("reg").value =
    vehicle?.registration || "";

  $("customer").value =
    vehicle?.customer || "";

  $("date_in").value =
    vehicle?.date_in ||
    todayISO();

  $("job_type").value =
    vehicle?.job_type ||
    "Repair";

  $("status").value =
    vehicle?.status ||
    "Under Repair";

  $("description").value =
    vehicle?.description ||
    "";

  $("billed").value =
    vehicle?.billed ||
    0;

  $("paid").value =
    vehicle?.paid ||
    0;


  $("vehicleModal")
    .classList
    .remove("hidden");

}


if ($("addVehicle")) {

  $("addVehicle")
    .addEventListener(
      "click",
      () => {

        openVehicleModal();

      }
    );

}


/* =========================================================
   SAVE VEHICLE
   ========================================================= */

if ($("vehicleForm")) {

  $("vehicleForm")
    .addEventListener(
      "submit",
      async event => {

        event.preventDefault();


        const id =
          $("vid").value;


        const data = {

          registration:
            $("reg")
              .value
              .trim()
              .toUpperCase(),

          customer:
            $("customer")
              .value
              .trim(),

          date_in:
            $("date_in").value,

          job_type:
            $("job_type").value,

          status:
            $("status").value,

          description:
            $("description")
              .value
              .trim(),

          billed:
            Number(
              $("billed").value || 0
            ),

          paid:
            Number(
              $("paid").value || 0
            )

        };


        let result;


        if (id) {

          result =
            await sb
              .from("vehicles")
              .update(data)
              .eq("id", id);

        } else {

          result =
            await sb
              .from("vehicles")
              .insert(data);

        }


        if (result.error) {

          console.error(
            "Vehicle save:",
            result.error
          );

          toast(
            result.error.message
          );

          return;

        }


        $("vehicleModal")
          .classList
          .add("hidden");


        await loadData();


        toast(
          id
            ? "Vehicle updated."
            : "Vehicle added."
        );

      }
    );

}


/* =========================================================
   EDIT VEHICLE
   ========================================================= */

window.editVehicle =
  function(id) {

    const vehicle =
      vehicles.find(
        item =>
          String(item.id) ===
          String(id)
      );


    if (vehicle)
      openVehicleModal(vehicle);

  };


/* =========================================================
   DELETE VEHICLE
   ========================================================= */

window.deleteVehicle =
  async function(id) {

    const vehicle =
      vehicles.find(
        item =>
          String(item.id) ===
          String(id)
      );


    if (!vehicle)
      return;


    if (
      !confirm(
        `Delete ${vehicle.registration}?`
      )
    ) {
      return;
    }


    const result =
      await sb
        .from("vehicles")
        .delete()
        .eq("id", id);


    if (result.error) {

      toast(
        result.error.message
      );

      return;
    }


    await loadData();

    toast(
      "Vehicle deleted."
    );

  };


/* =========================================================
   ADD VEHICLE EXPENSE
   ========================================================= */

window.addVehicleExpense =
  function(vehicleId) {

    $("evid").value =
      vehicleId;

    $("edate").value =
      todayISO();

    $("edesc").value =
      "";

    $("eamount").value =
      "";


    $("expenseModal")
      .classList
      .remove("hidden");

  };


/* =========================================================
   EXPENSES
   ========================================================= */

function renderExpenses() {

  const total =
    expenses.reduce(
      (sum, item) =>
        sum +
        Number(item.amount || 0),
      0
    );


  if ($("expenseTotalPage"))
    $("expenseTotalPage").textContent =
      money(total);


  const table =
    $("expenseTable");

  if (!table)
    return;


  if (!expenses.length) {

    table.innerHTML =
      `
      <div
        style="
          padding:20px;
          text-align:center;
        "
      >
        <p>No expenses recorded.</p>
      </div>
      `;

    return;
  }


  table.innerHTML =
    expenses
      .map(expense =>
        expenseRow(expense)
      )
      .join("");


  table
    .querySelectorAll("[data-expense-id]")
    .forEach(row => {

      row.addEventListener(
        "click",
        () => {

          openExpenseDetails(
            row.dataset.expenseId
          );

        }
      );

    });

}


/* =========================================================
   EXPENSE ROW
   ========================================================= */

function expenseRow(expense) {

  const vehicle =
    vehicles.find(
      v =>
        String(v.id) ===
        String(expense.vehicle_id)
    );


  return `
    <div
      class="expense-row"
      data-expense-id="${esc(expense.id)}"
      style="cursor:pointer"
    >

      <span>

        <b>
          ${esc(
            expense.description ||
            "Expense"
          )}
        </b>

        <small class="muted">

          ${esc(
            expense.expense_date ||
            ""
          )}

          •

          ${esc(
            expense.category ||
            ""
          )}

          ${
            vehicle
              ? " • " +
                esc(
                  vehicle.registration
                )
              : ""
          }

        </small>

      </span>

      <b>
        ${money(expense.amount)}
      </b>

    </div>
  `;

}


/* =========================================================
   EXPENSE DETAILS
   ========================================================= */

function openExpenseDetails(expenseId) {

  const expense =
    expenses.find(
      item =>
        String(item.id) ===
        String(expenseId)
    );


  if (!expense)
    return;


  const vehicle =
    vehicles.find(
      v =>
        String(v.id) ===
        String(expense.vehicle_id)
    );


  showDetailsModal(`
    <div class="head">

      <h2>
        Expense Details
      </h2>

      <button
        class="x"
        data-detail-close
      >
        ×
      </button>

    </div>


    <div style="
      display:grid;
      gap:14px;
    ">

      <div>
        <span class="detail-label">
          Description
        </span>

        <strong class="detail-value">
          ${esc(
            expense.description ||
            "Expense"
          )}
        </strong>
      </div>


      <div>
        <span class="detail-label">
          Amount
        </span>

        <strong class="detail-value">
          ${money(expense.amount)}
        </strong>
      </div>


      <div>
        <span class="detail-label">
          Category
        </span>

        <strong class="detail-value">
          ${esc(
            expense.category ||
            ""
          )}
        </strong>
      </div>


      <div>
        <span class="detail-label">
          Date
        </span>

        <strong class="detail-value">
          ${esc(
            expense.expense_date ||
            ""
          )}
        </strong>
      </div>


      <div>

        <span class="detail-label">
          Vehicle
        </span>

        ${
          vehicle
            ? `
              <strong
                data-expense-vehicle="${esc(vehicle.id)}"
                style="cursor:pointer"
              >
                ${esc(
                  vehicle.registration
                )}
                —
                ${esc(
                  vehicle.customer
                )}
              </strong>
            `
            : `
              <strong>
                Not linked
              </strong>
            `
        }

      </div>

    </div>
  `);


  const modal =
    $("recordDetailsModal");

  if (!modal)
    return;


  const vehicleLink =
    modal.querySelector(
      "[data-expense-vehicle]"
    );


  if (vehicleLink) {

    vehicleLink.addEventListener(
      "click",
      () => {

        closeDetailsModal();

        openVehicleDetails(
          vehicle.id
        );

      }
    );

  }

}


/* =========================================================
   ADD EXPENSE BUTTON
   ========================================================= */

document
  .querySelectorAll(
    '[data-action="expense"]'
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        if (!vehicles.length) {

          toast(
            "Add a vehicle first."
          );

          showPage(
            "vehicles"
          );

          return;
        }


        const search =
          (
            $("search")?.value ||
            ""
          )
            .trim()
            .toLowerCase();


        const selected =
          vehicles.find(
            vehicle =>
              String(
                vehicle.registration ||
                ""
              )
                .toLowerCase()
                .includes(search)
          );


        window.addVehicleExpense(
          selected
            ? selected.id
            : vehicles[0].id
        );

      }
    );

  });


/* =========================================================
   SAVE EXPENSE
   ========================================================= */

if ($("expenseForm")) {

  $("expenseForm")
    .addEventListener(
      "submit",
      async event => {

        event.preventDefault();


        const data = {

          vehicle_id:
            $("evid").value ||
            null,

          expense_date:
            $("edate").value,

          description:
            $("edesc")
              .value
              .trim(),

          category:
            $("ecat").value,

          amount:
            Number(
              $("eamount").value || 0
            )

        };


        const result =
          await sb
            .from("expenses")
            .insert(data);


        if (result.error) {

          console.error(
            "Expense:",
            result.error
          );

          toast(
            result.error.message
          );

          return;

        }


        $("expenseModal")
          .classList
          .add("hidden");


        await loadData();


        toast(
          "Expense recorded."
        );

      }
    );

}


/* =========================================================
   PETTY CASH
   ========================================================= */

function renderPettyCash() {

  const total =
    petty.reduce(
      (sum, item) =>
        sum +
        Number(item.amount || 0),
      0
    );


  if ($("pettyPage"))
    $("pettyPage").textContent =
      money(total);


  const table =
    $("pettyTable");

  if (!table)
    return;


  if (!petty.length) {

    table.innerHTML =
      `
      <div
        style="
          padding:20px;
          text-align:center;
        "
      >
        <p>
          No petty cash transactions.
        </p>
      </div>
      `;

    return;

  }


  table.innerHTML =
    petty
      .map(
        item => `

          <div
            class="expense-row"
            data-petty-id="${esc(item.id)}"
            style="cursor:pointer"
          >

            <span>

              <b>
                ${esc(
                  item.description ||
                  "Petty Cash"
                )}
              </b>

              <small class="muted">

                ${esc(
                  item.cash_date ||
                  ""
                )}

                •

                ${esc(
                  item.category ||
                  ""
                )}

                ${
                  item.paid_to
                    ? " • " +
                      esc(item.paid_to)
                    : ""
                }

              </small>

            </span>

            <b>
              ${money(item.amount)}
            </b>

          </div>

        `
      )
      .join("");


  table
    .querySelectorAll(
      "[data-petty-id]"
    )
    .forEach(row => {

      row.addEventListener(
        "click",
        () => {

          openPettyDetails(
            row.dataset.pettyId
          );

        }
      );

    });

}


/* =========================================================
   PETTY DETAILS
   ========================================================= */

function openPettyDetails(id) {

  const item =
    petty.find(
      row =>
        String(row.id) ===
        String(id)
    );


  if (!item)
    return;


  showDetailsModal(`
    <div class="head">

      <h2>
        Petty Cash Transaction
      </h2>

      <button
        class="x"
        data-detail-close
      >
        ×
      </button>

    </div>


    <div style="
      display:grid;
      gap:14px;
    ">

      <div>
        <span class="detail-label">
          Description
        </span>

        <strong>
          ${esc(item.description || "")}
        </strong>
      </div>

      <div>
        <span class="detail-label">
          Amount
        </span>

        <strong>
          ${money(item.amount)}
        </strong>
      </div>

      <div>
        <span class="detail-label">
          Paid to
        </span>

        <strong>
          ${esc(item.paid_to || "")}
        </strong>
      </div>

      <div>
        <span class="detail-label">
          Category
        </span>

        <strong>
          ${esc(item.category || "")}
        </strong>
      </div>

      <div>
        <span class="detail-label">
          Date
        </span>

        <strong>
          ${esc(item.cash_date || "")}
        </strong>
      </div>

      <div>
        <span class="detail-label">
          Notes
        </span>

        <p>
          ${esc(
            item.notes ||
            "No notes"
          )}
        </p>
      </div>

    </div>
  `);

}


/* =========================================================
   ADD PETTY CASH
   ========================================================= */

document
  .querySelectorAll(
    "#petty .page-heading button"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      async () => {

        const description =
          prompt("Description:");

        if (!description)
          return;


        const paidTo =
          prompt("Paid to:") || "";


        const category =
          prompt(
            "Category (Parts, Materials, Labour, Transport, Other):"
          ) || "Other";


        const amount =
          Number(
            prompt("Amount:") || 0
          );


        if (amount <= 0) {

          toast(
            "Enter a valid amount."
          );

          return;
        }


        const result =
          await sb
            .from("petty_cash")
            .insert({

              cash_date:
                todayISO(),

              description,

              paid_to:
                paidTo,

              category,

              amount,

              notes: ""

            });


        if (result.error) {

          toast(
            result.error.message
          );

          return;

        }


        await loadData();

        toast(
          "Petty cash saved."
        );

      }
    );

  });


/* =========================================================
   REQUISITIONS
   ========================================================= */

function renderRequisitions() {

  const table =
    $("reqTable");

  if (!table)
    return;


  if (!requisitions.length) {

    table.innerHTML =
      `
      <div
        style="
          padding:20px;
          text-align:center;
        "
      >
        <p>
          No requisitions found.
        </p>
      </div>
      `;

    return;

  }


  table.innerHTML =
    requisitions
      .map(item =>
        requisitionRow(item)
      )
      .join("");


  table
    .querySelectorAll("[data-req-id]")
    .forEach(row => {

      row.addEventListener(
        "click",
        () => {

          openRequisitionDetails(
            row.dataset.reqId
          );

        }
      );

    });

}


/* =========================================================
   REQUISITION STATUS BADGE
   ========================================================= */

function statusBadge(status) {

  const value =
    String(
      status ||
      "Pending"
    );


  const lower =
    value.toLowerCase();


  if (lower === "approved")
    return `
      <span class="approved-badge">
        Approved
      </span>
    `;


  if (lower === "rejected")
    return `
      <span class="rejected-badge">
        Rejected
      </span>
    `;


  if (lower === "paid")
    return `
      <span class="paid-badge">
        Paid
      </span>
    `;


  return `
    <span class="pending-badge">
      Pending
    </span>
  `;

}


/* =========================================================
   REQUISITION ROW
   ========================================================= */

function requisitionRow(item) {

  return `
    <div
      class="expense-row"
      data-req-id="${esc(item.id)}"
      style="cursor:pointer"
    >

      <span>

        <b>
          ${esc(
            item.req_no ||
            ""
          )}
        </b>

        —

        ${esc(
          item.item_description ||
          ""
        )}

        <small class="muted">

          ${esc(
            item.req_date ||
            ""
          )}

          • Qty:
          ${esc(
            item.quantity || 0
          )}

          ×
          ${money(item.unit_cost)}

          • Total:
          ${money(item.total_amount)}

        </small>

      </span>

      ${statusBadge(item.status)}

    </div>
  `;

}


/* =========================================================
   REQUISITION DETAILS + APPROVAL
   ========================================================= */

function openRequisitionDetails(id) {

  const item =
    requisitions.find(
      row =>
        String(row.id) ===
        String(id)
    );


  if (!item)
    return;


  const vehicle =
    vehicles.find(
      v =>
        String(v.id) ===
        String(item.vehicle_id)
    );


  showDetailsModal(`
    <div class="head">

      <h2>
        ${esc(
          item.req_no ||
          "Requisition"
        )}
      </h2>

      <button
        class="x"
        data-detail-close
      >
        ×
      </button>

    </div>


    <div style="
      display:grid;
      gap:14px;
    ">

      <div>
        <span class="detail-label">
          Requested by
        </span>

        <strong>
          ${esc(
            item.requested_by ||
            ""
          )}
        </strong>
      </div>


      <div>
        <span class="detail-label">
          Date
        </span>

        <strong>
          ${esc(
            item.req_date ||
            ""
          )}
        </strong>
      </div>


      <div>
        <span class="detail-label">
          Item / Material
        </span>

        <strong>
          ${esc(
            item.item_description ||
            ""
          )}
        </strong>
      </div>


      <div>
        <span class="detail-label">
          Quantity
        </span>

        <strong>
          ${esc(
            item.quantity || 0
          )}
        </strong>
      </div>


      <div>
        <span class="detail-label">
          Unit cost
        </span>

        <strong>
          ${money(item.unit_cost)}
        </strong>
      </div>


      <div>
        <span class="detail-label">
          Total
        </span>

        <strong style="font-size:18px">
          ${money(item.total_amount)}
        </strong>
      </div>


      ${
        vehicle
          ? `
            <div>

              <span class="detail-label">
                Vehicle
              </span>

              <strong
                data-req-vehicle="${esc(vehicle.id)}"
                style="cursor:pointer"
              >
                ${esc(
                  vehicle.registration
                )}
              </strong>

            </div>
          `
          : ""
      }


      <div>

        <span class="detail-label">
          Current Status
        </span>

        ${statusBadge(item.status)}

      </div>


      <hr>


      <div>

        <label
          style="
            display:block;
            margin-bottom:7px;
            font-weight:600;
          "
        >
          Update Requisition Status
        </label>

        <select
          id="reqStatusSelect"
          class="status-select"
        >

          <option
            value="Pending"
            ${item.status === "Pending" ? "selected" : ""}
          >
            Pending
          </option>

          <option
            value="Approved"
            ${item.status === "Approved" ? "selected" : ""}
          >
            Approved
          </option>

          <option
            value="Rejected"
            ${item.status === "Rejected" ? "selected" : ""}
          >
            Rejected
          </option>

          <option
            value="Paid"
            ${item.status === "Paid" ? "selected" : ""}
          >
            Paid
          </option>

        </select>

      </div>


      <div class="actions">

        <button
          id="saveReqStatus"
          data-req-status-id="${esc(item.id)}"
        >
          Update Status
        </button>

      </div>


      <div>

        <span class="detail-label">
          Notes
        </span>

        <p>
          ${esc(
            item.notes ||
            "No notes"
          )}
        </p>

      </div>

    </div>
  `);


  const modal =
    $("recordDetailsModal");

  if (!modal)
    return;


  /* Vehicle link */

  const vehicleLink =
    modal.querySelector(
      "[data-req-vehicle]"
    );


  if (vehicleLink) {

    vehicleLink.addEventListener(
      "click",
      () => {

        closeDetailsModal();

        openVehicleDetails(
          vehicle.id
        );

      }
    );

  }


  /* APPROVAL / STATUS BUTTON */

  const saveStatus =
    modal.querySelector(
      "#saveReqStatus"
    );


  if (saveStatus) {

    saveStatus.addEventListener(
      "click",
      async () => {

        const select =
          modal.querySelector(
            "#reqStatusSelect"
          );


        const newStatus =
          select.value;


        saveStatus.disabled =
          true;

        saveStatus.textContent =
          "Updating...";


        const result =
          await sb
            .from("requisitions")
            .update({
              status: newStatus
            })
            .eq(
              "id",
              item.id
            );


        if (result.error) {

          console.error(
            "Requisition status:",
            result.error
          );

          saveStatus.disabled =
            false;

          saveStatus.textContent =
            "Update Status";

          toast(
            result.error.message
          );

          return;

        }


        /* Update local data immediately */

        item.status =
          newStatus;


        /* Refresh everything */

        await loadData();


        closeDetailsModal();


        toast(
          `Requisition ${item.req_no || ""} marked ${newStatus}.`
        );


        /* If still on requisitions page,
           refresh it immediately. */

        showPage(
          "requisitions"
        );

      }
    );

  }

}


/* =========================================================
   NEW REQUISITION
   ========================================================= */

document
  .querySelectorAll(
    "#requisitions .page-heading button"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      async () => {

        const nextNumber =
          requisitions.length + 1;


        const reqNo =
          prompt(
            "Requisition number:",
            "REQ-" +
            String(nextNumber)
              .padStart(3, "0")
          );


        if (!reqNo)
          return;


        const description =
          prompt(
            "Item / material required:"
          );


        if (!description)
          return;


        const quantity =
          Number(
            prompt(
              "Quantity:",
              "1"
            ) || 0
          );


        const unitCost =
          Number(
            prompt(
              "Unit cost:",
              "0"
            ) || 0
          );


        if (
          quantity <= 0 ||
          unitCost < 0
        ) {

          toast(
            "Enter valid values."
          );

          return;

        }


        /*
         * Optional vehicle linking.
         * Leave blank if not related
         * to a particular vehicle.
         */

        const vehicleReg =
          prompt(
            "Vehicle registration (optional):"
          ) || "";


        let vehicleId =
          null;


        if (vehicleReg.trim()) {

          const foundVehicle =
            vehicles.find(
              vehicle =>
                String(
                  vehicle.registration ||
                  ""
                )
                  .toLowerCase() ===
                vehicleReg
                  .trim()
                  .toLowerCase()
            );


          if (foundVehicle) {

            vehicleId =
              foundVehicle.id;

          }

        }


        const result =
          await sb
            .from("requisitions")
            .insert({

              req_no:
                reqNo.trim(),

              req_date:
                todayISO(),

              requested_by:
                currentUser,

              vehicle_id:
                vehicleId,

              item_description:
                description,

              quantity,

              unit_cost:
                unitCost,

              total_amount:
                quantity *
                unitCost,

              status:
                "Pending",

              notes:
                ""

            });


        if (result.error) {

          console.error(
            "Requisition:",
            result.error
          );

          toast(
            result.error.message
          );

          return;

        }


        await loadData();


        toast(
          "Requisition created as Pending."
        );

      }
    );

  });


/* =========================================================
   GLOBAL SEARCH
   ========================================================= */

if ($("globalSearch")) {

  $("globalSearch")
    .addEventListener(
      "input",
      event => {

        const value =
          event.target.value
            .trim()
            .toLowerCase();


        if (!value) {
          return;
        }


        /*
         * 1. VEHICLES
         *
         * This is important for searches
         * like KBN.
         */

        const vehicleMatches =
          vehicles.filter(
            item => {

              const reg =
                String(
                  item.registration ||
                  ""
                ).toLowerCase();

              const customer =
                String(
                  item.customer ||
                  ""
                ).toLowerCase();

              return (
                reg.includes(value) ||
                customer.includes(value)
              );

            }
          );


        if (vehicleMatches.length) {

          showPage("vehicles");


          if ($("search")) {

            $("search").value =
              value;

          }


          renderVehicles();


          /*
           * Open first matching vehicle
           * so its expenses are visible.
           */

          if (vehicleMatches[0]) {

            openVehicleDetails(
              vehicleMatches[0].id
            );

          }

          return;

        }


        /*
         * 2. EXPENSES
         *
         * Also search vehicle registration.
         */

        const expenseMatch =
          expenses.find(
            item => {

              const vehicle =
                vehicles.find(
                  v =>
                    String(v.id) ===
                    String(item.vehicle_id)
                );


              const text = [

                item.description,

                item.category,

                item.expense_date,

                vehicle?.registration,

                vehicle?.customer

              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


              return text.includes(value);

            }
          );


        if (expenseMatch) {

          showPage("expenses");

          openExpenseDetails(
            expenseMatch.id
          );

          return;

        }


        /*
         * 3. PETTY CASH
         */

        const cashMatch =
          petty.find(
            item => {

              const text = [

                item.description,

                item.paid_to,

                item.category,

                item.cash_date,

                item.notes

              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


              return text.includes(value);

            }
          );


        if (cashMatch) {

          showPage("petty");

          openPettyDetails(
            cashMatch.id
          );

          return;

        }


        /*
         * 4. REQUISITIONS
         */

        const reqMatch =
          requisitions.find(
            item => {

              const vehicle =
                vehicles.find(
                  v =>
                    String(v.id) ===
                    String(item.vehicle_id)
                );


              const text = [

                item.req_no,

                item.item_description,

                item.requested_by,

                item.status,

                item.req_date,

                vehicle?.registration

              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


              return text.includes(value);

            }
          );


        if (reqMatch) {

          showPage("requisitions");

          openRequisitionDetails(
            reqMatch.id
          );

          return;

        }


        toast(
          `No results for "${event.target.value}".`
        );

      }
    );

}


/* =========================================================
   QUICK ACTIONS
   ========================================================= */

document
  .querySelectorAll(
    ".quick .qa"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const page =
          button.dataset.page;


        if (!page)
          return;


        showPage(page);


        const text =
          button.textContent
            .toLowerCase();


        if (
          page === "vehicles" &&
          text.includes("add")
        ) {

          openVehicleModal();

        }


        if (
          page === "expenses" &&
          text.includes("expense")
        ) {

          if (vehicles.length) {

            window.addVehicleExpense(
              vehicles[0].id
            );

          } else {

            toast(
              "Add a vehicle first."
            );

          }

        }


        if (
          page === "requisitions"
        ) {

          const reqButton =
            document.querySelector(
              "#requisitions .page-heading button"
            );


          if (reqButton)
            reqButton.click();

        }

      }
    );

  });


/* =========================================================
   SUMMARY CARDS
   ========================================================= */

document
  .querySelectorAll(
    ".summary[data-page]"
  )
  .forEach(card => {

    card.addEventListener(
      "click",
      () => {

        showPage(
          card.dataset.page
        );

      }
    );

  });


/* =========================================================
   REPORT CARDS
   ========================================================= */

function makeReportCardsClickable() {

  const cards =
    document.querySelectorAll(
      "#reports .finance-cards > div"
    );


  const pages = [
    "expenses",
    "vehicles",
    "petty",
    "requisitions"
  ];


  cards.forEach(
    (card, index) => {

      if (!pages[index])
        return;


      card.style.cursor =
        "pointer";


      card.addEventListener(
        "click",
        () => {

          showPage(
            pages[index]
          );

        }
      );

    }
  );

}


makeReportCardsClickable();


/* =========================================================
   EXPENSE PAGE CARDS
   ========================================================= */

function makeExpenseCardsClickable() {

  document
    .querySelectorAll(
      "#expenses .finance-cards > div"
    )
    .forEach(card => {

      card.style.cursor =
        "pointer";

      card.addEventListener(
        "click",
        () => {

          showPage(
            "expenses"
          );

        }
      );

    });

}


makeExpenseCardsClickable();


/* =========================================================
   MODAL CLOSE BUTTONS
   ========================================================= */

document
  .querySelectorAll(
    "[data-close]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const modal =
          $(button.dataset.close);


        if (modal) {

          modal
            .classList
            .add("hidden");

        }

      }
    );

  });


/* =========================================================
   NORMAL MODALS
   ========================================================= */

document
  .querySelectorAll(".modal")
  .forEach(modal => {

    modal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          modal
        ) {

          modal
            .classList
            .add("hidden");

        }

      }
    );

  });


/* =========================================================
   DYNAMIC DETAILS MODAL
   ========================================================= */

function createDetailsModal() {

  if ($("recordDetailsModal"))
    return;


  const modal =
    document.createElement(
      "div"
    );


  modal.id =
    "recordDetailsModal";


  modal.className =
    "modal";


  modal.style.cssText = `
    position:fixed;
    inset:0;
    z-index:9999;
    display:none;
    align-items:center;
    justify-content:center;
    background:rgba(0,0,0,.55);
    padding:18px;
    overflow:auto;
  `;


  modal.innerHTML = `
    <div
      class="card"
      style="
        width:min(680px,100%);
        max-height:90vh;
        overflow:auto;
        background:white;
        border-radius:18px;
        padding:22px;
      "
    ></div>
  `;


  document.body.appendChild(
    modal
  );


  modal.addEventListener(
    "click",
    event => {

      if (
        event.target === modal ||
        event.target.closest(
          "[data-detail-close]"
        )
      ) {

        closeDetailsModal();

      }

    }
  );

}


function showDetailsModal(html) {

  createDetailsModal();


  const modal =
    $("recordDetailsModal");


  const card =
    modal.querySelector(
      ".card"
    );


  card.innerHTML =
    html;


  modal.style.display =
    "flex";

}


function closeDetailsModal() {

  const modal =
    $("recordDetailsModal");


  if (modal) {

    modal.style.display =
      "none";

  }

}


/* =========================================================
   OPEN RECORD
   ========================================================= */

function openRecord(
  type,
  id
) {

  if (type === "expense") {

    openExpenseDetails(id);
    return;

  }


  if (type === "requisition") {

    openRequisitionDetails(id);
    return;

  }


  if (type === "petty") {

    openPettyDetails(id);
    return;

  }


  if (type === "vehicle") {

    openVehicleDetails(id);

  }

}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Escape"
    ) {

      closeDetailsModal();

    }

  }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

applyDashboardPolish();

updateDate();

createDetailsModal();


console.log(
  "Garage Operations Pro loaded."
);

console.log(
  "Connected to:",
  SUPABASE_URL
);
