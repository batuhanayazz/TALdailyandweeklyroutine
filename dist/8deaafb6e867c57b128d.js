document.addEventListener("DOMContentLoaded", () => {
  fetchTasks();

  const dailyTasksContainer = document.getElementById("daily-tasks");
  const weeklyTasksContainer = document.getElementById("weekly-tasks");
  const currentTimeElement = document.getElementById("current-time");

  // Fetch tasks from data.json and populate lists
  async function fetchTasks() {
    try {
      const response = await fetch("data.json"); // Update to your 'data.json' file path
      const data = await response.json();
      populateTasks(data.daily, dailyTasksContainer, "daily");
      populateTasks(data.weekly, weeklyTasksContainer, "weekly");

      // Set up daily and weekly resets
      resetDailyTasks(
        dailyTasksContainer.querySelectorAll('input[type="checkbox"]')
      );
      resetWeeklyTasks(
        weeklyTasksContainer.querySelectorAll('input[type="checkbox"]')
      );
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  // Populate tasks into the specified container
  function populateTasks(tasks, container, type) {
    tasks.forEach((task, index) => {
      const listItem = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.type = type;
      checkbox.dataset.index = index;

      loadTaskState(checkbox, type, index);

      checkbox.addEventListener("change", () =>
        saveTaskState(checkbox, type, index)
      );

      listItem.appendChild(checkbox);
      listItem.appendChild(document.createTextNode(task.name));

      // Add dropdown functionality for tasks with sub-tasks (e.g. Daily Buys)
      if (task.subTasks) {
        const dropdownButton = document.createElement("button");
        dropdownButton.textContent = "More Details";
        dropdownButton.classList.add("dropdown-btn");
        dropdownButton.addEventListener("click", () =>
          toggleDropdown(`task-${type}-${index}`)
        );

        const dropdownList = document.createElement("ul");
        dropdownList.classList.add("dropdown-list");
        dropdownList.id = `task-${type}-${index}`;
        dropdownList.style.display = "none";

        task.subTasks.forEach((subTask) => {
          const subTaskItem = document.createElement("li");
          subTaskItem.textContent = subTask;
          dropdownList.appendChild(subTaskItem);
        });

        listItem.appendChild(dropdownButton);
        listItem.appendChild(dropdownList);
      }

      container.appendChild(listItem);
    });
  }

  // Toggle visibility of dropdown
  function toggleDropdown(dropdownId) {
    const dropdownList = document.getElementById(dropdownId);
    if (dropdownList) {
      dropdownList.style.display =
        dropdownList.style.display === "none" ? "block" : "none";
    } else {
      console.error(`Dropdown with ID ${dropdownId} not found.`);
    }
  }

  // Load individual task state from local storage
  function loadTaskState(checkbox, type, index) {
    const savedState = JSON.parse(localStorage.getItem(`${type}-tasks`)) || {};
    checkbox.checked = savedState[index] || false;
  }

  // Save individual task state to local storage
  function saveTaskState(checkbox, type, index) {
    const savedState = JSON.parse(localStorage.getItem(`${type}-tasks`)) || {};
    savedState[index] = checkbox.checked;
    localStorage.setItem(`${type}-tasks`, JSON.stringify(savedState));
  }

  // Reset daily tasks every day
  function resetDailyTasks(dailyTasks) {
    const lastDailyReset = localStorage.getItem("lastDailyReset");
    const today = new Date().toISOString().split("T")[0];

    if (lastDailyReset !== today) {
      dailyTasks.forEach((task) => (task.checked = false));
      saveAllTasks(dailyTasks, "daily");
      localStorage.setItem("lastDailyReset", today);
    }
    //console.log(lastDailyReset);
  }

  // Reset weekly tasks every Thursday
  function resetWeeklyTasks(weeklyTasks) {
    const lastWeeklyReset = localStorage.getItem("lastWeeklyReset");
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 4 = Thursday, 6 = Saturday

    // If today is Thursday and last reset was not this Thursday, reset weekly tasks
    if (
      dayOfWeek === 4 &&
      lastWeeklyReset !== today.toISOString().split("T")[0]
    ) {
      weeklyTasks.forEach((task) => (task.checked = false));
      saveAllTasks(weeklyTasks, "weekly");
      localStorage.setItem(
        "lastWeeklyReset",
        today.toISOString().split("T")[0]
      );
    }
  }

  // Save all tasks states to local storage (for resetting purposes)
  function saveAllTasks(tasks, type) {
    const taskStates = {};
    tasks.forEach((task, index) => {
      taskStates[index] = task.checked;
    });
    localStorage.setItem(`${type}-tasks`, JSON.stringify(taskStates));
  }

  function updateTime() {
    const now = new Date();

    // Format the time to show EU time (Europe/Brussels)
    const timeFormat = new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Europe/Brussels",
      hour12: false,
    });

    const formattedTime = timeFormat.format(now);
    const [day, weekday, time] = formattedTime.split(" ");
    const formattedDate = `${day} ${weekday}`;
    currentTimeElement.textContent = `${formattedDate} ${time}`;
  }

  // Update time every second
  setInterval(updateTime, 1000);
  updateTime(); // Initial call to display time immediately
});
