const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.getElementById("nav-links");
const mobileMenu = window.matchMedia("(max-width: 640px)");

function closeMenu() {
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "Menú";
}

menuToggle.hidden = false;
navbar.classList.add("menu-ready");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "Cerrar" : "Menú";
});

navLinks.addEventListener("click", event => {
    if (event.target.closest("a")) {
        if (mobileMenu.matches) {
            menuToggle.focus();
        }
        closeMenu();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
        closeMenu();
        menuToggle.focus();
    }
});

document.addEventListener("click", event => {
    if (!navbar.contains(event.target)) {
        closeMenu();
    }
});

mobileMenu.addEventListener("change", closeMenu);

const calendarImage = document.getElementById("github-calendar-image");
const calendarStatus = document.getElementById("github-calendar-status");
calendarImage.addEventListener("error", () => {
    calendarStatus.textContent = "No se pudo cargar el calendario. Consulta tu actividad en el enlace a GitHub.";
});
if (window.location.hostname === "gabrielzeballos5432-ops.github.io") {
    calendarImage.src = calendarImage.dataset.liveSrc;
}

// Content stays visible even without JavaScript or IntersectionObserver.
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".card").forEach(card => observer.observe(card));
}
