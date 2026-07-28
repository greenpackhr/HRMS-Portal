const empId = localStorage.getItem("empId");
const empName = localStorage.getItem("empName");

document.getElementById("empId").innerText = empId;
document.getElementById("empName").innerText = empName;

function logout() {

    localStorage.clear();

    window.location.href = "index.html";

}
