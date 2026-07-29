alert("dashboard.js loaded");

const ATTENDANCE_API_URL = "https://script.google.com/macros/s/AKfycbyhViSL9iKxd-T9EvI274zr6C71y0FuNfRQyAVhwGna0O7_DOvKJhrz7ej19w7ml3bo/exec";

// Read data from Local Storage
let empId = localStorage.getItem("empId");
let empName = localStorage.getItem("empName");
let department = localStorage.getItem("department");
let designation = localStorage.getItem("designation");

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

// Load Attendance
fetch(ATTENDANCE_API_URL + "?orgId=" + encodeURIComponent(empId))
.then(response => response.json())
.then(data => {

    console.log("ATTENDANCE:", data);

    let table = document.getElementById("attendanceTable");
    table.innerHTML = "";

    data.attendance.forEach(row => {

        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${row.shiftDate}</td>
            <td>${row.schedule}</td>
            <td>${row.actualIn}</td>
            <td>${row.actualOut}</td>
            <td>${row.workTime}</td>
            <td>${row.status}</td>
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
