import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

/* =========================================================
   GARAGE OPERATIONS PRO
   COMPLETE APP.JS
   MATCHED TO YOUR CURRENT INDEX.HTML
   ========================================================= */


/* =========================================================
   SUPABASE CONNECTION
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
   GENERAL HELPERS
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
   APPLICATION DATA
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
   SET USER DISPLAY
   ========================================================= */

function setUser(username) {

  currentUser = username;

  const userNameElements =
    document.querySelectorAll(
      ".top-user b"
    );

  userNameElements.forEach(
    element => {
      element.textContent =
        username;
    }
  );

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


      currentUser = username;

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

        $("password")
          .value = "";

      }

      currentUser = "";

    }
  );

}


/* =========================================================
   LOAD ALL SUPABASE DATA
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


    /* -----------------------------------------
       VEHICLES
       ----------------------------------------- */

    if (vehicleResult.error) {

      console.error(
        "Vehicles error:",
        vehicleResult.error
      );

      toast(
        "Vehicles: " +
        vehicleResult.error.message
      );

    }

    vehicles =
      vehicleResult.data || [];


    /* -----------------------------------------
       EXPENSES
       ----------------------------------------- */

    if (expenseResult.error) {

      console.error(
        "Expenses error:",
        expenseResult.error
      );

      toast(
        "Expenses: " +
        expenseResult.error.message
      );

    }

    expenses =
      expenseResult.data || [];


    /* -----------------------------------------
       PETTY CASH
       ----------------------------------------- */

    if (pettyResult.error) {

      console.error(
        "Petty Cash error:",
        pettyResult.error
      );

      toast(
        "Petty Cash: " +
        pettyResult.error.message
      );

    }

    petty =
      pettyResult.data || [];


    /* -----------------------------------------
       REQUISITIONS
       ----------------------------------------- */

    if (requisitionResult.error) {

      console.error(
        "Requisitions error:",
        requisitionResult.error
      );

      toast(
        "Requisitions: " +
        requisitionResult.error.message
      );

    }

    requisitions =
      requisitionResult.data || [];


    renderAll();

  } catch (error) {

    console.error(
      "Supabase error:",
      error
    );

    toast(
      "Unable to load Supabase data."
    );

  }

}


/* =========================================================
   RENDER EVERYTHING
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

}


/* =========================================================
   ALL NAVIGATION BUTTONS
   ========================================================= */

document
  .querySelectorAll(
    "[data-page]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      event => {

        event.preventDefault();

        const page =
          button.dataset.page;

        if (page) {

          showPage(page);

        }

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


  const underRepair =
    vehicles.filter(
      item =>
        item.status ===
        "Under Repair"
    ).length;


  const completed =
    vehicles.filter(
      item =>
        item.status ===
          "Completed" ||
        item.status ===
          "Released"
    ).length;


  const storage =
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
      completed;


  if ($("dashRepair"))
    $("dashRepair")
      .textContent =
      underRepair;


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


  /* -----------------------------------------
     DONUT
     ----------------------------------------- */

  if ($("donut")) {

    const total =
      vehicles.length;

    if (!total) {

      $("donut").style.background =
        "#e5e7eb";

    } else {

      const activePercent =
        completed /
        total *
        100;

      const repairPercent =
        (
          completed +
          underRepair
        ) /
        total *
        100;


      $("donut").style.background =
        `conic-gradient(
          #16a36a 0 ${activePercent}%,
          #f79009 ${activePercent}% ${repairPercent}%,
          #ef4444 ${repairPercent}% 100%
        )`;

    }

  }


  if ($("donutTotal"))
    $("donutTotal")
      .textContent =
      vehicles.length;


  if ($("activeLegend"))
    $("activeLegend")
      .textContent =
      completed;


  if ($("repairLegend"))
    $("repairLegend")
      .textContent =
      underRepair;


  if ($("outLegend"))
    $("outLegend")
      .textContent =
      storage;


  renderExpenseChart();

  renderActivity();

}


