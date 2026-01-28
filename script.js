const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const signInForm = document.querySelector(".sign-in-form");
const signUpForm = document.querySelector(".sign-up-form");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

// Helper to get users
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// Handle Sign Up
if (signUpForm) {
    signUpForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const usernameInput = signUpForm.querySelector('input[placeholder="Username"]');
        const emailInput = signUpForm.querySelector('input[placeholder="Email"]');
        const passwordInput = signUpForm.querySelector('input[placeholder="Password"]');

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !email || !password) {
            alert("Please fill in all fields");
            return;
        }

        const users = getUsers();
        if (users.find(u => u.username === username)) {
            alert("Username already exists");
            return;
        }

        users.push({ username, email, password });
        localStorage.setItem('users', JSON.stringify(users));

        alert("Account created successfully! Please sign in.");
        container.classList.remove("sign-up-mode");
        signUpForm.reset();
    });
}

// Handle Sign In
if (signInForm) {
    signInForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const usernameInput = signInForm.querySelector('input[placeholder="Username"]');
        const passwordInput = signInForm.querySelector('input[placeholder="Password"]');

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        const users = getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            // Set current user session
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid username or password");
        }
    });
}
