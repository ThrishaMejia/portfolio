
/* =========================================
   VIOLET PORTFOLIO - WEEKLY TOC SYSTEM
========================================= */

// INITIAL PORTFOLIO DATA

let weeks = [
    {
        id: 1,
        activities: [
            {
                id: 1,
                type: "Lab",
                title: "Enter your activity title"
            },
            {
                id: 2,
                type: "Lecture",
                title: "Enter your activity title"
            }
        ]
    }
];

let nextWeekId = 2;
let nextActivityId = 3;


// =========================================
// ADD WEEK
// =========================================

function addWeek() {
    weeks.push({
        id: nextWeekId++,
        activities: []
    });

    renderPortfolio();

    const lastWeek = document.querySelector(
        `.toc-week[data-week-id="${weeks[weeks.length - 1].id}"]`
    );

    if (lastWeek) {
        lastWeek.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}


// =========================================
// DELETE WEEK
// =========================================

function deleteWeek(weekId) {
    const confirmed = confirm(
        "Are you sure you want to delete this week and all its activities?"
    );

    if (!confirmed) return;

    weeks = weeks.filter(week => week.id !== weekId);

    renderPortfolio();
}


// =========================================
// ADD ACTIVITY
// =========================================

function addActivity(weekId) {
    const type = prompt(
        "Activity type:\nType Lab or Lecture:",
        "Lab"
    );

    if (type === null) return;

    const normalizedType = type.trim().toLowerCase();

    if (!["lab", "lecture"].includes(normalizedType)) {
        alert("Please enter Lab or Lecture only.");
        return;
    }

    const title = prompt("Enter activity title:");

    if (title === null) return;

    const week = weeks.find(item => item.id === weekId);

    if (!week) return;

    week.activities.push({
        id: nextActivityId++,
        type: normalizedType === "lab" ? "Lab" : "Lecture",
        title: title.trim() || "Untitled Activity"
    });

    renderPortfolio();
}


// =========================================
// EDIT ACTIVITY
// =========================================

function editActivity(weekId, activityId) {
    const week = weeks.find(item => item.id === weekId);

    if (!week) return;

    const activity = week.activities.find(
        item => item.id === activityId
    );

    if (!activity) return;

    const newType = prompt(
        "Activity type: Lab or Lecture",
        activity.type
    );

    if (newType === null) return;

    const normalizedType = newType.trim().toLowerCase();

    if (!["lab", "lecture"].includes(normalizedType)) {
        alert("Please enter Lab or Lecture only.");
        return;
    }

    const newTitle = prompt(
        "Activity title:",
        activity.title
    );

    if (newTitle === null) return;

    activity.type = normalizedType === "lab" ? "Lab" : "Lecture";
    activity.title = newTitle.trim() || "Untitled Activity";

    renderPortfolio();
}


// =========================================
// DELETE ACTIVITY
// =========================================

function deleteActivity(weekId, activityId) {
    const confirmed = confirm(
        "Delete this activity?"
    );

    if (!confirmed) return;

    const week = weeks.find(item => item.id === weekId);

    if (!week) return;

    week.activities = week.activities.filter(
        item => item.id !== activityId
    );

    renderPortfolio();
}


// =========================================
// RENDER TABLE OF CONTENTS
// =========================================

function renderTOC() {
    const container = document.getElementById("toc-pages");

    container.innerHTML = "";

    // Four weeks per TOC page.
    // Additional weeks automatically continue
    // onto the next A4 page.

    const weeksPerPage = 4;

    const pageGroups = [];

    for (let i = 0; i < weeks.length; i += weeksPerPage) {
        pageGroups.push(
            weeks.slice(i, i + weeksPerPage)
        );
    }

    if (pageGroups.length === 0) {
        pageGroups.push([]);
    }

    pageGroups.forEach((group, pageIndex) => {
        const page = document.createElement("section");

        page.className = "page toc-page";

        const pageNumber = pageIndex + 3;

        page.innerHTML = `
            <div class="page-header">
                <span>MY DIGITAL PORTFOLIO</span>
                <span>${String(pageNumber - 2).padStart(2, "0")}</span>
            </div>

            <div class="section-heading">
                <span class="eyebrow">
                    A GUIDE THROUGH MY WORK
                </span>

                <h1>Table of Contents</h1>

                <div class="heading-line"></div>
            </div>

            <p class="toc-description">
                Activities and learning experiences arranged
                in chronological order.
            </p>

            <div class="toc-week-list"></div>

            <div class="page-footer">
                <span>TABLE OF CONTENTS</span>
                <span>${String(pageNumber).padStart(2, "0")}</span>
            </div>
        `;

        const list = page.querySelector(".toc-week-list");

        group.forEach((week, index) => {
            const weekNumber =
                pageIndex * weeksPerPage + index + 1;

            const weekElement = document.createElement("div");

            weekElement.className = "toc-week";
            weekElement.dataset.weekId = week.id;

            weekElement.innerHTML = `
                <div class="toc-week-header">
                    <h2>WEEK ${weekNumber}</h2>

                    <div class="toc-week-actions">
                        <button type="button"
                            onclick="addActivity(${week.id})">
                            + Activity
                        </button>

                        <button type="button"
                            class="delete-btn"
                            onclick="deleteWeek(${week.id})">
                            Delete
                        </button>
                    </div>
                </div>

                <div class="toc-activity-list"></div>

                <button type="button"
                    class="toc-add-activity"
                    onclick="addActivity(${week.id})">
                    + Add Activity
                </button>
            `;

            const activityList = weekElement.querySelector(
                ".toc-activity-list"
            );

            if (week.activities.length === 0) {
                const empty = document.createElement("p");

                empty.className = "toc-empty";
                empty.textContent = "No activities added yet.";

                activityList.appendChild(empty);
            }

            week.activities.forEach((activity, activityIndex) => {
                const activityElement = document.createElement("div");

                activityElement.className = "toc-activity";

                const info = document.createElement("div");
                info.className = "toc-activity-info";

                const heading = document.createElement("h3");
                heading.textContent =
                    `Activity ${activityIndex + 1}`;

                const description = document.createElement("p");
                description.textContent =
                    `${activity.type} – ${activity.title}`;

                info.appendChild(heading);
                info.appendChild(description);

                const actions = document.createElement("div");
                actions.className = "toc-activity-actions";

                const editButton = document.createElement("button");
                editButton.type = "button";
                editButton.className = "edit-btn";
                editButton.textContent = "Edit";

                editButton.onclick = () => {
                    editActivity(week.id, activity.id);
                };

                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.className = "delete-btn";
                deleteButton.textContent = "Delete";

                deleteButton.onclick = () => {
                    deleteActivity(week.id, activity.id);
                };

                actions.appendChild(editButton);
                actions.appendChild(deleteButton);

                activityElement.appendChild(info);
                activityElement.appendChild(actions);

                activityList.appendChild(activityElement);
            });

            list.appendChild(weekElement);
        });

        container.appendChild(page);
    });
}


// =========================================
// ACTIVITY DOCUMENTATION PAGES
// =========================================

function renderActivityPages() {
    const container = document.getElementById("activity-pages");

    container.innerHTML = "";

    let activityNumber = 0;

    weeks.forEach((week, weekIndex) => {
        week.activities.forEach((activity, activityIndex) => {
            activityNumber++;

            const page = document.createElement("section");

            page.className = "page activity-page";

            const tocPageCount = Math.max(
                1,
                Math.ceil(weeks.length / 4)
            );

            const pageNumber =
                2 + tocPageCount + activityNumber;

            page.innerHTML = `
                <div class="page-header">
                    <span>ACTIVITY DOCUMENTATION</span>
                    <span>${String(activityNumber).padStart(2, "0")}</span>
                </div>

                <div class="section-heading">
                    <span class="eyebrow">
                        WEEK ${weekIndex + 1} • ${activity.type.toUpperCase()}
                    </span>

                    <h1>${escapeHTML(activity.title)}</h1>

                    <div class="heading-line"></div>
                </div>

                <div class="activity-date" contenteditable="true">
                    DATE: Add date here
                </div>

                <h3 class="content-label">
                    ACTIVITY DESCRIPTION
                </h3>

                <p contenteditable="true">
                    Write the description, purpose, and instructions
                    of this activity here.
                </p>

                <h3 class="content-label">
                    DOCUMENTATION / OUTPUT
                </h3>

                <div class="image-placeholder">
                    <label>
                        <span>+ INSERT SCREENSHOT OR ACTIVITY PHOTO</span>

                        <input
                            type="file"
                            accept="image/*"
                            class="activity-upload"
                        >

                        <img
                            class="activity-preview"
                            alt="Activity documentation"
                        >
                    </label>
                </div>

                <h3 class="content-label">
                    PERSONAL REFLECTION
                </h3>

                <p contenteditable="true">
                    Write about what you learned, the challenges
                    you encountered, and your realizations.
                </p>

                <div class="page-footer">
                    <span>ACTIVITY DOCUMENTATION</span>
                    <span>${String(pageNumber).padStart(2, "0")}</span>
                </div>
            `;

            container.appendChild(page);
        });
    });
}


// =========================================
// SAFE TEXT DISPLAY
// =========================================

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}


// =========================================
// IMAGE UPLOADS
// =========================================

document.addEventListener("change", function(event) {

    if (event.target.id === "profileImage") {
        const file = event.target.files[0];

        if (!file) return;

        const preview = document.getElementById("profilePreview");
        const text = document.getElementById("profileText");

        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";

        text.style.display = "none";
    }

    if (event.target.classList.contains("activity-upload")) {
        const file = event.target.files[0];

        if (!file) return;

        const preview = event.target
            .closest("label")
            .querySelector(".activity-preview");

        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
});


// =========================================
// RENDER EVERYTHING
// =========================================

function renderPortfolio() {
    renderTOC();
    renderActivityPages();
}


// INITIAL LOAD

// INITIAL LOAD

renderPortfolio();

alert("JavaScript is working!");
