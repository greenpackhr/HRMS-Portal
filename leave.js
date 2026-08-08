function formatDate(dateValue){

    if(!dateValue) return "";

    let date = new Date(dateValue);

    let day = String(date.getDate()).padStart(2,"0");
    let month = String(date.getMonth()+1).padStart(2,"0");
    let year = date.getFullYear();

    return day + "/" + month + "/" + year;

}
const API_URL = "https://script.google.com/macros/s/AKfycbxEmbL8co7DTKuRn2il1iQ5-0j9m3JEOq_5zhJx0x4iuQYozeOkHrbdXknvS01VqsM36A/exec";


function calculateDays(fromDate, toDate){

    let start = new Date(fromDate);
    let end = new Date(toDate);

    let difference = end - start;

    let days = Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;

    return days;

}


function applyLeave() {

    const empId = localStorage.getItem("empId");
    const empName = localStorage.getItem("empName");
    const orgId = localStorage.getItem("orgId");

    const leaveType =
        document.getElementById("leaveType").value;

    const fromDate =
        document.getElementById("fromDate").value;

    const toDate =
        document.getElementById("toDate").value;

    const reason =
        document.getElementById("reason").value;

    const medicalBox =
        document.getElementById("medicalFitnessBox");

    const medicalFile =
        document.getElementById("medicalFitness");


    /* =====================================================
       BASIC VALIDATION
    ===================================================== */

    if (!leaveType || !fromDate || !toDate || !reason) {

        alert("Please fill all fields.");
        return;

    }


    const days =
        calculateDays(fromDate, toDate);


    /* =====================================================
       MEDICAL FILE VALIDATION
    ===================================================== */

    if (leaveType === "SL" && days > 3) {

        if (
            !medicalFile ||
            !medicalFile.files.length
        ) {

            if (medicalBox) {
                medicalBox.style.display = "block";
            }

            alert(
                "Medical Fitness Certificate is required for SL more than 3 days."
            );

            return;
        }
    }


    /* =====================================================
       CREATE LEAVE ID
    ===================================================== */

    const leaveId =
        "L" + new Date().getTime();


    /* =====================================================
       FUNCTION TO SUBMIT LEAVE
    ===================================================== */

    function submitLeave() {

        const url =
            API_URL +
            "?action=applyLeave" +
            "&orgId=" +
            encodeURIComponent(orgId) +
            "&empId=" +
            encodeURIComponent(empId) +
            "&empName=" +
            encodeURIComponent(empName) +
            "&leaveType=" +
            encodeURIComponent(leaveType) +
            "&fromDate=" +
            encodeURIComponent(fromDate) +
            "&toDate=" +
            encodeURIComponent(toDate) +
            "&days=" +
            encodeURIComponent(days) +
            "&reason=" +
            encodeURIComponent(reason) +
            "&leaveId=" +
            encodeURIComponent(leaveId);


        console.log("LEAVE URL:", url);


        fetch(url)

        .then(res => res.json())

        .then(data => {

            console.log("Leave Response:", data);


            if (data.status !== "success") {

                alert(
                    "Error: " +
                    (
                        data.error ||
                        data.message ||
                        JSON.stringify(data)
                    )
                );

                return;
            }


            /* =================================================
               IF MEDICAL FILE EXISTS
            ================================================= */

            if (
                medicalFile &&
                medicalFile.files.length
            ) {

                uploadMedicalCertificateFile(
                    leaveId,
                    medicalFile.files[0]
                );

            }

            else {

                finishLeaveApplication();

            }

        })

        .catch(error => {

            console.log(
                "Apply Leave Error:",
                error
            );

            alert(
                "Error submitting leave."
            );

        });

    }


    /* =====================================================
       UPLOAD MEDICAL CERTIFICATE
    ===================================================== */

    ```javascript
/* =====================================================
   UPLOAD MEDICAL CERTIFICATE
===================================================== */

function uploadMedicalCertificateFile(
    leaveId,
    file
) {

    const reader = new FileReader();


    reader.onload = function(event) {

        const dataUrl =
            event.target.result;


        /* REMOVE DATA URL PREFIX */
        const fileData =
            dataUrl.split(",")[1];


        const uploadUrl =
            API_URL +
            "?action=uploadMedicalCertificate" +
            "&leaveId=" +
            encodeURIComponent(leaveId) +
            "&fileName=" +
            encodeURIComponent(file.name) +
            "&mimeType=" +
            encodeURIComponent(file.type) +
            "&fileData=" +
            encodeURIComponent(fileData);


        console.log(
            "Uploading Medical Certificate..."
        );

        console.log(
            "Leave ID:",
            leaveId
        );

        console.log(
            "File Name:",
            file.name
        );

        console.log(
            "MIME Type:",
            file.type
        );

        console.log(
            "File Data Length:",
            fileData.length
        );


        fetch(uploadUrl)

        .then(res => res.json())

        .then(data => {

            console.log(
                "Medical Upload Response:",
                data
            );


            if (
                data.status === "success"
            ) {

                finishLeaveApplication();

            }

            else {

                alert(
                    "Leave was submitted, but medical certificate upload failed.\n\n" +
                    (
                        data.message ||
                        data.error ||
                        "Unknown upload error"
                    )
                );

            }

        })

        .catch(error => {

            console.log(
                "Medical Upload Error:",
                error
            );

            alert(
                "Leave was submitted, but medical certificate upload failed."
            );

        });

    };


    reader.onerror = function() {

        alert(
            "Unable to read medical certificate."
        );

    };


    reader.readAsDataURL(file);

}
```

            .catch(error => {

                console.log(
                    "Medical Upload Error:",
                    error
                );

                alert(
                    "Leave was submitted, but medical certificate upload failed."
                );

            });

        };


        reader.onerror = function() {

            alert(
                "Unable to read medical certificate."
            );

        };


        reader.readAsDataURL(file);

    }


    /* =====================================================
       FINISH
    ===================================================== */

    function finishLeaveApplication() {

        alert(
            "Leave Applied Successfully"
        );


        document.getElementById(
            "leaveType"
        ).value = "";

        document.getElementById(
            "fromDate"
        ).value = "";

        document.getElementById(
            "toDate"
        ).value = "";

        document.getElementById(
            "reason"
        ).value = "";


        const medicalFile =
    document.getElementById("medicalFitness");

if (medicalFile) {
    medicalFile.value = "";
}


        if (medicalBox) {
            medicalBox.style.display = "none";
        }


        loadLeaveHistory();

    }


    /* =====================================================
       START
    ===================================================== */

    submitLeave();

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
                <td>

${
leave.status === "Approved"

?

`
<span style="color:green;font-weight:bold;">
Approved
</span>

<br>

<button onclick="cancelLeave('${leave.leaveId}')">
Request Cancel
</button>
`

:

leave.status === "Cancellation Pending"

?

`
<span style="color:orange;font-weight:bold;">
Cancellation Pending
</span>
`

:

leave.status

}

</td>
            </tr>

            `;


        });


    })


    .catch(error=>{

        console.log("Leave History Error:", error);

    });


}



function cancelLeave(id){

    if(!confirm("Request cancellation for this approved leave?")){
        return;
    }


    fetch(
        API_URL +
        "?action=cancelLeave&id=" +
        encodeURIComponent(id)
    )


    .then(res => res.json())


    .then(data => {

        alert("Cancellation request sent");

        loadLeaveHistory();

    })


    .catch(error => {

        console.log("Cancel Error:", error);

        alert("Error sending cancellation request");

    });

}
window.onload = function(){

    loadLeaveHistory();

};
