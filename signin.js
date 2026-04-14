function togglePassword() {
  const pass = document.getElementById("password");
  pass.type = pass.type === "password" ? "text" : "password";
}

function signup() {
  const name = document.getElementById("name").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !contact || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  if (!/^[0-9]{10}$/.test(contact)) {
    alert("Contact number must be 10 digits");
    return;
  }

  if (!/^(?=.*[0-9]).{6,}$/.test(password)) {
    alert("Password must be at least 6 characters and include a number");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const exists = users.find(user => user.email === email);
  if (exists) {
    alert("Email already registered!");
    return;
  }

  users.push({ name, contact, email, password });

  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created successfully!");
  window.location.href = "login.html";
}