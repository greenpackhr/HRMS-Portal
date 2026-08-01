const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxEmbL8co7DTKuRn2il1iQ5-0j9m3JEOq_5zhJx0x4iuQYozeOkHrbdXknvS01VqsM36A/exec";

function login() {

    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();

    fetch(WEB_APP_URL + "?username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password))

    .then(response => response.json())

    .then(data => {


    console.log("LOGIN RESPONSE:", data);

    localStorage.setItem("orgId", data.orgId);
    localStorage.setItem("empId", data.empId);
    localStorage.setItem("empName", data.empName);
    localStorage.setItem("role", data.role);

});

        if (data.status === "success") {

            localStorage.setItem("empId", data.empId);
            localStorage.setItem("empName", data.empName);
            localStorage.setItem("department", data.department);      // NEW
            localStorage.setItem("designation", data.designation);    // NEW
            localStorage.setItem("role", data.role);

            alert("Login Successful");

            setTimeout(function () {

                window.location.href = "dashboard.html";

            }, 500);

        } else {

            alert("Invalid Username or Password");

        }

    })

    .catch(error => {

        console.log(error);
        alert("API Connection Error");

    });

}
