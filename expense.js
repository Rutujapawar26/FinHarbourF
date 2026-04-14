// HTML ELEMENTS
const titleInput = document.getElementById("titleInput");
const amountInput = document.getElementById("amountInput");
const categoryInput = document.getElementById("categoryInput");
const titleCount = document.getElementById("titleCount");
const listElement = document.getElementById("expenseList");

// GLOBAL STATE
let expenses = []; 
const totalIncome = 50000;
let barChart, pieChart;

// 🟢 INITIAL LOAD
window.onload = function () {
    applyTheme();
    loadUserExpenses(); 
};

// 🌙 THEME LOGIC
function applyTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") document.body.classList.add("dark");
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
    const theme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);
}

// ✍️ CHARACTER COUNTER
titleInput.addEventListener("input", () => {
    const length = titleInput.value.length;
    titleCount.textContent = `${length}/30`;
    titleCount.style.color = length >= 25 ? "#ef4444" : "#64748b";
});

// 📥 FETCH FROM BACKEND (FIXED URL HERE)
async function loadUserExpenses() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
        alert("Please login first!");
        window.location.href = "index.html";
        return;
    }

    try {
        // FIXED: Using backticks and the user.email variable correctly
        const res = await fetch(`http://localhost:3000/history/${user.email}`);
        
        if (!res.ok) throw new Error("Could not fetch history");
        
        expenses = await res.json();
        render();
    } catch (err) {
        console.error("Error loading history:", err);
    }
}

// 📤 SAVE TO BACKEND
async function addExpense() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;

    if (!user) return alert("Session expired. Please login again.");
    if (!title || !amount) return alert("Fill all fields");

    try {
        const res = await fetch("http://localhost:3000/expense", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email: user.email, 
                amount, 
                category, 
                description: title 
            })
        });

        if (res.ok) {
            titleInput.value = "";
            amountInput.value = "";
            titleCount.textContent = "0/30";
            loadUserExpenses(); // Refresh the UI
        } else {
            const errorData = await res.json();
            alert(errorData.message || "Failed to save");
        }
    } catch (err) {
        alert("Server connection failed. Is your backend running?");
    }
}

// 🖼️ RENDER UI
function render() {
    listElement.innerHTML = "";
    let total = 0;
    let categoryTotals = {};

    expenses.forEach(e => {
        const amount = Number(e.amount);
        total += amount;
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + amount;

        const li = document.createElement("li");
        li.innerHTML = `
            <span>${e.description || 'Expense'} (${e.category})</span>
            <span>₹${amount}</span>
        `;
        listElement.appendChild(li);
    });

    document.getElementById("totalExpense").innerText = `₹${total}`;
    document.getElementById("balance").innerText = `₹${totalIncome - total}`;

    drawCharts(categoryTotals);
}

// 📊 CHARTS
function drawCharts(data) {
    if (Object.keys(data).length === 0) return; // Don't draw if empty

    const labels = Object.keys(data);
    const values = Object.values(data);

    if (barChart) barChart.destroy();
    if (pieChart) pieChart.destroy();

    const barCtx = document.getElementById("barChart")?.getContext("2d");
    const pieCtx = document.getElementById("pieChart")?.getContext("2d");

    if (barCtx) {
        barChart = new Chart(barCtx, {
            type: "bar",
            data: { labels, datasets: [{ label: 'Expenses', data: values, backgroundColor: "#2563eb" }] }
        });
    }

    if (pieCtx) {
        pieChart = new Chart(pieCtx, {
            type: "pie",
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: ["#2563eb", "#7c3aed", "#22c55e", "#f59e0b", "#ef4444"]
                }]
            }
        });
    }
}

// 🌍 CURRENCY CONVERTER
async function convertCurrency() {
    const amount = document.getElementById("convertAmount").value;
    const from = document.getElementById("fromCurrency").value;
    const to = document.getElementById("toCurrency").value;
    const resultText = document.getElementById("conversionResult");

    if (!amount) return alert("Enter amount");

    try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
        const data = await response.json();
        if (data.result === "success") {
            const converted = amount * data.rates[to];
            resultText.innerText = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
        }
    } catch (error) {
        resultText.innerText = "Error fetching rates";
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}
