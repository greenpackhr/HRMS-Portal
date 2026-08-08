const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxEmbL8co7DTKuRn2il1iQ5-0j9m3JEOq_5zhJx0x4iuQYozeOkHrbdXknvS01VqsM36A/exec";

function login() {

    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();

    fetch(WEB_APP_URL + "?username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password))

    .then(response => response.json())

    .then(data => {

        console.log("LOGIN RESPONSE:", data);

        if (data.status === "success") {

            sessionStorage.setItem("orgId", data.orgId);
sessionStorage.setItem("empId", data.empId);
sessionStorage.setItem("empName", data.empName);
sessionStorage.setItem("department", data.department);
sessionStorage.setItem("designation", data.designation);
sessionStorage.setItem("role", data.role);

            alert("Login Successful");

            window.location.href = "dashboard.html";

        } else {

            alert("Invalid Username or Password");

        }

    })

    .catch(error => {

        console.log(error);
        alert("API Connection Error");

    });

}