/* =========================================================
   MONTHLY EXPENSE CHART
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


  const currentYear =
    new Date()
      .getFullYear();


  const values =
    months.map(
      (_, monthIndex) => {

        return expenses
          .filter(item => {

            const date =
              new Date(
                item.expense_date ||
                item.created_at
              );

            return (
              date.getFullYear() ===
                currentYear &&
              date.getMonth() ===
                monthIndex
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


  const maximum =
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
              (
                value /
                maximum
              ) *
                100
            );


          return `
            <div
              class="bar-wrap"
              style="height:100%;"
            >

              <div
                class="bar"
                style="
                  height:${height}%;
                "
                title="${money(value)}"
              ></div>

              <span class="bar-label">
                ${months[index]}
              </span>

            </div>
          `;

        }
      )
      .join("");

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

        text:
          "Expense: " +
          (
            item.description ||
            "Garage expense"
          ),

        value:
          money(item.amount)

      });

    });


  requisitions
    .slice(0, 4)
    .forEach(item => {

      activities.push({

        text:
          "Requisition: " +
          (
            item.req_no ||
            "Request"
          ),

        value:
          item.status ||
          "Pending"

      });

    });


  if (!activities.length) {

    box.innerHTML =
      `<p>No recent activity.</p>`;

    return;
  }


  box.innerHTML =
    activities
      .slice(0, 6)
      .map(
        item => `
          <div class="activity-row">

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

        const registration =
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


        const searchMatch =
          !search ||
          registration.includes(
            search
          ) ||
          customer.includes(
            search
          );


        const filterMatch =
          !filter ||
          vehicle.status ===
            filter;


        return (
          searchMatch &&
          filterMatch
        );

      }
    );


  if (!filtered.length) {

    list.innerHTML =
      `
      <div style="padding:24px;text-align:center;">
        <p>
          No vehicles found.
        </p>
      </div>
      `;

    return;
  }


  list.innerHTML =
    filtered
      .map(
        vehicle =>
          vehicleCard(vehicle)
      )
      .join("");

}


function vehicleCard(vehicle) {

  const vehicleExpenses =
    expenses.filter(
      expense =>
        String(
          expense.vehicle_id
        ) ===
        String(vehicle.id)
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


  const balance =
    Math.max(
      0,
      billed - paid
    );


  return `
    <article class="vehicle">

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
            vehicle.status ||
            ""
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
            ${money(
              expenseTotal
            )}
          </b>
        </div>

        <div>
          <small>Charge-out</small>
          <b>
            ${money(
              billed
            )}
          </b>
        </div>

        <div>
          <small>Paid</small>
          <b>
            ${money(
              paid
            )}
          </b>
        </div>

        <div>
          <small>Outstanding</small>
          <b>
            ${money(
              balance
            )}
          </b>
        </div>

      </div>


      <div class="actions">

        <button
          onclick="window.addVehicleExpense('${vehicle.id}')"
        >
          + Expense
        </button>

        <button
          class="secondary"
          onclick="window.editVehicle('${vehicle.id}')"
        >
          Edit
        </button>

        <button
          class="secondary"
          onclick="window.deleteVehicle('${vehicle.id}')"
        >
          Delete
        </button>

      </div>

    </article>
  `;

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
            "Vehicle save error:",
            result.error
          );

          toast(
            "Vehicle error: " +
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
            ? "Vehicle updated successfully."
            : "Vehicle added successfully."
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


    if (!vehicle) {

      toast(
        "Vehicle not found."
      );

      return;
    }


    openVehicleModal(
      vehicle
    );

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


    const confirmed =
      confirm(
        `Delete vehicle ${vehicle.registration}?`
      );


    if (!confirmed) {
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

      console.error(
        "Vehicle delete error:",
        result.error
      );

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
   ADD EXPENSE FROM VEHICLE
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
      <div style="padding:20px">
        <p>No expenses recorded.</p>
      </div>
      `;

    return;
  }


  table.innerHTML =
    expenses
      .map(
        item => {

          const vehicle =
            vehicles.find(
              v =>
                String(v.id) ===
                String(
                  item.vehicle_id
                )
            );


          return `
            <div class="expense-row">

              <span>

                <b>
                  ${esc(
                    item.description ||
                    "Expense"
                  )}
                </b>

                <small class="muted">

                  ${esc(
                    item.expense_date ||
                    ""
                  )}

                  •

                  ${esc(
                    item.category ||
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
                  item.amount
                )}
              </b>

            </div>
          `;

        }
      )
      .join("");

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
            "Please add a vehicle first."
          );

          showPage(
            "vehicles"
          );

          return;
        }


        window.addVehicleExpense(
          vehicles[0].id
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
            "Expense save error:",
            result.error
          );

          toast(
            "Expense error: " +
            result.error.message
          );

          return;
        }


        $("expenseModal")
          .classList
          .add("hidden");


        await loadData();


        toast(
          "Expense recorded successfully."
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
      <div style="padding:20px">
        <p>No petty cash transactions.</p>
      </div>
      `;

    return;
  }


  table.innerHTML =
    petty
      .map(
        item => `
          <div class="expense-row">

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

}


/* =========================================================
   PETTY CASH ADD BUTTON
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


        if (!amount) {

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

              description:
                description,

              paid_to:
                paidTo,

              category:
                category,

              amount:
                amount,

              notes:
                ""

            });


        if (result.error) {

          console.error(
            "Petty cash error:",
            result.error
          );

          toast(
            result.error.message
          );

          return;
        }


        await loadData();


        toast(
          "Petty cash transaction saved."
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
      <div style="padding:20px">
        <p>No requisitions found.</p>
      </div>
      `;

    return;
  }


  table.innerHTML =
    requisitions
      .map(
        item => `

          <div class="expense-row">

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

                •
                ${esc(
                  item.req_date ||
                  ""
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

}


/* =========================================================
   NEW REQUISITION
   CURRENT HTML HAS NO REQUISITION MODAL
   SO USE A SIMPLE INPUT FLOW
   ========================================================= */

