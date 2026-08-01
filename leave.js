const API_URL = "YOUR_APPS_SCRIPT_WEB_APP_URL";

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
        "&empId=" + encodeURIComponent(empId) +
        "&empName=" + encodeURIComponent(empName) +
        "&leaveType=" + encodeURIComponent(leaveType) +
        "&fromDate=" + encodeURIComponent(fromDate) +
        "&toDate=" + encodeURIComponent(toDate) +
        "&days=1" +
        "&reason=" + encodeURIComponent(reason);

    fetch(url)
        .then(res => res.json())
        .then(data => {

            if (data.status === "success") {
                alert("Leave Applied Successfully");
            } else {
                alert("Failed to apply leave.");
            }

        });

}
