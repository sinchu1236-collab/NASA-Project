// ===================================
// LUNAR NAVIGATOR - HOMEPAGE
// ===================================

// 1. LIVE DATE AND TIME

function updateMissionClock() {
    const now = new Date();

    const dateElement = document.getElementById("currentDate");
    const timeElement = document.getElementById("currentTime");

    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString("en-IN", {
            hour12: false,
        });
    }
}

// Update clock without refreshing the page.
updateMissionClock();
setInterval(updateMissionClock, 1000);

// 2. MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");

        menuToggle.textContent = navLinks.classList.contains("open")
            ? "✕"
            : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.textContent = "☰";
        });
    });
}

// 3. START MISSION BUTTON

const startMissionButton = document.getElementById("startMission");
const toast = document.getElementById("toast");

function showMessage(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

if (startMissionButton) {
    startMissionButton.addEventListener("click", () => {
        showMessage("MISSION CONTROL INITIALIZED — SIMULATION MODE");

        document.getElementById("mission").scrollIntoView({
            behavior: "smooth",
        });
    });
}

// 4. NAVIGATION ACTIVE STATE

const sections = document.querySelectorAll(
    "#home, #mission, #explorer, #analysis, #simulation",
);

const navigationItems = document.querySelectorAll(".nav-links a");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    navigationItems.forEach((link) => {
                        link.classList.remove("active");

                        if (
                            link.getAttribute("href") ===
                            "#" + entry.target.id
                        ) {
                            link.classList.add("active");
                        }
                    });
                }
            });
        },
        {
            threshold: 0.25,
        },
    );

    sections.forEach((section) => observer.observe(section));
}

console.log("Lunar Navigator homepage initialized successfully.");
