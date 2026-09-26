import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

/* =========================================================
   GARAGE OPERATIONS PRO
   FULLY CONNECTED / CLICKABLE APP.JS
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
   DOM
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

          $("loginMsg")
            .textContent =
            "Incorrect username or password.";

        }

        return;
      }

      setUser(username);

      if ($("loginMsg")) {

        $("loginMsg")
          .textContent = "";

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


    if (vehicleResult.error) {

      console.error(
        "Vehicles:",
        vehicleResult.error
      );

    }

    if (expenseResult.error) {

      console.error(
        "Expenses:",
        expenseResult.error
      );

    }

    if (pettyResult.error) {

      console.error(
        "Petty cash:",
        pettyResult.error
      );

    }

    if (requisitionResult.error) {

      console.error(
        "Requisitions:",
        requisitionResult.error
      );

    }


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


  if (pageName === "dashboard") {

    renderDashboard();

  }

  if (pageName === "vehicles") {

    renderVehicles();

  }

  if (pageName === "expenses") {

    renderExpenses();

  }

  if (pageName === "petty") {

    renderPettyCash();

  }

  if (pageName === "requisitions") {

    renderRequisitions();

  }

  if (pageName === "reports") {

    renderDashboard();

  }

}


/* =========================================================
   NAVIGATION BUTTONS
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
        Number(
          item.amount || 0
        ),
      0
    );


  const totalPetty =
    petty.reduce(
      (sum, item) =>
        sum +
        Number(
          item.amount || 0
        ),
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
        item.status ===
          "Completed" ||
        item.status ===
          "Released"
    ).length;


  const out =
    vehicles.filter(
      item =>
        item.status ===
        "Storage"
    ).length;


  if ($("dashVehicles"))
    $("dashVehicles")
      .textContent =
      vehicles.length;


  if ($("dashActive"))
    $("dashActive")
      .textContent =
      active;


  if ($("dashRepair"))
    $("dashRepair")
      .textContent =
      repair;


  if ($("dashExpenses"))
    $("dashExpenses")
      .textContent =
      money(totalExpenses);


  if ($("dashPetty"))
    $("dashPetty")
      .textContent =
      money(totalPetty);


  if ($("dashReq"))
    $("dashReq")
      .textContent =
      pendingRequests;


  if ($("reportExpenses"))
    $("reportExpenses")
      .textContent =
      money(totalExpenses);


  if ($("reportFleet"))
    $("reportFleet")
      .textContent =
      vehicles.length;


  if ($("reportPetty"))
    $("reportPetty")
      .textContent =
      money(totalPetty);


  if ($("reportReq"))
    $("reportReq")
      .textContent =
      pendingRequests;


  if ($("pettyPage"))
    $("pettyPage")
      .textContent =
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

  if (!donut) {
    return;
  }


  const total =
    active +
    repair +
    out;


  if (!total) {

    donut.style.background =
      "#e5e7eb";

  } else {

    const activePercent =
      active /
      total *
      100;

    const repairPercent =
      repair /
      total *
      100;


    donut.style.background =
      `conic-gradient(
        #16a36a 0 ${activePercent}%,
        #f79009 ${activePercent}% ${activePercent + repairPercent}%,
        #ef4444 ${activePercent + repairPercent}% 100%
      )`;

  }


  if ($("donutTotal"))
    $("donutTotal")
      .textContent =
      vehicles.length;


  if ($("activeLegend"))
    $("activeLegend")
      .textContent =
      active;


  if ($("repairLegend"))
    $("repairLegend")
      .textContent =
      repair;


  if ($("outLegend"))
    $("outLegend")
      .textContent =
      out;

}


/* =========================================================
   EXPENSE CHART
   ========================================================= */

