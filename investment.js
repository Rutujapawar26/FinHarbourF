let investments = [];
let pieChart, lineChart;

// ELEMENTS
const nameInput = document.getElementById("name");
const nameCount = document.getElementById("nameCount");

window.onload = loadInvestments;

// CHARACTER COUNTER
nameInput.addEventListener("input", () => {
    const len = nameInput.value.length;
    nameCount.textContent = `${len}/30`;
    nameCount.style.color = len >= 25 ? "#ef4444" : "#64748b";
});

// FETCH FROM DB
async function loadInvestments() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) return;

    try {
        const res = await fetch(`http://localhost:3000/investments/${user.email}`);
        investments = await res.json();
        updateUI();
    } catch (err) { console.error(err); }
}

// SAVE TO DB
async function addInvestment() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const name = nameInput.value.trim();
    const amount = +document.getElementById("amount").value;
    const rate = +document.getElementById("rate").value;
    const years = +document.getElementById("years").value;

    if (!name || !amount || !rate || !years) return alert("Fill all fields");

    const payload = {
        email: user.email,
        name, amount, rate, years,
        category: document.getElementById("category").value,
        risk: document.getElementById("risk").value
    };

    try {
        const res = await fetch("http://localhost:3000/investment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Investment Recorded! 📈");
            resetForm();
            loadInvestments();
        }
    } catch (err) { alert("Server error"); }
}

// UI RENDER
function updateUI() {
    const container = document.getElementById("investmentList");
    container.innerHTML = "";

    let totalInvested = 0;
    let totalValue = 0;

    investments.forEach((inv) => {
        totalInvested += inv.amount;
        totalValue += inv.futureValue;

        const div = document.createElement("div");
        div.className = "investment-item";
        div.style.border = "1px solid #ddd";
        div.style.padding = "10px";
        div.style.marginBottom = "10px";
        div.style.borderRadius = "8px";

        div.innerHTML = `
            <strong>${inv.name}</strong> (${inv.category})<br>
            ₹${inv.amount} → ₹${inv.futureValue.toFixed(0)}<br>
            <span style="color: ${inv.profit >= 0 ? '#22c55e' : '#ef4444'}">
                ${inv.profit >= 0 ? "+" : ""}₹${inv.profit.toFixed(0)}
            </span><br>
            <button onclick="deleteInvestment('${inv._id}')" style="margin-top:5px; background:#ef4444; color:white; border:none; border-radius:4px; cursor:pointer;">Delete</button>
        `;
        container.appendChild(div);
    });

    document.getElementById("totalInvested").innerText = "₹" + totalInvested;
    document.getElementById("totalValue").innerText = "₹" + totalValue.toFixed(0);
    document.getElementById("returns").innerText = "₹" + (totalValue - totalInvested).toFixed(0);

    updateCharts();
}

async function deleteInvestment(id) {
    if(!confirm("Delete this investment?")) return;
    const res = await fetch(`http://localhost:3000/investment/${id}`, { method: "DELETE" });
    if (res.ok) loadInvestments();
}

function updateCharts() {
    const labels = investments.map(i => i.name);
    const amounts = investments.map(i => i.amount);
    const futures = investments.map(i => i.futureValue);

    if (pieChart) pieChart.destroy();
    if (lineChart) lineChart.destroy();

    pieChart = new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: { labels, datasets: [{ data: amounts, backgroundColor: ["#2563eb", "#7c3aed", "#22c55e", "#f59e0b", "#ef4444"] }] }
    });

    lineChart = new Chart(document.getElementById("lineChart"), {
        type: "line",
        data: { labels, datasets: [{ label: "Future Value", data: futures, borderColor: "#2563eb", tension: 0.4 }] }
    });
}

function resetForm() {
    nameInput.value = "";
    document.getElementById("amount").value = "";
    document.getElementById("rate").value = "";
    document.getElementById("years").value = "";
}
