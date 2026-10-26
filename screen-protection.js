
(function () {
    "use strict";

    if (window.__greenpackScreenProtectionLoaded) {
        return;
    }

    window.__greenpackScreenProtectionLoaded = true;

    function createProtection() {
        if (document.getElementById("hrmsScreenProtection")) {
            return;
        }

        var overlay = document.createElement("div");
        overlay.id = "hrmsScreenProtection";

        overlay.innerHTML =
            '<div style="text-align:center;padding:24px;">' +
            '<div style="font-size:36px;">&#128274;</div>' +
            '<h2>GREENPACK HRMS</h2>' +
            '<p>Screen protection is active.</p>' +
            '</div>';

        Object.assign(overlay.style, {
            position: "fixed",
            inset: "0",
            background: "#123b28",
            color: "#ffffff",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            zIndex: "2147483647",
            fontFamily: "Arial, sans-serif"
        });

        document.body.appendChild(overlay);

        function protectScreen() {
            overlay.style.display = "flex";
        }

        function restoreScreen() {
            overlay.style.display = "none";
        }

        document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
                protectScreen();
            } else {
                restoreScreen();
            }
        });

        window.addEventListener("blur", protectScreen);

        window.addEventListener("focus", function () {
            if (!document.hidden) {
                restoreScreen();
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createProtection);
    } else {
        createProtection();
    }
})();

