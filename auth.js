
(function () {
    "use strict";

    var LOGIN_PAGE = "index.html";
    var IDLE_LIMIT = 5 * 60 * 1000;
    var CHECK_INTERVAL = 10000;
    var lastActivityUpdate = 0;

    function goToLogin() {
        localStorage.removeItem("hrmsLoggedIn");
        localStorage.removeItem("hrmsLastActivity");

        window.location.replace(LOGIN_PAGE);
    }

    function isLoginPage() {
        return window.location.pathname.endsWith("/index.html") ||
               window.location.pathname.endsWith("/");
    }

    if (isLoginPage()) {
        return;
    }

    function checkLogin() {
        var loggedIn = localStorage.getItem("hrmsLoggedIn") === "true";
        var empId = localStorage.getItem("empId");
        var lastActivity = Number(
            localStorage.getItem("hrmsLastActivity") || 0
        );

        if (!loggedIn || !empId || !lastActivity) {
            goToLogin();
            return false;
        }

        if (Date.now() - lastActivity >= IDLE_LIMIT) {
            goToLogin();
            return false;
        }

        return true;
    }

    if (!checkLogin()) {
        return;
    }

    // Restrict the Leave Approval page to Superusers.
    var pageName = window.location.pathname.split("/").pop();

    if (
        pageName === "hr-leave.html" &&
        localStorage.getItem("role") !== "Superuser"
    ) {
        window.location.replace("dashboard-home.html");
        return;
    }

    function recordActivity() {
        if (Date.now() - lastActivityUpdate < 10000) {
            return;
        }

        lastActivityUpdate = Date.now();
        localStorage.setItem("hrmsLastActivity", Date.now().toString());
    }

    ["click", "keydown", "mousemove", "scroll", "touchstart"].forEach(
        function (eventName) {
            document.addEventListener(eventName, recordActivity, {
                passive: true
            });
        }
    );

    // Check inactivity and login status every 10 seconds.
    setInterval(function () {
        checkLogin();
    }, CHECK_INTERVAL);

    // Keep activity time synchronized across tabs.
    window.addEventListener("storage", function (event) {
        if (
            event.key === "hrmsLoggedIn" ||
            event.key === "hrmsLastActivity" ||
            event.key === "empId"
        ) {
            checkLogin();
        }
    });

    // Handle the existing Logout menu if it is present.
    var logoutButton = document.getElementById("logoutMenu");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.clear();
            window.location.replace(LOGIN_PAGE);
        });
    }
})();

