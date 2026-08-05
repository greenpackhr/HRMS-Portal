const API_URL = "https://script.google.com/macros/s/AKfycbxEmbL8co7DTKuRn2il1iQ5-0j9m3JEOq_5zhJx0x4iuQYozeOkHrbdXknvS01VqsM36A/exec";

window.onload = function () {
    loadLeaves();
};

function loadLeaves() {

    fetch(API_URL + "?action=getLeaves")
        .then(res => res.json())
        .then(data => {

            let table = document.getElementById("leaveTable");
            table.innerHTML = "";

            data.forEach(row => {

                table.innerHTML += `
                <tr>
                    <td>${row.leaveId}</td>
                    <td>${row.empId}</td>
                    <td>${row.empName}</td>
                    <td>${row.leaveType}</td>
                    <td>${row.fromDate}</td>
                    <td>${row.toDate}</td>
                    <td>${row.days}</td>
                    <td>${row.reason}</td>
                    <td>${row.status}</td>
                    <td>
                        ${row.status === "Pending"
                        ? `
                            <button onclick="updateLeave('${row.leaveId}','Approved')">Approve</button>
                            <button onclick="updateLeave('${row.leaveId}','Rejected')">Reject</button>
                          `
                        : `<span style="color:red;font-weight:bold;">Rejected</span>`
                        }
                    </td>
                </tr>
                `;

            });

        })
        .catch(err => {
            console.error(err);
        });

}

function updateLeave(id, status) {

    fetch(
        API_URL +
        "?action=updateLeave&id=" +
        encodeURIComponent(id) +
        "&status=" +
        encodeURIComponent(status)
    )
    .then(res => res.json())
    .then(() => {
        alert("Leave " + status);
        loadLeaves();
    })
    .catch(err => {
        console.error(err);
        alert("Error updating leave.");
    });

}
