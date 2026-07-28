const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxEmbL8co7DTKuRn2il1iQ5-0j9m3JEOq_5zhJx0x4iuQYozeOkHrbdXknvS01VqsM36A/exec";


function login() {

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;


    fetch(WEB_APP_URL + "?username=" + username + "&password=" + password)

    .then(response => response.json())

    .then(data => {

        console.log(data);

        if(data.status === "success") {

            alert("Login Successful");

            localStorage.setItem("empId", data.empId);
            localStorage.setItem("empName", data.empName);
            localStorage.setItem("role", data.role);
            
            window.location.href = "dashboard.html";

        } 
        else {

            alert("Invalid Username or Password");

        }

    })

    .catch(error => {

        console.log(error);
        alert("API Connection Error");

    });

}
