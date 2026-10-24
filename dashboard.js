alert("dashboard.js loaded");

const ATTENDANCE_API_URL = "https://script.google.com/macros/s/AKfycbyhViSL9iKxd-T9EvI274zr6C71y0FuNfRQyAVhwGna0O7_DOvKJhrz7ej19w7ml3bo/exec";

// Read data from Local Storage
let empId = localStorage.getItem("empId");
let empName = localStorage.getItem("empName");
let department = localStorage.getItem("department");
let designation = localStorage.getItem("designation");
let role = localStorage.getItem("role");

console.log("LOGIN DATA:", {
    empId: empId,
    empName: empName,
    department: department,
    designation: designation,
    role: role
});

if (role === "Superuser") {
    var leaveApprovalBtn = document.getElementById("leaveApprovalBtn");

    if (leaveApprovalBtn) {
        leaveApprovalBtn.style.display = "inline-block";
    }
}

// Display Employee Details
if (document.getElementById("empId")) {
    document.getElementById("empId").innerText = empId;
}

if (document.getElementById("empName")) {
    document.getElementById("empName").innerText = empName;
}

if (document.getElementById("department")) {
    document.getElementById("department").innerText = department || "-";
}

if (document.getElementById("designation")) {
    document.getElementById("designation").innerText = designation || "-";
}
// Attendance Summary
let present = 0;
let absent = 0;
let weeklyOff = 0;
let payDays = 0;
let attendanceData = [];
// ==========================================
// AUTO LOGOUT AFTER 5 MINUTES OF INACTIVITY
// ==========================================

let inactivityTimer;

function resetInactivityTimer() {

    clearTimeout(inactivityTimer);

    inactivityTimer = setTimeout(function () {

        alert("Your session has expired due to inactivity.");

        localStorage.clear();

        window.location.href = "index.html";

    }, 5 * 60 * 1000);
}

// Reset timer whenever user is active
document.addEventListener("mousemove", resetInactivityTimer);
document.addEventListener("mousedown", resetInactivityTimer);
document.addEventListener("keypress", resetInactivityTimer);
document.addEventListener("scroll", resetInactivityTimer);
document.addEventListener("touchstart", resetInactivityTimer);

// Start inactivity timer
resetInactivityTimer();

// Load Attendance
fetch(ATTENDANCE_API_URL + "?orgId=" + encodeURIComponent(empId))
.then(response => response.json())
.then(data => {

    console.log("ATTENDANCE:", data);

    attendanceData = data.attendance || [];

    if (attendanceData.length > 0) {

        console.log(
            "FIRST DATE:",
            attendanceData[0].shiftDate
        );

        
attendanceData.sort((a, b) => {
    function parseAttendanceDate(value) {
        const parts = value.includes("/")
            ? value.split("/")
            : value.split("-");

        const day = Number(parts[0]);
        const month = Number(parts[1]);
        const year = Number(parts[2]);

        return new Date(year, month - 1, day).getTime();
    }

    return parseAttendanceDate(b.shiftDate) -
           parseAttendanceDate(a.shiftDate);
});

    } else {

        console.log(
            "No attendance data found for employee:",
            empId
        );

    }

    loadMonthDropdown();

})
.catch(error => {

    console.log(error);
    alert("Attendance API Error");

});

