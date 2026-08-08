function formatDate(dateValue) {

    if (!dateValue) return "";

    let date = new Date(dateValue);

    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let year = date.getFullYear();

    return day + "/" + month + "/" + year;
}

const API_URL =
    "https://script.google.com/macros/s/AKfycbxEmbL8co7DTKuRn2il1iQ5-0j9m3JEOq_5zhJx0x4iuQYozeOkHrbdXknvS01VqsM36A/exec";


function calculateDays(fromDate, toDate) {

    let start = new Date(fromDate);
    let end = new Date(toDate);

    let difference = end - start;

    return Math.floor(
        difference / (1000 * 60 * 60 * 24)
    ) + 1;
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


    if (!leaveType || !fromDate || !toDate || !reason) {

        alert("Please fill all fields.");

        return;
    }


    const days =
        calculateDays(fromDate, toDate);


    if (leaveType === "SL" && days > 3) {

        if (!medicalFile || !medicalFile.files.length) {

            if (medicalBox) {
                medicalBox.style.display = "block";
            }

            alert(
                "Medical Fitness Certificate is required for SL more than 3 days."
            );

            return;
        }
    }


    const leaveId =
        "L" + new Date().getTime();


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


        if (
            medicalFile &&
            medicalFile.files.length
        ) {

            uploadMedicalCertificateFile(
                leaveId,
                medicalFile.files[0]
            );

        } else {

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


function finishLeaveApplication() {

    alert("Leave Applied Successfully");


    document.getElementById("leaveType").value = "";

    document.getElementById("fromDate").value = "";

    document.getElementById("toDate").value = "";

    document.getElementById("reason").value = "";


    const medicalFile =
        document.getElementById("medicalFitness");

    if (medicalFile) {
        medicalFile.value = "";
    }


    const medicalBox =
        document.getElementById("medicalFitnessBox");

    if (medicalBox) {
        medicalBox.style.display = "none";
    }


    loadLeaveHistory();

}


/* =====================================================
   MEDICAL CERTIFICATE UPLOAD - POST
===================================================== */

function uploadMedicalCertificateFile(leaveId, file) {

    const reader = new FileReader();


    reader.onload = function(event) {

        const dataUrl =
            event.target.result;

        const fileData =
            dataUrl.split(",")[1];


        const uploadData = {

            action: "uploadMedicalCertificate",

            leaveId: leaveId,

            fileName: file.name,

            mimeType: file.type,

            fileData: fileData

        };


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


        fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8"
            },

            body: JSON.stringify(uploadData)

        })

        .then(res => res.json())

        .then(data => {

            console.log(
                "Medical Upload Response:",
                data
            );


            if (data.status === "success") {

                finishLeaveApplication();

            } else {

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


/* =====================================================
   LEAVE HISTORY
===================================================== */

function loadLeaveHistory() {

    const empId =
        localStorage.getItem("empId");


    fetch(
        API_URL +
        "?action=getMyLeaves&empId=" +
        encodeURIComponent(empId)
    )

    .then(res => res.json())

    .then(data => {

        console.log(
            "MY LEAVE HISTORY:",
            data
        );


        const table =
            document.getElementById("historyTable");


        if (!table) {
            return;
        }


        table.innerHTML = "";


        data.forEach(function(leave) {

            let statusHtml = "";


            if (leave.status === "Approved") {

                statusHtml =
                    '<span style="color:green;font-weight:bold;">' +
                    'Approved' +
                    '</span>' +
                    '<br>' +
                    '<button onclick="cancelLeave(\'' +
                    leave.leaveId +
                    '\')">' +
                    'Request Cancel' +
                    '</button>';

            }

            else if (
                leave.status === "Cancellation Pending"
            ) {

                statusHtml =
                    '<span style="color:orange;font-weight:bold;">' +
                    'Cancellation Pending' +
                    '</span>';

            }

            else {

                statusHtml =
                    leave.status || "";

            }


            table.innerHTML +=
    "<tr>" +

    "<td>" +
    formatDate(leave.appliedDate) +
    "</td>" +

    "<td>" +
    (leave.leaveType || "") +
    "</td>" +

    "<td>" +
    formatDate(leave.fromDate) +
    "</td>" +

    "<td>" +
    formatDate(leave.toDate) +
    "</td>" +

    "<td>" +
    (leave.days || "") +
    "</td>" +

    "<td>" +
    statusHtml +
    "</td>" +

    "<td>" +
    formatDate(leave.decisionDate) +
    "</td>" +

    "</tr>";
        });

    })

    .catch(error => {

        console.log(
            "Leave History Error:",
            error
        );

    });

}


/* =====================================================
   CANCEL LEAVE
===================================================== */

function cancelLeave(id) {

    if (
        !confirm(
            "Request cancellation for this approved leave?"
        )
    ) {
        return;
    }


    fetch(
        API_URL +
        "?action=cancelLeave&id=" +
        encodeURIComponent(id)
    )

    .then(res => res.json())

    .then(data => {

        alert(
            "Cancellation request sent"
        );

        loadLeaveHistory();

    })

    .catch(error => {

        console.log(
            "Cancel Error:",
            error
        );

        alert(
            "Error sending cancellation request"
        );

    });

}


/* =====================================================
   PAGE LOAD
===================================================== */
function loadLeaveBalance() {

    const empId = localStorage.getItem("empId");

    if (!empId) {
        console.log("Employee ID not found");
        return;
    }

    fetch(
        API_URL +
        "?action=getLeaveBalance&empId=" +
        encodeURIComponent(empId)
    )

    .then(res => res.json())

    .then(data => {

        console.log("LEAVE BALANCE:", data);

        if (data.status !== "success") {
            console.log(
                "Leave Balance Error:",
                data.message
            );
            return;
        }

        const clElement =
            document.getElementById("clBalance");

        const slElement =
            document.getElementById("slBalance");

        const plElement =
            document.getElementById("plBalance");

        if (clElement) {
            clElement.textContent = data.CL;
        }

        if (slElement) {
            slElement.textContent = data.SL;
        }

        if (plElement) {
            plElement.textContent = data.PL;
        }

    })

    .catch(error => {

        console.log(
            "Leave Balance Error:",
            error
        );

    });

}
window.onload = function() {

    loadLeaveHistory();
    loadLeaveBalance();

};
