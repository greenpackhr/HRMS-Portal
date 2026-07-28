const WEB_APP_URL = "PASTE_YOUR_WEB_APP_URL_HERE";


function login() {

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;


    fetch(WEB_APP_URL + "?username=" + username + "&password=" + password)

    .then(response => response.json())

    .then(data => {

        if(data.status == "success") {

            alert("Login Successful");

            localStorage.setItem("empId", data.empId);
            localStorage.setItem("role", data.role);

            window.location.href = "dashboard.html";

        } 
        else {

            alert("Invalid Username or Password");

        }

    })

    .catch(error => {

        alert("Connection Error");
        console.log(error);

    });

}