// Logout
function logout() {

    localStorage.clear();
    window.location.href = "index.html";

}
function loadMonthDropdown() {

    let select = document.getElementById("monthSelect");

    if (!select) {
        console.log("monthSelect not found");
        return;
    }

    select.innerHTML = "";

    let months = [...new Set(attendanceData.map(row => {

        let parts = row.shiftDate.split("-");

        return parts[1] + "-" + parts[2];

    }))];

    
months.sort((a, b) => {
    let [monthA, yearA] = a.split("-");
    let [monthB, yearB] = b.split("-");

    return new Date(yearB, monthB - 1) -
           new Date(yearA, monthA - 1);
});

    months.forEach(month => {

        let [monthNumber, year] = month.split("-");

        let monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];

        let option = document.createElement("option");

        option.value = month;

        option.textContent =
            monthNames[Number(monthNumber) - 1] +
            "-" +
            year.substring(2);

        select.appendChild(option);

    });

    // Select latest/current month by default
    if (months.length > 0) {

        let latestMonth = months[0];

        select.value = latestMonth;

        filterMonth();
    }

}
function formatAttendanceDate(value) {
    if (!value) return "";

    const parts = String(value).split(/[-/]/);

    if (parts.length !== 3) return value;

    const day = String(parts[0]).padStart(2, "0");
    const month = String(parts[1]).padStart(2, "0");
    const year = parts[2];

    return `${day}-${month}-${year}`;
}
function displayAttendance(data) {

    let table = document.getElementById("attendanceTable");

    table.innerHTML = "";

    let present = 0;
    let absent = 0;
    let weeklyOff = 0;
    let payDays = 0;

    data.forEach(row => {

        let tr = document.createElement("tr");

        
let statusClass = "";
let rowClass = "";

switch (row.status.trim()) {
    case "P":
        statusClass = "status-p";
        rowClass = "row-present";
        break;
    case "A":
        statusClass = "status-a";
        rowClass = "row-absent";
        break;
    case "P | A":
    case "A | P":
        statusClass = "status-halfday";
        rowClass = "row-halfday";
        break;
    case "WO":
        statusClass = "status-wo";
        rowClass = "row-wo";
        break;
    case "PH":
        statusClass = "status-ph";
        rowClass = "row-ph";
        break;
    case "CL":
        statusClass = "status-cl";
        rowClass = "row-cl";
        break;
    case "SL":
        statusClass = "status-sl";
        rowClass = "row-sl";
        break;
    case "PL":
        statusClass = "status-pl";
        rowClass = "row-pl";
        break;
    case "OD":
        statusClass = "status-od";
        rowClass = "row-od";
        break;
    default:
        statusClass = "status-default";
        rowClass = "";
}

        tr.className = rowClass;
        tr.innerHTML =
            tr.innerHTML =
    `<td>${formatAttendanceDate(row.shiftDate)}</td>
     <td>${row.schedule}</td>
     <td>${row.actualIn}</td>
     <td>${row.actualOut}</td>
     <td>${row.workTime}</td>
     <td><span class="${statusClass}">${row.status}</span></td>`;

        table.appendChild(tr);

        if (row.status === "P") present++;
        if (row.status === "A") absent++;
        if (row.status === "WO") weeklyOff++;

        payDays += Number(row.payDay) || 0;

    });

    
if (document.getElementById("present")) {
    document.getElementById("present").innerText = present;
}

if (document.getElementById("absent")) {
    document.getElementById("absent").innerText = absent;
}

if (document.getElementById("wo")) {
    document.getElementById("wo").innerText = weeklyOff;
}

if (document.getElementById("payday")) {
    document.getElementById("payday").innerText = payDays;
}


}
function filterMonth() {

    let selectedMonth =
        document.getElementById("monthSelect").value;

    let filteredData;

    if (selectedMonth === "all") {

        filteredData = attendanceData;

    } else {

        filteredData = attendanceData.filter(row => {

            let parts = row.shiftDate.split("-");

            return parts[1] + "-" + parts[2] === selectedMonth;

        });

    }

    displayAttendance(filteredData);

}



function toggleMenu(event) {
    if (event) event.stopPropagation();

    var menu = document.getElementById("sideMenu");
    if (!menu) {
        console.error("Sidebar element #sideMenu not found");
        return;
    }

    var overlay = document.getElementById("menuOverlay");

    // Create the overlay if it is missing from dashboard.html
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "menuOverlay";
        document.body.appendChild(overlay);
    }

    var isOpen = menu.classList.toggle("active");
    overlay.classList.toggle("active", isOpen);
}

function closeMenu() {
    var menu = document.getElementById("sideMenu");
    var overlay = document.getElementById("menuOverlay");

    if (menu) menu.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
}

