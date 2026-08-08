```javascript
function formatDate(dateValue) {

    if (!dateValue) return "";

    let date = new Date(dateValue);

    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let year = date.getFullYear();

    return day + "/" + month + "/" + year;
}


/* =====================================================
   API URL
===================================================== */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxEmbL8co7DTKuRn2il1iQ5-0j9m3JEOq_5zhJx0x4iuQYozeOkHrbdXknvS01VqsM36A/exec";


/* =====================================================
   CALCULATE DAYS
===================================================== */

function calculateDays(fromDate, toDate) {

    let start = new Date(fromDate);
    let end = new Date(toDate);

    let difference = end - start;

    let days =
        Math.floor(
            difference / (1000 * 60 * 60 * 24)
        ) + 1;

    return days;
}


/* =====================================================
   APPLY LEAVE
===================================================== */

function applyLeave() {

    const empId =
        localStorage.getItem("empId");

    const empName =
        localStorage.getItem("empName");

    const orgId =
        localStorage.getItem("orgId");


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

    if (
        !leaveType ||
        !fromDate ||
        !toDate ||
        !reason
    ) {

        alert("Please fill all fields.");

        return;
    }


    const days =
        calculateDays(
            fromDate,
            toDate
        );


    /* =====================================================
       MEDICAL FILE VALIDATION
    ===================================================== */

    if (
        leaveType === "SL" &&
        days > 3
    ) {

        if (
            !medicalFile ||
            !medicalFile.files.length
        ) {

            if (medicalBox) {

                medicalBox.style.display =
                    "block";

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
       SUBMIT LEAVE
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


        console.log(
            "LEAVE URL:",
            url
        );


        fetch(url)

        .then(res => res.json())

        .then(data => {

            console.log(
                "Leave Response:",
                data
            );


            /* =================================================
               LEAVE SUBMISSION FAILED
            ================================================= */

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
               MEDICAL FILE EXISTS
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
       FINISH LEAVE APPLICATION
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


        const medicalFileElement =
            document.getElementById(
                "medicalFitness"
            );


        if (medicalFileElement) {

            medicalFileElement.value = "";

        }


        if (medicalBox) {

            medicalBox.style.display =
                "none";

        }


        loadLeaveHistory();

    }


    /* =====================================================
       START LEAVE SUBMISSION
    ===================================================== */

    submitLeave();

}


/* =====================================================
   UPLOAD MEDICAL CERTIFICATE
   POST VERSION
===================================================== */

function uploadMedicalCertificateFile(
    leaveId,
    file
) {

    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            const dataUrl =
                event.target.result;


            /* =================================================
               REMOVE DATA URL PREFIX
            ================================================= */

            const fileData =
                dataUrl.split(",")[1];


            /* =================================================
               CREATE POST DATA
            ================================================= */

            const uploadData = {

                action:
                    "uploadMedicalCertificate",

                leaveId:
                    leaveId,

                fileName:
                    file.name,

                mimeType:
                    file.type,

                fileData:
                    fileData

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


            /* =================================================
               POST TO GOOGLE APPS SCRIPT
            ================================================= */

            fetch(
                API_URL,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(
                            uploadData
                        )

                }
            )

            .then(
                res =>
                    res.json()
            )

            .then(
                data => {

                    console.log(
                        "Medical Upload Response:",
                        data
                    );


                    /* =========================================
                       UPLOAD SUCCESS
                    ========================================= */

                    if (
                        data.status ===
                        "success"
                    ) {

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


                        const medicalFileElement =
                            document.getElementById(
                                "medicalFitness"
                            );


                        if (
                            medicalFileElement
                        ) {

                            medicalFileElement.value =
                                "";

                        }


                        const medicalBoxElement =
                            document.getElementById(
                                "medicalFitnessBox"
                            );


                        if (
                            medicalBoxElement
                        ) {

                            medicalBoxElement.style.display =
                                "none";

                        }


                        loadLeaveHistory();

                    }


                    /* =========================================
                       UPLOAD FAILED
                    ========================================= */

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

                }
            )

            .catch(
                error => {

                    console.log(
                        "Medical Upload Error:",
                        error
                    );


                    alert(
                        "Leave was submitted, but medical certificate upload failed."
                    );

                }
            );

        };


    /* =====================================================
       FILE READER ERROR
    ===================================================== */

    reader.onerror =
        function() {

            alert(
                "Unable to read medical certificate."
            );

        };


    /* =====================================================
       READ FILE
    ===================================================== */

    reader.readAsDataURL(file);

}


/* =====================================================
   LOAD LEAVE HISTORY
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

    .then(
        res =>
            res.json()
    )

    .then(
        data => {

            alert(
                "Cancellation request sent"
            );


            loadLeaveHistory();

        }
    )

    .catch(
        error => {

            console.log(
                "Cancel Error:",
                error
            );


            alert(
                "Error sending cancellation request"
            );

        }
    );

}


/* =====================================================
   PAGE LOAD
===================================================== */

window.onload =
    function() {

        loadLeaveHistory();

    };
```
