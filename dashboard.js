alert("dashboard.js loaded");
const ATTENDANCE_API_URL = "https://script.google.com/macros/s/AKfycbyhViSL9iKxd-T9EvI274zr6C71y0FuNfRQyAVhwGna0O7_DOvKJhrz7ej19w7ml3bo/exec";


let empId = localStorage.getItem("empId");

document.getElementById("empId").innerText = empId;

let empName = localStorage.getItem("empName");

document.getElementById("empName").innerText = empName;


fetch(ATTENDANCE_API_URL + "?orgId=" + empId)

.then(response => response.json())

.then(data => {

    console.log("ATTENDANCE:", data);


    let table = document.getElementById("attendanceTable");


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


    });


})

.catch(error => {

    console.log(error);
    alert("Attendance API Error");

});
