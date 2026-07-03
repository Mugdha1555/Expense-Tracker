// Get the password input and eye icon
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

// Toggle password visibility
togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");
    }

});
// Form Validation

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    emailError.textContent = "";
    passwordError.textContent = "";

    let isValid = true;

    // Email validation
    if (email.value.trim() === "") {

        emailError.textContent = "Email is required.";
        isValid = false;

    } else if (!email.value.includes("@")) {

        emailError.textContent = "Enter a valid email.";
        isValid = false;
    }

    // Password validation
    if (passwordInput.value.trim() === "") {

        passwordError.textContent = "Password is required.";
        isValid = false;

    } else if (passwordInput.value.length < 6) {

        passwordError.textContent = "Password must be at least 6 characters.";
        isValid = false;
    }

    if (isValid) {

        alert("Login Successful! (Backend will be added later)");

    }

});