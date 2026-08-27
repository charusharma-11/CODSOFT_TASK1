// ==============================
// MOBILE MENU
// ==============================

function toggleMenu() {
    const navLinks = document.querySelector(".nav-links");

    navLinks.classList.toggle("active");
}


// ==============================
// CLOSE MOBILE MENU AFTER CLICK
// ==============================

const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach(function (item) {

    item.addEventListener("click", function () {

        const navLinks = document.querySelector(".nav-links");

        navLinks.classList.remove("active");

    });

});


// ==============================
// CONTACT FORM VALIDATION
// ==============================

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();


    // Check name
    if (name === "") {
        alert("Please enter your name.");
        return;
    }


    // Check email
    if (email === "") {
        alert("Please enter your email.");
        return;
    }


    // Email validation
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }


    // Check message
    if (message === "") {
        alert("Please enter your message.");
        return;
    }


    // Success message
    alert(
        "Thank you, " +
        name +
        "! Your message has been submitted successfully."
    );


    // Clear form
    contactForm.reset();

});