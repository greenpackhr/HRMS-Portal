const API_URL = "https://script.google.com/macros/s/AKfycbxEmbL8co7DTKuRn2il1iQ5-0j9m3JEOq_5zhJx0x4iuQYozeOkHrbdXknvS01VqsM36A/exec";

function applyLeave() {

    const empId = localStorage.getItem("empId");
    const empName = localStorage.getItem("empName");

    const leaveType = document.getElementById("leaveType").value;
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const reason = document.getElementById("reason").value;

    if (!leaveType || !fromDate || !toDate || !reason) {
        alert("Please fill all fields.");
        return;
    }

    const url =
        API_URL +
        "?action=applyLeave" +
        "&orgId=" + encodeURIComponent(localStorage.getItem("orgId")) +
        "&empId=" + encodeURIComponent(empId) +
        "&empName=" + encodeURIComponent(empName) +
        "&leaveType=" + encodeURIComponent(leaveType) +
        "&fromDate=" + encodeURIComponent(fromDate) +
        "&toDate=" + encodeURIComponent(toDate) +
        "&days=1" +
        "&reason=" + encodeURIComponent(reason);

    console.log("LEAVE URL:", url);

fetch(url)
        .then(res => res.json())
        .then(data => {

            if (data.status === "success") {
    alert("Leave Applied Successfully");
} else {
    alert("Error: " + (data.error || data.message || JSON.stringify(data)));
}

        });

}
function formatDate(dateValue){

    if(!dateValue) return "";

    let date = new Date(dateValue);

    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let year = date.getFullYear();

    return day + "/" + month + "/" + year;

}



    
function loadLeaveHistory(){

    const empId = localStorage.getItem("empId");

    fetch(API_URL + "?action=getMyLeaves&empId=" + empId)
    .then(res => res.json())
    .then(data => {

        console.log("MY LEAVE HISTORY:", data);

        const table = document.getElementById("historyTable");

        table.innerHTML = "";

        data.forEach(leave => {

            table.innerHTML += `
<tr>
    <td>${leave.leaveType}</td>
    <td>${formatDate(leave.fromDate)}</td>
    <td>${formatDate(leave.toDate)}</td>
    <td>${leave.days}</td>
    <td>${leave.status}</td>
</tr>
`;

        });

    })
    .catch(error=>{
        console.log("Leave History Error:",error);
    });

}


window.onload = function(){
    loadLeaveHistory();
};
