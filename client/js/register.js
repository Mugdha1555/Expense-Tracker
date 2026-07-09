// ===========================
// PASSWORD TOGGLE
// ===========================

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

togglePassword.addEventListener("click", () => {
    if (password.type === "password") {
        password.type = "text";
        togglePassword.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        password.type = "password";
        togglePassword.classList.replace("fa-eye-slash", "fa-eye");
    }
});

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
// FORM VALIDATION + BACKEND
// ===========================

const form = document.getElementById("registerForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";

    let isValid = true;

    if (nameInput.value.trim() === "") {
        nameError.textContent = "Full name is required.";
        isValid = false;
    }

    if (emailInput.value.trim() === "") {
        emailError.textContent = "Email is required.";
        isValid = false;
    } else if (!emailInput.value.includes("@")) {
        emailError.textContent = "Enter a valid email.";
        isValid = false;
    }

    if (password.value.trim() === "") {
        passwordError.textContent = "Password is required.";
        isValid = false;
    } else if (password.value.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters.";
        isValid = false;
    }

    if (confirmPassword.value.trim() === "") {
        confirmPasswordError.textContent = "Please confirm your password.";
        isValid = false;
    } else if (password.value !== confirmPassword.value) {
        confirmPasswordError.textContent = "Passwords do not match.";
        isValid = false;
    }

    if (!isValid) return;

    try {

        const response = await fetch("http://localhost:5000/api/auth/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                password: password.value
            })

        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Registration failed");
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));

        alert("🎉 Registration Successful!");

        window.location.href = "login.html";

    } catch (error) {

        console.error(error);

        alert("Cannot connect to server.");

    }

});