document
  .querySelectorAll(
    "#requisitions .page-heading button"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      async () => {

        const reqNo =
          prompt(
            "Requisition number:",
            "REQ-" +
            String(
              requisitions.length + 1
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
            "Enter valid quantity and unit cost."
          );

          return;
        }


        const result =
          await sb
            .from("requisitions")
            .insert({

              req_no:
                reqNo,

              req_date:
                todayISO(),

              requested_by:
                currentUser,

              item_description:
                description,

              quantity:
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
            "Requisition error:",
            result.error
          );

          toast(
            result.error.message
          );

          return;
        }


        await loadData();


        toast(
          "Requisition created successfully."
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
   CLICK OUTSIDE MODAL TO CLOSE
   ========================================================= */

document
  .querySelectorAll(
    ".modal"
  )
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


        showPage(
          "vehicles"
        );


        if ($("search")) {

          $("search").value =
            value;

          renderVehicles();

        }

      }
    );

}


/* =========================================================
   DASHBOARD QUICK ACTIONS
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


        if (
          page === "vehicles" &&
          button.textContent
            .toLowerCase()
            .includes("add")
        ) {

          openVehicleModal();

        }


        if (
          page === "expenses" &&
          button.textContent
            .toLowerCase()
            .includes("expense")
        ) {

          if (
            vehicles.length
          ) {

            window.addVehicleExpense(
              vehicles[0].id
            );

          } else {

            toast(
              "Please add a vehicle first."
            );

          }

        }

      }
    );

  });


/* =========================================================
   DASHBOARD SUMMARY CARDS
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
   STARTUP
   ========================================================= */

updateDate();


console.log(
  "Garage Operations Pro started."
);

console.log(
  "Supabase:",
  SUPABASE_URL
);
