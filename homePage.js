document.addEventListener("DOMContentLoaded", () => {
  !(async function () {
    try {
      const n = await fetch("data.json"),
        c = await n.json();
      o(c.daily, e, "daily"),
        o(c.weekly, t, "weekly"),
        (function (e) {
          const t = localStorage.getItem("lastDailyReset"),
            n = new Date().toISOString().split("T")[0];
          t !== n &&
            (e.forEach((e) => (e.checked = !1)),
            a(e, "daily"),
            localStorage.setItem("lastDailyReset", n));
        })(e.querySelectorAll('input[type="checkbox"]')),
        (function (e) {
          const t = localStorage.getItem("lastWeeklyReset"),
            n = new Date();
          4 === n.getDay() &&
            t !== n.toISOString().split("T")[0] &&
            (e.forEach((e) => (e.checked = !1)),
            a(e, "weekly"),
            localStorage.setItem(
              "lastWeeklyReset",
              n.toISOString().split("T")[0]
            ));
        })(t.querySelectorAll('input[type="checkbox"]'));
    } catch (e) {
      console.error("Error fetching tasks:", e);
    }
  })();
  const e = document.getElementById("daily-tasks"),
    t = document.getElementById("weekly-tasks"),
    n = document.getElementById("current-time");
  function o(e, t, n) {
    e.forEach((e, o) => {
      const a = document.createElement("li"),
        c = document.createElement("input");
      if (
        ((c.type = "checkbox"),
        (c.dataset.type = n),
        (c.dataset.index = o),
        (function (e, t, n) {
          const o = JSON.parse(localStorage.getItem(`${t}-tasks`)) || {};
          e.checked = o[n] || !1;
        })(c, n, o),
        c.addEventListener("change", () =>
          (function (e, t, n) {
            const o = JSON.parse(localStorage.getItem(`${t}-tasks`)) || {};
            (o[n] = e.checked),
              localStorage.setItem(`${t}-tasks`, JSON.stringify(o));
          })(c, n, o)
        ),
        a.appendChild(c),
        a.appendChild(document.createTextNode(e.name)),
        e.subTasks)
      ) {
        const t = document.createElement("button");
        (t.textContent = "More Details"),
          t.classList.add("dropdown-btn"),
          t.addEventListener("click", () =>
            (function (e) {
              const t = document.getElementById(e);
              t
                ? (t.style.display =
                    "none" === t.style.display ? "block" : "none")
                : console.error(`Dropdown with ID ${e} not found.`);
            })(`task-${n}-${o}`)
          );
        const c = document.createElement("ul");
        c.classList.add("dropdown-list"),
          (c.id = `task-${n}-${o}`),
          (c.style.display = "none"),
          e.subTasks.forEach((e) => {
            const t = document.createElement("li");
            (t.textContent = e), c.appendChild(t);
          }),
          a.appendChild(t),
          a.appendChild(c);
      }
      t.appendChild(a);
    });
  }
  function a(e, t) {
    const n = {};
    e.forEach((e, t) => {
      n[t] = e.checked;
    }),
      localStorage.setItem(`${t}-tasks`, JSON.stringify(n));
  }
  function c() {
    const e = new Date(),
      t = new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Europe/Brussels",
        hour12: !1,
      }).format(e),
      [o, a, c] = t.split(" "),
      s = `${o} ${a}`;
    n.textContent = `${s} ${c}`;
  }
  setInterval(c, 1e3), c();
});
