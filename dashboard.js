alert("dashboard.js loaded");

const ATTENDANCE_API_URL = "https://script.google.com/macros/s/AKfycbyhViSL9iKxd-T9EvI274zr6C71y0FuNfRQyAVhwGna0O7_DOvKJhrz7ej19w7ml3bo/exec";

// Read data from Local Storage
let empId = localStorage.getItem("empId");
let empName = localStorage.getItem("empName");
let department = localStorage.getItem("department");
let designation = localStorage.getItem("designation");
let role = localStorage.getItem("role");

if (role === "Superuser") {
    document.getElementById("leaveApprovalBtn").style.display = "inline-block";
}

// Display Employee Details
document.getElementById("empId").innerText = empId;
document.getElementById("empName").innerText = empName;
document.getElementById("department").innerText = department || "-";
document.getElementById("designation").innerText = designation || "-";

// Attendance Summary
let present = 0;
let absent = 0;
let weeklyOff = 0;
let payDays = 0;
let attendanceData = [];

// Load Attendance
fetch(ATTENDANCE_API_URL + "?orgId=" + encodeURIComponent(empId))
.then(response => response.json())
.then(data => {

    console.log("ATTENDANCE:", data);
    attendanceData = data.attendance;

loadMonthDropdown();
    console.log("FIRST DATE:", data.attendance[0].shiftDate);

    let table = document.getElementById("attendanceTable");
    table.innerHTML = "";

    data.attendance.sort((a, b) => {

    let [dayA, monthA, yearA] = a.shiftDate.split("-");
    let [dayB, monthB, yearB] = b.shiftDate.split("-");

    return new Date(yearA, monthA - 1, dayA) -
           new Date(yearB, monthB - 1, dayB);

});  
    data.attendance.forEach(row => {

        let tr = document.createElement("tr");

        let statusClass = "";

switch (row.status) {

    case "P":
        statusClass = "status-p";
        break;

    case "A":
        statusClass = "status-a";
        break;

    case "P | A":
    case "A | P":
        statusClass = "status-halfday";
        break;

    case "WO":
        statusClass = "status-wo";
        break;

    case "PH":
        statusClass = "status-ph";
        break;

    case "CL":
        statusClass = "status-cl";
        break;

    case "SL":
        statusClass = "status-sl";
        break;

    case "PL":
        statusClass = "status-pl";
        break;

    case "OD":
        statusClass = "status-od";
        break;

    default:
        statusClass = "status-default";
}

tr.innerHTML = `
    <td>${row.shiftDate}</td>
    <td>${row.schedule}</td>
    <td>${row.actualIn}</td>
    <td>${row.actualOut}</td>
    <td>${row.workTime}</td>
    <td><span class="${statusClass}">${row.status}</span></td>
`;

        table.appendChild(tr);

        // Summary Count
        if (row.status === "P") present++;
        if (row.status === "A") absent++;
        if (row.status === "WO") weeklyOff++;

        payDays += Number(row.payDay) || 0;

    });

    // Update Summary Cards
    document.getElementById("present").innerText = present;
    document.getElementById("absent").innerText = absent;
    document.getElementById("wo").innerText = weeklyOff;
    document.getElementById("payday").innerText = payDays;

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

    // Clear existing options
    select.innerHTML = "";

    let monthNames = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    let months = [...new Set(
        attendanceData.map(row => {

            let parts = row.shiftDate.split("-");

            return parts[1] + "-" + parts[2];

        })
    )];

    // Sort months chronologically
    months.sort((a, b) => {

        let [monthA, yearA] = a.split("-");
        let [monthB, yearB] = b.split("-");

        return new Date(
            2000 + Number(yearA),
            Number(monthA) - 1
        ) -
        new Date(
            2000 + Number(yearB),
            Number(monthB) - 1
        );

    });

    months.forEach(month => {

        let parts = month.split("-");

        let monthNumber = Number(parts[0]);
        let year = parts[1];

        let option = document.createElement("option");

        option.value = month;

        option.textContent =
            monthNames[monthNumber - 1] + "-" + year;

        select.appendChild(option);

    });

    // Select latest available month by default
    if (months.length > 0) {

        select.value = months[months.length - 1];

        filterMonth();

    }

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

        switch (row.status) {

            case "P":
                statusClass = "status-p";
                break;

            case "A":
                statusClass = "status-a";
                break;

            case "P | A":
            case "A | P":
                statusClass = "status-halfday";
                break;

            case "WO":
                statusClass = "status-wo";
                break;

            case "PH":
                statusClass = "status-ph";
                break;

            case "CL":
                statusClass = "status-cl";
                break;

            case "SL":
                statusClass = "status-sl";
                break;

            case "PL":
                statusClass = "status-pl";
                break;

            case "OD":
                statusClass = "status-od";
                break;

            default:
                statusClass = "status-default";
        }

        tr.innerHTML =
            `<td>${row.shiftDate}</td>
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

    document.getElementById("present").innerText = present;
    document.getElementById("absent").innerText = absent;
    document.getElementById("wo").innerText = weeklyOff;
    document.getElementById("payday").innerText = payDays;

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

            return (
                parts[1] + "-" + parts[2]
            ) === selectedMonth;

        });

    }

    displayAttendance(filteredData);

}
