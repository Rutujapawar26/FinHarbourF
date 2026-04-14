// GLOBAL STATE
let goals = [];
let barChart, lineChart;

/* =========================
   INITIAL LOAD
========================= */
window.onload = function() {
    loadGoals(); // Fetch data from MongoDB
};

/* =========================
   THEME TOGGLE
========================= */
function toggleTheme() {
    document.body.classList.toggle("dark");
    const theme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);
}

/* =========================
   CHARACTER COUNTER
========================= */
const goalInput = document.getElementById("goalName");
const charCount = document.getElementById("charCount");

if (goalInput && charCount) {
    goalInput.addEventListener("input", function () {
        let length = goalInput.value.length;
        charCount.textContent = length + " / 30";
        charCount.style.color = length > 25 ? "red" : "gray";
    });
}

/* =========================
   FETCH GOALS (BACKEND)
========================= */
async function loadGoals() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
        alert("Please login first!");
        window.location.href = "index.html";
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/goals/${user.email}`);
        goals = await res.json();
        updateUI();
    } catch (err) {
        console.error("Error loading goals:", err);
    }
}

/* =========================
   ADD GOAL (BACKEND)
========================= */
async function addGoal() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const name = document.getElementById("goalName").value.trim();
    const target = Number(document.getElementById("targetAmount").value);
    const saved = Number(document.getElementById("initialSavings").value) || 0;
    const deadline = document.getElementById("deadline").value;

    if (!name || !target || !deadline) {
        alert("Please fill all required fields");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/goal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: user.email,
                goalName: name,
                targetAmount: target,
                initialSavings: saved,
                deadline: deadline
            })
        });

        if (res.ok) {
            alert("Goal Created! 🎯");
            clearInputs();
            loadGoals(); // Refresh list from DB
        }
    } catch (err) {
        alert("Server error. Check if backend is running.");
    }
}

/* =========================
   UPDATE UI
========================= */
function updateUI() {
    const container = document.getElementById("goalsContainer");
    container.innerHTML = "";

    goals.forEach((g) => {
        const percent = Math.min((g.currentSavings / g.targetAmount) * 100, 100).toFixed(1);

        const div = document.createElement("div");
        div.className = "goal-item";
        div.style.border = "1px solid #ddd";
        div.style.padding = "15px";
        div.style.borderRadius = "10px";
        div.style.marginBottom = "15px";

        div.innerHTML = `
            <strong>${g.goalName}</strong><br>
            ₹${g.currentSavings} / ₹${g.targetAmount}

            <div class="progress" style="background: #eee; height: 10px; border-radius: 5px; margin: 10px 0;">
                <div class="progress-fill" style="width:${percent}%; height: 100%; background: #22c55e; border-radius: 5px;"></div>
            </div>

            <small>Deadline: ${g.deadline ? new Date(g.deadline).toLocaleDateString() : 'No deadline'}</small><br><br>

            <div style="display:flex; gap:10px;">
                <input type="number" placeholder="Add savings" id="add-${g._id}" style="width: 100px;">
                <button onclick="addSavings('${g._id}')">Add</button>
                <button onclick="deleteGoal('${g._id}')" style="background: #ef4444; color: white; border: none; border-radius: 5px; padding: 5px 10px; cursor:pointer;">Delete</button>
            </div>
        `;

        container.appendChild(div);
    });

    updateCharts();
}

/* =========================
   ADD SAVINGS (BACKEND)
========================= */
async function addSavings(goalId) {
    const input = document.getElementById(`add-${goalId}`);
    const amount = Number(input.value);

    if (!amount || amount <= 0) return;

    try {
        const res = await fetch(`http://localhost:3000/goal/update/${goalId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount })
        });

        if (res.ok) {
            loadGoals(); // Refresh UI with updated data
        }
    } catch (err) {
        console.error("Error updating savings:", err);
    }
}

/* =========================
   DELETE GOAL (BACKEND)
========================= */
async function deleteGoal(goalId) {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
        const res = await fetch(`http://localhost:3000/goal/${goalId}`, {
            method: "DELETE"
        });

        if (res.ok) {
            loadGoals(); // Refresh UI
        }
    } catch (err) {
        console.error("Error deleting goal:", err);
    }
}

/* =========================
   CHARTS
========================= */
function updateCharts() {
    const names = goals.map(g => g.goalName);
    const savedData = goals.map(g => g.currentSavings);

    if (barChart) barChart.destroy();
    if (lineChart) lineChart.destroy();

    const barCtx = document.getElementById("barChart").getContext("2d");
    barChart = new Chart(barCtx, {
        type: "bar",
        data: {
            labels: names,
            datasets: [{ label: "Savings", data: savedData, backgroundColor: "#2563eb" }]
        }
    });

    const lineCtx = document.getElementById("lineChart").getContext("2d");
    lineChart = new Chart(lineCtx, {
        type: "line",
        data: {
            labels: names,
            datasets: [{ label: "Progress", data: savedData, borderColor: "#2563eb", tension: 0.3 }]
        }
    });
}

function clearInputs() {
    document.getElementById("goalName").value = "";
    document.getElementById("targetAmount").value = "";
    document.getElementById("initialSavings").value = "";
    document.getElementById("deadline").value = "";
    charCount.textContent = "0 / 30";
}