function renderExpenseChart() {

  const chart =
    $("expenseChart");

  if (!chart) {
    return;
  }


  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];


  const year =
    new Date()
      .getFullYear();


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
              date.getFullYear() ===
              year &&
              date.getMonth() ===
              index
            );

          })
          .reduce(
            (sum, item) =>
              sum +
              Number(
                item.amount || 0
              ),
            0
          );

      }
    );


  const max =
    Math.max(
      ...values,
      1
    );


  chart.innerHTML =
    values
      .map(
        (value, index) => {

          const height =
            Math.max(
              5,
              value /
              max *
              100
            );


          return `
            <div
              class="bar-wrap"
              style="height:100%;cursor:pointer;"
              data-month="${index}"
              title="${money(value)}"
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

          showPage(
            "expenses"
          );

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

  if (!box) {
    return;
  }


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
            data-type="${item.type}"
            data-id="${item.id}"
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

  if (!list) {
    return;
  }


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
          )
            .toLowerCase();


        const customer =
          String(
            vehicle.customer ||
            ""
          )
            .toLowerCase();


        return (
          (
            !search ||
            reg.includes(search) ||
            customer.includes(search)
          ) &&
          (
            !filter ||
            vehicle.status ===
            filter
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
      .map(
        vehicle =>
          vehicleCard(
            vehicle
          )
      )
      .join("");


  list
    .querySelectorAll(
      ".vehicle-click"
    )
    .forEach(card => {

      card.addEventListener(
        "click",
        event => {

          if (
            event.target.closest(
              "button"
            )
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
   * If the search identifies a
   * specific vehicle, show its
   * expenses directly underneath.
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

      const expensesHTML =
        vehicleExpensesHTML(
          matchedVehicle
        );


      list.insertAdjacentHTML(
        "beforeend",
        expensesHTML
      );

    }

  }

}


/* =========================================================
   VEHICLE CARD
   ========================================================= */

function vehicleCard(
  vehicle
) {

  const vehicleExpenses =
    getVehicleExpenses(
      vehicle.id
    );


  const expenseTotal =
    vehicleExpenses.reduce(
      (sum, item) =>
        sum +
        Number(
          item.amount || 0
        ),
      0
    );


  const billed =
    Number(
      vehicle.billed || 0
    );


  const paid =
    Number(
      vehicle.paid || 0
    );


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

          <small>
            Expenses
          </small>

          <b>
            ${money(
              expenseTotal
            )}
          </b>

        </div>


        <div>

          <small>
            Charge-out
          </small>

          <b>
            ${money(
              billed
            )}
          </b>

        </div>


        <div>

          <small>
            Paid
          </small>

          <b>
            ${money(
              paid
            )}
          </b>

        </div>


        <div>

          <small>
            Outstanding
          </small>

          <b>
            ${money(
              outstanding
            )}
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
   VEHICLE EXPENSES AFTER SEARCH
   ========================================================= */

function vehicleExpensesHTML(
  vehicle
) {

  const list =
    getVehicleExpenses(
      vehicle.id
    );


  return `
    <section
      class="panel"
      style="
        margin-top:18px;
        cursor:pointer;
      "
    >

      <div
        class="panel-title"
      >

        <div>

          <h2>
            ${esc(
              vehicle.registration
            )}
            — Expenses
          </h2>

          <small>
            Expenses linked to this vehicle
          </small>

        </div>

        <strong>
          ${money(
            list.reduce(
              (sum, item) =>
                sum +
                Number(
                  item.amount || 0
                ),
              0
            )
          )}
        </strong>

      </div>


      ${
        list.length
          ? list
              .map(
                expense =>
                  `
                  <div
                    class="expense-row clickable-record"
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
              <p
                style="
                  padding:15px;
                "
              >
                No expenses recorded
                for this vehicle.
              </p>
            `
      }

    </section>
  `;

}


/* =========================================================
   GET VEHICLE EXPENSES
   ========================================================= */

function getVehicleExpenses(
  vehicleId
) {

  return expenses.filter(
    expense =>
      String(
        expense.vehicle_id
      ) ===
      String(vehicleId)
  );

}


/* =========================================================
   VEHICLE SEARCH
   ========================================================= */

if ($("search")) {

  $("search").addEventListener(
    "input",
    renderVehicles
  );

}


if ($("filter")) {

  $("filter").addEventListener(
    "change",
    renderVehicles
  );

}


/* =========================================================
   VEHICLE DETAILS
   ========================================================= */

function openVehicleDetails(
  vehicleId
) {

  const vehicle =
    vehicles.find(
      item =>
        String(item.id) ===
        String(vehicleId)
    );


  if (!vehicle) {
    return;
  }


  const vehicleExpenses =
    getVehicleExpenses(
      vehicle.id
    );


  const expenseTotal =
    vehicleExpenses.reduce(
      (sum, item) =>
        sum +
        Number(
          item.amount || 0
        ),
      0
    );


  const billed =
    Number(
      vehicle.billed || 0
    );


  const paid =
    Number(
      vehicle.paid || 0
    );


  const outstanding =
    Math.max(
      0,
      billed - paid
    );


  showDetailsModal(
    `
      <div class="head">

        <h2>
          ${esc(
            vehicle.registration
          )}
        </h2>

        <button
          class="x"
          data-detail-close
        >
          ×
        </button>

      </div>


      <div
        style="
          display:grid;
          gap:12px;
        "
      >

        <div>
          <small>Customer</small>
          <strong>
            ${esc(
              vehicle.customer
            )}
          </strong>
        </div>

        <div>
          <small>Status</small>
          <strong>
            ${esc(
              vehicle.status
            )}
          </strong>
        </div>

        <div>
          <small>Date received</small>
          <strong>
            ${esc(
              vehicle.date_in ||
              ""
            )}
          </strong>
        </div>

        <div>
          <small>Job type</small>
          <strong>
            ${esc(
              vehicle.job_type ||
              ""
            )}
          </strong>
        </div>

        <div>
          <small>Charge-out</small>
          <strong>
            ${money(billed)}
          </strong>
        </div>

        <div>
          <small>Payment received</small>
          <strong>
            ${money(paid)}
          </strong>
        </div>

        <div>
          <small>Outstanding</small>
          <strong>
            ${money(outstanding)}
          </strong>
        </div>

        <div>
          <small>Total expenses</small>
          <strong>
            ${money(expenseTotal)}
          </strong>
        </div>

        <div>

          <small>
            Description
          </small>

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
                  expense =>
                    `
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
                <p>
                  No expenses recorded.
                </p>
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
    `
  );


  const modal =
    $("recordDetailsModal");


  if (!modal) {
    return;
  }


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

function openVehicleModal(
  vehicle = null
) {

  if ($("vTitle")) {

    $("vTitle")
      .textContent =
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

  $("addVehicle").addEventListener(
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
              $("billed")
                .value || 0
            ),

          paid:
            Number(
              $("paid")
                .value || 0
            )

        };


        let result;


        if (id) {

          result =
            await sb
              .from("vehicles")
              .update(data)
              .eq(
                "id",
                id
              );

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


    if (vehicle) {

      openVehicleModal(
        vehicle
      );

    }

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


    if (!vehicle) {
      return;
    }


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
        .eq(
          "id",
          id
        );


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
   EXPENSE FORM
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
        Number(
          item.amount || 0
        ),
      0
    );


  if ($("expenseTotalPage")) {

    $("expenseTotalPage")
      .textContent =
      money(total);

  }


  const table =
    $("expenseTable");

  if (!table) {
    return;
  }


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
      .map(
        expense =>
          expenseRow(
            expense
          )
      )
      .join("");


  table
    .querySelectorAll(
      "[data-expense-id]"
    )
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

function expenseRow(
  expense
) {

  const vehicle =
    vehicles.find(
      v =>
        String(v.id) ===
        String(
          expense.vehicle_id
        )
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
        ${money(
          expense.amount
        )}
      </b>

    </div>
  `;

}


/* =========================================================
   EXPENSE DETAILS
   ========================================================= */

function openExpenseDetails(
  expenseId
) {

  const expense =
    expenses.find(
      item =>
        String(item.id) ===
        String(expenseId)
    );


  if (!expense) {
    return;
  }


  const vehicle =
    vehicles.find(
      v =>
        String(v.id) ===
        String(
          expense.vehicle_id
        )
    );


  showDetailsModal(
    `
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


      <div
        style="
          display:grid;
          gap:14px;
        "
      >

        <div>
          <small>Description</small>
          <strong>
            ${esc(
              expense.description ||
              "Expense"
            )}
          </strong>
        </div>


        <div>
          <small>Amount</small>
          <strong>
            ${money(
              expense.amount
            )}
          </strong>
        </div>


        <div>
          <small>Category</small>
          <strong>
            ${esc(
              expense.category ||
              ""
            )}
          </strong>
        </div>


        <div>
          <small>Date</small>
          <strong>
            ${esc(
              expense.expense_date ||
              ""
            )}
          </strong>
        </div>


        <div>
          <small>Vehicle</small>

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
    `
  );


  const modal =
    $("recordDetailsModal");


  if (!modal) {
    return;
  }


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


        /*
         * If a vehicle is currently
         * selected by search, use it.
         */

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
              $("eamount")
                .value || 0
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
        Number(
          item.amount || 0
        ),
      0
    );


  if ($("pettyPage")) {

    $("pettyPage")
      .textContent =
      money(total);

  }


  const table =
    $("pettyTable");

  if (!table) {
    return;
  }


  if (!petty.length) {

    table.innerHTML =
      `
      <div
        style="
          padding:20px;
          text-align:center;
        "
      >
        <p>No petty cash transactions.</p>
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
                      esc(
                        item.paid_to
                      )
                    : ""
                }

              </small>

            </span>

            <b>
              ${money(
                item.amount
              )}
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
   PETTY CASH DETAILS
   ========================================================= */

function openPettyDetails(
  id
) {

  const item =
    petty.find(
      row =>
        String(row.id) ===
        String(id)
    );


  if (!item) {
    return;
  }


  showDetailsModal(
    `
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


      <div
        style="
          display:grid;
          gap:14px;
        "
      >

        <div>
          <small>Description</small>
          <strong>
            ${esc(
              item.description ||
              ""
            )}
          </strong>
        </div>

        <div>
          <small>Amount</small>
          <strong>
            ${money(
              item.amount
            )}
          </strong>
        </div>

        <div>
          <small>Paid to</small>
          <strong>
            ${esc(
              item.paid_to ||
              ""
            )}
          </strong>
        </div>

        <div>
          <small>Category</small>
          <strong>
            ${esc(
              item.category ||
              ""
            )}
          </strong>
        </div>

        <div>
          <small>Date</small>
          <strong>
            ${esc(
              item.cash_date ||
              ""
            )}
          </strong>
        </div>

        <div>
          <small>Notes</small>
          <p>
            ${esc(
              item.notes ||
              "No notes"
            )}
          </p>
        </div>

      </div>
    `
  );

}


/* =========================================================
   PETTY CASH ADD
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
          prompt(
            "Description:"
          );

        if (!description) {
          return;
        }


        const paidTo =
          prompt(
            "Paid to:"
          ) || "";


        const category =
          prompt(
            "Category (Parts, Materials, Labour, Transport, Other):"
          ) || "Other";


        const amount =
          Number(
            prompt(
              "Amount:"
            ) || 0
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

  if (!table) {
    return;
  }


  if (!requisitions.length) {

    table.innerHTML =
      `
      <div
        style="
          padding:20px;
          text-align:center;
        "
      >
        <p>No requisitions found.</p>
      </div>
      `;

    return;
  }


  table.innerHTML =
    requisitions
      .map(
        item => `

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

                Qty:
                ${esc(
                  item.quantity ||
                  0
                )}

                ×

                ${money(
                  item.unit_cost
                )}

                • Total:
                ${money(
                  item.total_amount
                )}

              </small>

            </span>

            <b>
              ${esc(
                item.status ||
                "Pending"
              )}
            </b>

          </div>

        `
      )
      .join("");


  table
    .querySelectorAll(
      "[data-req-id]"
    )
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
   REQUISITION DETAILS
   ========================================================= */

function openRequisitionDetails(
  id
) {

  const item =
    requisitions.find(
      row =>
        String(row.id) ===
        String(id)
    );


  if (!item) {
    return;
  }


  showDetailsModal(
    `
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


      <div
        style="
          display:grid;
          gap:14px;
        "
      >

        <div>
          <small>Requested by</small>
          <strong>
            ${esc(
              item.requested_by ||
              ""
            )}
          </strong>
        </div>

        <div>
          <small>Date</small>
          <strong>
            ${esc(
              item.req_date ||
              ""
            )}
          </strong>
        </div>

        <div>
          <small>Item</small>
          <strong>
            ${esc(
              item.item_description ||
              ""
            )}
          </strong>
        </div>

        <div>
          <small>Quantity</small>
          <strong>
            ${esc(
              item.quantity ||
              0
            )}
          </strong>
        </div>

        <div>
          <small>Unit cost</small>
          <strong>
            ${money(
              item.unit_cost
            )}
          </strong>
        </div>

        <div>
          <small>Total</small>
          <strong>
            ${money(
              item.total_amount
            )}
          </strong>
        </div>

        <div>
          <small>Status</small>
          <strong>
            ${esc(
              item.status ||
              "Pending"
            )}
          </strong>
        </div>

        <div>
          <small>Notes</small>
          <p>
            ${esc(
              item.notes ||
              "No notes"
            )}
          </p>
        </div>

      </div>
    `
  );

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
            String(
              nextNumber
            ).padStart(
              3,
              "0"
            )
          );


        if (!reqNo) {
          return;
        }


        const description =
          prompt(
            "Item / material required:"
          );


        if (!description) {
          return;
        }


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


        const result =
          await sb
            .from("requisitions")
            .insert({

              req_no,

              req_date:
                todayISO(),

              requested_by:
                currentUser,

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
          "Requisition created."
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
         * VEHICLE SEARCH
         */

        const vehicle =
          vehicles.find(
            item => {

              const reg =
                String(
                  item.registration ||
                  ""
                )
                  .toLowerCase();

              const customer =
                String(
                  item.customer ||
                  ""
                )
                  .toLowerCase();

              return (
                reg.includes(value) ||
                customer.includes(value)
              );

            }
          );


        if (vehicle) {

          showPage(
            "vehicles"
          );

          if ($("search")) {

            $("search").value =
              value;

          }

          renderVehicles();

          return;

        }


        /*
         * EXPENSE SEARCH
         */

        const expense =
          expenses.find(
            item => {

              const description =
                String(
                  item.description ||
                  ""
                )
                  .toLowerCase();

              const category =
                String(
                  item.category ||
                  ""
                )
                  .toLowerCase();

              return (
                description.includes(
                  value
                ) ||
                category.includes(
                  value
                )
              );

            }
          );


        if (expense) {

          showPage(
            "expenses"
          );

          openExpenseDetails(
            expense.id
          );

          return;

        }


        /*
         * REQUISITION SEARCH
         */

        const req =
          requisitions.find(
            item =>
              String(
                item.req_no ||
                ""
              )
                .toLowerCase()
                .includes(value) ||
              String(
                item.item_description ||
                ""
              )
                .toLowerCase()
                .includes(value)
          );


        if (req) {

          showPage(
            "requisitions"
          );

          openRequisitionDetails(
            req.id
          );

          return;

        }


        /*
         * PETTY CASH SEARCH
         */

        const cash =
          petty.find(
            item =>
              String(
                item.description ||
                ""
              )
                .toLowerCase()
                .includes(value) ||
              String(
                item.paid_to ||
                ""
              )
                .toLowerCase()
                .includes(value)
          );


        if (cash) {

          showPage(
            "petty"
          );

          openPettyDetails(
            cash.id
          );

        }

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


        if (!page) {
          return;
        }


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

          const button =
            document.querySelector(
              "#requisitions .page-heading button"
            );

          if (button) {

            button.click();

          }

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
   CLOSE NORMAL MODALS
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

  if ($("recordDetailsModal")) {
    return;
  }


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
        event.target ===
        modal ||
        event.target.closest(
          "[data-detail-close]"
        )
      ) {

        closeDetailsModal();

      }

    }
  );

}


function showDetailsModal(
  html
) {

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
   SEARCH RESULT CLICK SUPPORT
   ========================================================= */

document.addEventListener(
  "click",
  event => {

    const expense =
      event.target.closest(
        "[data-expense-id]"
      );


    if (
      expense &&
      expense.closest(
        "#expenseTable"
      )
    ) {

      openExpenseDetails(
        expense.dataset.expenseId
      );

    }


    const pettyRow =
      event.target.closest(
        "[data-petty-id]"
      );


    if (pettyRow) {

      openPettyDetails(
        pettyRow.dataset.pettyId
      );

    }


    const reqRow =
      event.target.closest(
        "[data-req-id]"
      );


    if (reqRow) {

      openRequisitionDetails(
        reqRow.dataset.reqId
      );

    }


    const searchedExpense =
      event.target.closest(
        "[data-expense-id]"
      );


    if (
      searchedExpense &&
      searchedExpense.closest(
        "#list"
      )
    ) {

      openExpenseDetails(
        searchedExpense.dataset.expenseId
      );

    }

  }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

updateDate();

createDetailsModal();

console.log(
  "Garage Operations Pro loaded."
);

console.log(
  "Connected to:",
  SUPABASE_URL
);
