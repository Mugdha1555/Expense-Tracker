// ===========================
// PASSWORD TOGGLE
// ===========================

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        passwordInput.type = "password";
        togglePassword.classList.replace("fa-eye-slash", "fa-eye");
    }

});

// ===========================
// LOGIN FORM
// ===========================

const loginForm = document.getElementById("loginForm");

const email = document.getElementById("email");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

loginForm.addEventListener("submit", async function (event) {

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

    if (!isValid) return;

    try {

        const response = await fetch("http://localhost:5000/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                email: email.value.trim(),
                password: passwordInput.value

            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message || "Login Failed");

            return;

        }

        // Save token
        localStorage.setItem("token", data.token);

        // Save user
        localStorage.setItem("user", JSON.stringify(data));

        alert("🎉 Login Successful!");

        // Redirect to Dashboard
        window.location.href = "dashboard.html";

    } catch (error) {

        console.error(error);

        alert("Cannot connect to the server.");

    }

});