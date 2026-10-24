
const DASHBOARD_HOME_API =
"https://script.google.com/macros/s/AKfycbxEmbL8co7DTKuRn2il1iQ5-0j9m3JEOq_5zhJx0x4iuQYozeOkHrbdXknvS01VqsM36A/exec";

<script>
let lastDashboardData = null;
let dashboardRequestRunning = false;

function loadDashboardHomeData() {
    if (dashboardRequestRunning) return;

    dashboardRequestRunning = true;

    fetch(DASHBOARD_HOME_API + "?action=getDashboardHomeData")
        .then(response => {
            if (!response.ok) {
                throw new Error("API HTTP error: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log("DASHBOARD API RESPONSE:", data);

            if (data.status !== "success") {
                console.error("Dashboard data error:", data.message);
                return;
            }

            const currentData = JSON.stringify({
                birthdays: data.birthdays || [],
                newJoiners: data.newJoiners || [],
                notices: data.notices || [],
                anniversaries: data.anniversaries || []
            });

            if (currentData === lastDashboardData) {
                return;
            }

            renderBirthdays(data.birthdays || []);
            renderNewJoiners(data.newJoiners || []);
            renderNotices(data.notices || []);
            renderAnniversaries(data.anniversaries || []);

            lastDashboardData = currentData;
            console.log("Dashboard data updated");
        })
        .catch(error => {
            console.error("Dashboard Home API Error:", error);
        })
        .finally(() => {
            dashboardRequestRunning = false;
        });
}

function getInitials(name) {
    return String(name || "?")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(part => part.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();
}

function createEmployeeRow(emp, dateText, anniversary) {
    const row = document.createElement("div");
    row.className = "employee-row";

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = getInitials(emp.empName);

    const info = document.createElement("div");
    info.className = "employee-info";

    const name = document.createElement("div");
    name.className = "employee-name";
    const nameParts = String(emp.empName || "-").trim().split(/\s+/);
name.textContent = nameParts.length >= 3
    ? nameParts[0] + " " + nameParts[nameParts.length - 1]
    : nameParts.join(" ");

    const detail = document.createElement("div");
    detail.className = "employee-detail";
    detail.textContent =
        (emp.empId || "-") + " | " +
        (emp.designation || "-") + " | " +
        (emp.department || "-");

    info.append(name, detail);
    row.append(avatar, info);

    if (anniversary) {
        const years = document.createElement("div");
        years.className = "anniversary-years";

        const number = document.createElement("span");
        number.className = "anniversary-number";
        number.textContent = emp.years ?? "-";

        const label = document.createElement("span");
        label.className = "anniversary-label";
        label.textContent = "YEARS";

        years.append(number, label);
        row.appendChild(years);
    } else {
        const badge = document.createElement("div");
        badge.className = "date-badge";
        badge.textContent = dateText || "";
        row.appendChild(badge);
    }

    return row;
}

function renderEmployeeList(section, data, dateField, anniversary) {
    if (!section) {
        console.error("Dashboard employee card not found");
        return;
    }

    const list = section.querySelector(".employee-list");
    if (!list) {
        console.error("Employee list missing in dashboard card");
        return;
    }

    list.replaceChildren();

    if (!data.length) {
        const empty = document.createElement("div");
        empty.className = "employee-row";
        empty.textContent = "No records for this month";
        list.appendChild(empty);
        return;
    }

    data.forEach(emp => {
        list.appendChild(
            createEmployeeRow(emp, emp[dateField], anniversary)
        );
    });
}

function renderBirthdays(data) {
    const grid = document.querySelector(".dashboard-grid");
    const section = grid?.querySelectorAll(".dashboard-card")[0];

    renderEmployeeList(section, data, "dob", false);
}

function renderNewJoiners(data) {
    const grid = document.querySelector(".dashboard-grid");
    const section = grid?.querySelectorAll(".dashboard-card")[1];

    renderEmployeeList(section, data, "doj", false);
}

function renderAnniversaries(data) {
    const section = document.getElementById("anniversaryCard");

    renderEmployeeList(section, data, "doj", true);
}

function renderNotices(data) {
    const section = document.querySelector(".notice-card");
    const list = section?.querySelector(".notice-list");

    if (!list) {
        console.error("Notice list not found");
        return;
    }

    list.replaceChildren();

    if (!data.length) {
        const item = document.createElement("div");
        item.className = "notice-item";

        const content = document.createElement("div");
        content.className = "notice-content";

        const title = document.createElement("div");
        title.className = "notice-title";
        title.textContent = "No Active Notices";

        const message = document.createElement("div");
        message.className = "notice-text";
        message.textContent =
            "There are currently no active HR notices.";

        content.append(title, message);
        item.append(content);
        list.appendChild(item);
        return;
    }

    data.forEach(notice => {
        const item = document.createElement("div");
        item.className = "notice-item";

        const pin = document.createElement("div");
        pin.className = "notice-pin";
        pin.textContent = "📌";

        const content = document.createElement("div");
        content.className = "notice-content";

        const title = document.createElement("div");
        title.className = "notice-title";
        title.textContent = notice.noticeTitle || "";

        const message = document.createElement("div");
        message.className = "notice-text";
        message.textContent = notice.noticeText || "";

        const date = document.createElement("div");
        date.className = "notice-date";
        date.textContent = notice.noticeDate || "";

        content.append(title, message);
        item.append(pin, content, date);
        list.appendChild(item);
    });
}

function toggleMenu(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const menu = document.getElementById("sideMenu");
    const overlay = document.getElementById("menuOverlay");

    if (!menu) {
        console.error("Sidebar #sideMenu not found");
        return;
    }

    const isOpen = !menu.classList.contains("active");
    menu.classList.toggle("active", isOpen);

    if (overlay) {
        overlay.classList.toggle("active", isOpen);
    }
}

function closeMenu() {
    document.getElementById("sideMenu")
        ?.classList.remove("active");

    document.getElementById("menuOverlay")
        ?.classList.remove("active");
}

/* PAID HOLIDAYS 2026 */

const paidHolidays2026 = [
    { day: 26, month: 0, name: "Republic Day" },
    { day: 3, month: 2, name: "Holi - Dhulivandan" },
    { day: 1, month: 4, name: "Maharashtra Day" },
    { day: 15, month: 7, name: "Independence Day" },
    { day: 2, month: 9, name: "Mahatma Gandhi Jayanti" },
    { day: 20, month: 9, name: "Dussera" },
    { day: 9, month: 10, name: "Diwali" },
    { day: 10, month: 10, name: "Diwali - Padwa" },
    { day: 11, month: 10, name: "Diwali - Bhaubeej" }
];

function renderCurrentMonthHolidays() {
    const holidayList = document.getElementById("holidayList");
    if (!holidayList) return;

    const today = new Date();
    holidayList.replaceChildren();

    if (today.getFullYear() !== 2026) return;

    const monthNames = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    paidHolidays2026
        .filter(holiday => holiday.month === today.getMonth())
        .forEach(holiday => {
            const item = document.createElement("div");
            item.className = "holiday-item";

            item.innerHTML = `
                <div class="holiday-date">
                    <span class="holiday-day">${holiday.day}</span>
                    <span class="holiday-month">${monthNames[holiday.month]}</span>
                </div>
                <div class="holiday-info">
                    <div class="holiday-name"></div>
                    <div class="holiday-type">Paid Holiday</div>
                </div>
                <div class="paid-badge">PAID</div>
            `;

            item.querySelector(".holiday-name").textContent =
                holiday.name;

            holidayList.appendChild(item);
        });
}

function initializeDashboardHome() {
    loadDashboardHomeData();
    renderCurrentMonthHolidays();

    // Refresh dashboard data every 3 seconds.
    setInterval(loadDashboardHomeData, 3000);
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeDashboardHome,
        { once: true }
    );
} else {
    initializeDashboardHome();
}

