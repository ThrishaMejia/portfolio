
const portfolio = document.getElementById("portfolio");

function updatePortfolio() {
    const activities = document.querySelectorAll(".activity-page");
    const toc = document.getElementById("toc-list");

    toc.innerHTML = "";

    activities.forEach((activity, index) => {
        const title = activity.querySelector(".section-heading h1");
        const date = activity.querySelector(".activity-date");

        const activityTitle = title
            ? title.innerText.trim()
            : activity.dataset.title || "Untitled Activity";

        const activityDate = date
            ? date.innerText.trim()
            : activity.dataset.date || "No date";

        const pageNumber = index + 4;

        activity.querySelector(".activity-number").textContent =
            String(index + 1).padStart(2, "0");

        activity.querySelector(".page-number").textContent =
            String(pageNumber).padStart(2, "0");

        const entry = document.createElement("div");
        entry.className = "toc-entry";

        entry.innerHTML = `
            <span class="toc-number">
                ${String(index + 1).padStart(2, "0")}
            </span>
            <div class="toc-info">
                <h3></h3>
                <p></p>
            </div>
            <span class="toc-page">${pageNumber}</span>
        `;

        entry.querySelector("h3").textContent = activityTitle;
        entry.querySelector("p").textContent = activityDate;

        toc.appendChild(entry);
    });
}

// ADD NEW ACTIVITY PAGE
function addActivity() {
    const activities = document.querySelectorAll(".activity-page");
    const number = activities.length + 1;

    const page = document.createElement("section");
    page.className = "page activity-page";
    page.dataset.title = `Activity ${number}`;
    page.dataset.date = "Add date here";

    page.innerHTML = `
        <div class="page-header">
            <span>ACTIVITY DOCUMENTATION</span>
            <span class="activity-number"></span>
        </div>

        <div class="section-heading">
            <span class="eyebrow">LEARNING EXPERIENCE</span>
            <h1 contenteditable="true">Activity ${number}</h1>
            <div class="heading-line"></div>
        </div>

        <div class="activity-date" contenteditable="true">
            DATE: Add date here
        </div>

        <h3 class="content-label">ACTIVITY DESCRIPTION</h3>
        <p contenteditable="true">
            Write your activity description here.
        </p>

        <h3 class="content-label">DOCUMENTATION / OUTPUT</h3>
        <div class="image-placeholder">
            <label>
                <span>+ INSERT SCREENSHOT OR ACTIVITY PHOTO</span>
                <input type="file" accept="image/*" class="activity-upload">
                <img class="activity-preview" alt="Activity documentation">
            </label>
        </div>

        <h3 class="content-label">PERSONAL REFLECTION</h3>
        <p contenteditable="true">
            Write your personal reflection here.
        </p>

        <div class="page-footer">
            <span>ACTIVITY DOCUMENTATION</span>
            <span class="page-number"></span>
        </div>
    `;

    const reflection = [...portfolio.children].find(
        section => section.querySelector(".closing-message")
    );

    portfolio.insertBefore(page, reflection);

    updatePortfolio();
    page.scrollIntoView({ behavior: "smooth" });
}

// IMAGE UPLOADS
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

// REFRESH TABLE OF CONTENTS WHEN TITLES CHANGE
document.addEventListener("input", function(event) {
    if (
        event.target.closest(".activity-page") ||
        event.target.classList.contains("activity-date")
    ) {
        updatePortfolio();
    }
});

updatePortfolio();
