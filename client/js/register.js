// ===========================
// PASSWORD TOGGLE
// ===========================

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

// Toggle Password
togglePassword.addEventListener("click", () => {

    if (password.type === "password") {
        password.type = "text";
        togglePassword.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        password.type = "password";
        togglePassword.classList.replace("fa-eye-slash", "fa-eye");
    }

});

// Toggle Confirm Password
toggleConfirmPassword.addEventListener("click", () => {

    if (confirmPassword.type === "password") {
        confirmPassword.type = "text";
        toggleConfirmPassword.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        confirmPassword.type = "password";
        toggleConfirmPassword.classList.replace("fa-eye-slash", "fa-eye");
    }

});

// ===========================
// FORM VALIDATION
// ===========================

const form = document.getElementById("registerForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    // Clear previous errors
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";

    let isValid = true;

    // Full Name
    if (nameInput.value.trim() === "") {
        nameError.textContent = "Full name is required.";
        isValid = false;
    }

    // Email
    if (emailInput.value.trim() === "") {
        emailError.textContent = "Email is required.";
        isValid = false;
    } else if (!emailInput.value.includes("@")) {
        emailError.textContent = "Enter a valid email.";
        isValid = false;
    }

    // Password
    if (password.value.trim() === "") {
        passwordError.textContent = "Password is required.";
        isValid = false;
    } else if (password.value.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters.";
        isValid = false;
    }

    // Confirm Password
    if (confirmPassword.value.trim() === "") {
        confirmPasswordError.textContent = "Please confirm your password.";
        isValid = false;
    } else if (password.value !== confirmPassword.value) {
        confirmPasswordError.textContent = "Passwords do not match.";
        isValid = false;
    }

    if (isValid) {
        alert("🎉 Account created successfully! (Backend will be added later)");
    }

});