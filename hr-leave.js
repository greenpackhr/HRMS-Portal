const API_URL = "https://script.google.com/macros/s/AKfycbxEmbL8co7DTKuRn2il1iQ5-0j9m3JEOq_5zhJx0x4iuQYozeOkHrbdXknvS01VqsM36A/exec";

const role = localStorage.getItem("role");

if (role !== "Superuser") {
    alert("Access Denied");
    window.location.href = "dashboard.html";
}


window.onload = function () {
    loadLeaves();
};



function formatDate(dateValue){

    if(!dateValue) return "";

    let date = new Date(dateValue);

    let day = String(date.getDate()).padStart(2,"0");
    let month = String(date.getMonth()+1).padStart(2,"0");
    let year = date.getFullYear();

    return day + "/" + month + "/" + year;

}





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

<td>${formatDate(row.fromDate)}</td>

<td>${formatDate(row.toDate)}</td>

<td>${row.days}</td>

<td>${row.reason}</td>

<td>${row.status}</td>


<td>


${
row.status === "Pending"

?

`

<button onclick="updateLeave('${row.leaveId}','Approved')">
Approve
</button>


<button onclick="updateLeave('${row.leaveId}','Rejected')">
Reject
</button>

`

:

row.status === "Rejected"

?

`

<span style="color:red;font-weight:bold;">
Rejected
</span>

<br>

<button onclick="deleteLeave('${row.leaveId}')">
Delete
</button>

`

:

`

<span style="color:green;font-weight:bold;">
Approved
</span>

`

}


</td>


</tr>

`;



        });


    })

    .catch(err=>{

        console.log(err);

    });



}






function updateLeave(id,status){


fetch(

API_URL +
"?action=updateLeave&id=" +
encodeURIComponent(id) +
"&status=" +
encodeURIComponent(status)

)


.then(res=>res.json())


.then(data=>{


alert("Leave " + status);


loadLeaves();


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
