const API_URL = "YOUR_WEB_APP_URL";


window.onload = function(){

    let role = localStorage.getItem("role");

    if(role !== "Superuser"){
        alert("Access Denied");
        window.location.href = "dashboard.html";
        return;
    }

    loadLeaves();

};


function loadLeaves(){

    fetch(API_URL + "?action=getLeaves")

    .then(res => res.json())

    .then(data => {

        let table = document.getElementById("leaveTable");

        table.innerHTML="";


        data.forEach(row => {

            if(row.status=="Pending"){

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

            <td>
            ${row.status}
            </td>


            <td>

            <button onclick="updateLeave('${row.leaveId}','Approved')">
            Approve
            </button>


            <button onclick="updateLeave('${row.leaveId}','Rejected')">
            Reject
            </button>

            </td>

            </tr>

            `;

            }

        });


    });

}



function updateLeave(id,status){

fetch(API_URL+
"?action=updateLeave"+
"&id="+id+
"&status="+status)

.then(res=>res.json())

.then(data=>{

alert("Leave "+status);

loadLeaves();

});


}
