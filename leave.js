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
