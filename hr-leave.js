function formatDate(dateValue){

    if(!dateValue) return "";

    let date = new Date(dateValue);

    if(isNaN(date)){
        return dateValue;
    }

    let day = String(date.getDate()).padStart(2,"0");
    let month = String(date.getMonth()+1).padStart(2,"0");
    let year = date.getFullYear();

    return day + "/" + month + "/" + year;

}



const API_URL = "https://script.google.com/macros/s/AKfycbxEmbL8co7DTKuRn2il1iQ5-0j9m3JEOq_5zhJx0x4iuQYozeOkHrbdXknvS01VqsM36A/exec";



const role = localStorage.getItem("role");


if (role !== "Superuser") {

    alert("Access Denied");

    window.location.href = "dashboard.html";

}



window.onload = function(){

    // Initial load
    loadLeaves();

    // Check for changes every 3 seconds
    setInterval(function(){

        loadLeaves();

    }, 3000);

};


let lastLeaveData = null;
let leaveRequestRunning = false;

function loadLeaves(){

    if (leaveRequestRunning) return;

    leaveRequestRunning = true;

    fetch(API_URL + "?action=getLeaves")

    .then(res => res.json())

    .then(data => {

        console.log("Leave Data:", data);

        if(!Array.isArray(data)){
            console.error("Invalid Leave Data Received");
            return;
        }

        let currentLeaveData = JSON.stringify(data);

        if(currentLeaveData === lastLeaveData){
            console.log("No leave data changes");
            return;
        }

        console.log("Leave data changed - updating cards");

        let container = document.getElementById("leaveTable");
        let pendingCount = document.getElementById("pendingCount");

        container.innerHTML = "";

        let pending = 0;

        data.forEach(function(row) {

            let status = String(row.status || "").trim();

            if(status.toLowerCase() === "pending"){
                pending++;
            }

            let initials = String(row.empName || "")
                .split(" ")
                .map(function(name){
                    return name.charAt(0);
                })
                .join("")
                .substring(0,2)
                .toUpperCase();

            let action = "";

            if(status.toLowerCase() === "pending"){

                action = `
                    <div class="action-buttons">

                        <button
                            class="approve-btn"
                            onclick="updateLeave('${row.leaveId}','Approved')">
                            ✓ Approve
                        </button>

                        <button
                            class="reject-btn"
                            onclick="updateLeave('${row.leaveId}','Rejected')">
                            ✕ Reject
                        </button>

                    </div>
                `;

            } else {

                action = `
                    <div class="leave-type-badge">
                        ${status}
                    </div>
                `;

            }

            container.innerHTML += `

                <div class="leave-request-card">

                    <div class="request-top">

                        <div class="employee-section">

                            <div class="employee-avatar">
                                ${initials}
                            </div>

                            <div>

                                <div class="employee-name">
                                    ${row.empName || ""}
                                </div>

                                <div class="employee-details">
                                    Employee ID: ${row.empId || ""}
                                </div>

                            </div>

                        </div>

                        <div class="leave-type-badge">
                            ${row.leaveType || ""}
                        </div>

                    </div>


                    <div class="request-details">

                        <div>
                            <div class="detail-label">
                                Leave Period
                            </div>

                            <div class="detail-value">
                                ${formatDate(row.fromDate)}
                                →
                                ${formatDate(row.toDate)}
                            </div>
                        </div>


                        <div>
                            <div class="detail-label">
                                Days
                            </div>

                            <div class="detail-value">
                                ${row.days || 0} Days
                            </div>
                        </div>


                        <div>
                            <div class="detail-label">
                                Status
                            </div>

                            <div class="detail-value">
                                ${status}
                            </div>
                        </div>

                    </div>


                    <div class="reason-box">

                        <div class="reason-label">
                            Reason
                        </div>

                        <div class="reason-text">
                            ${row.reason || "No reason provided"}
                        </div>

                    </div>


                    <div class="request-bottom">

                        <div class="request-date">
                            Applied: ${formatDate(row.appliedDate)}
                        </div>

                        ${action}

                    </div>

                </div>

            `;

        });


        pendingCount.textContent = pending + " Pending";

        if(data.length === 0){

            container.innerHTML = `

                <div class="no-leaves">

                    <div class="no-leaves-icon">
                        📋
                    </div>

                    <div class="no-leaves-title">
                        No Leave Requests
                    </div>

                    <div class="no-leaves-text">
                        There are currently no leave requests to display.
                    </div>

                </div>

            `;

        }

        lastLeaveData = currentLeaveData;

    })

    .catch(err => {

        console.log("Load Leave Error:", err);

    })

    .finally(() => {

        leaveRequestRunning = false;

    });

}



function updateLeave(id,status){


console.log("Update:",id,status);



fetch(

API_URL +

"?action=updateLeave&id=" +

encodeURIComponent(id) +

"&status=" +

encodeURIComponent(status)

)


.then(res=>res.json())


.then(data=>{


    console.log(data);


    if(data.status==="success"){


        alert("Leave " + status);


        loadLeaves();


    }
    else{


        alert(data.message);


    }


})


.catch(err=>{


    console.log(err);


    alert("Error updating leave");


});


}





function deleteLeave(id){


if(!confirm("Delete this rejected leave request?")){

    return;

}



fetch(

API_URL +

"?action=deleteLeave&id=" +

encodeURIComponent(id)

)


.then(res=>res.json())


.then(data=>{


    if(data.status==="success"){


        alert("Leave Deleted Successfully");


        loadLeaves();


    }

    else{


        alert("Delete Failed");


    }


})


.catch(err=>{


    console.log(err);


    alert("Error deleting leave");


});


}
