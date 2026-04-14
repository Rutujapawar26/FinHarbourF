// ===== ELEMENTS =====
const modal = document.getElementById("authModal");
let openBtn = document.getElementById("openModal");
const closeBtn = document.querySelector(".close");

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

// ===== MODAL CONTROLS =====
if (openBtn) openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";

// Close modal on outside click
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// Close modal on ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modal.style.display = "none";
});

// ===== TAB SWITCHING =====
loginTab.onclick = () => {
  loginForm.style.display = "block";
  signupForm.style.display = "none";
  loginTab.classList.add("active");
  signupTab.classList.remove("active");
};

signupTab.onclick = () => {
  loginForm.style.display = "none";
  signupForm.style.display = "block";
  signupTab.classList.add("active");
  loginTab.classList.remove("active");
};

// ===== SIGNUP =====
function signup() {
  const name = document.getElementById("name").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !contact || !email || !password) {
    alert("Fill all fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(u => u.email === email)) {
    alert("User already exists");
    return;
  }

  const newUser = { name, contact, email, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  // Save logged-in session
  localStorage.setItem("loggedInUser", JSON.stringify(newUser));

  alert("Signup successful!");
  window.location.href = "quiz.html";
}

// ===== LOGIN =====
function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid credentials");
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(user));
  alert("Login successful!");
  modal.style.display = "none";

  loadUserUI();
}

// ===== LOAD USER UI =====
function loadUserUI() {
  const authArea = document.getElementById("authArea");
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (user) {
    // Create profile-box dynamically
    authArea.innerHTML = `
      <div class="profile-box">
        <span class="user-name">👤 ${user.name}</span>
        <button id="logoutBtn">Logout</button>
      </div>
    `;

    // Attach event listeners dynamically
    const userNameSpan = authArea.querySelector(".user-name");
    userNameSpan.addEventListener("click", () => {
      window.location.href = "profile.html";
    });

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", logout);

  } else {
    authArea.innerHTML = `<button class="cta" id="openModal">SignIn <span>↗</span></button>`;
    document.getElementById("openModal").onclick = () => modal.style.display = "block";
  }
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem("loggedInUser");
  location.reload();
}

// ===== OPEN PROFILE =====
function openProfile() {
  window.location.href = "profile.html";
}

// ===== INIT =====
loadUserUI();