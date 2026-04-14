// GET ELEMENTS
const user = JSON.parse(localStorage.getItem("loggedInUser"));

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const contactInput = document.getElementById("contact");
const quizDataEl = document.getElementById("quizData");
const profilePic = document.getElementById("profilePic");

// LOAD USER DATA
if (user) {
  nameInput.value = user.name || "";
  emailInput.value = user.email || "";
  contactInput.value = user.contact || "";

  // LOAD PHOTO
  if (user.photo) profilePic.src = user.photo;

  // 🔥 DISPLAY QUIZ DATA
  displayQuizData(user.quizData);
}

// SAVE PROFILE
function saveProfile() {
  if (!user) return alert("No user logged in!");

  user.name = nameInput.value;
  user.contact = contactInput.value;

  localStorage.setItem("loggedInUser", JSON.stringify(user));
  alert("Profile updated!");
}

// UPLOAD PHOTO
document.getElementById("uploadPhoto").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    profilePic.src = reader.result;
    if (user) {
      user.photo = reader.result;
      localStorage.setItem("loggedInUser", JSON.stringify(user));
    }
  };
  reader.readAsDataURL(file);
});

// 🔥 MAIN DISPLAY FUNCTION (CLEAN + PROFESSIONAL UI)
function displayQuizData(data) {
  quizDataEl.innerHTML = "";

  if (!data || data.length === 0) {
    quizDataEl.innerHTML = "<p>No financial data available.</p>";
    return;
  }

  const info = {
    age: data[0]?.answer,
    occupation: data[1]?.answer,
    income: data[2]?.answer,
    savingsRate: data[3]?.answer,
    goal: data[4]?.answer,
    horizon: data[5]?.answer,
    risk: data[6]?.answer,
    reaction: data[7]?.answer,
    investment: data[8]?.answer,
    savingsAmount: data[9]?.answer,
    loans: data[10]?.answer,
    emergency: data[11]?.answer,
    insurance: data[12]?.answer,
    tracking: data[13]?.answer,
    preference: data[14]?.answer
  };

  quizDataEl.innerHTML = `
    <div class="quiz-card">
      <h4>👤 Profile</h4>
      <p><strong>Age Group:</strong> ${info.age || "-"}</p>
      <p><strong>Occupation:</strong> ${info.occupation || "-"}</p>
    </div>

    <div class="quiz-card">
      <h4>💰 Income & Savings</h4>
      <p><strong>Monthly Income:</strong> ${info.income || "-"}</p>
      <p><strong>Savings Rate:</strong> ${info.savingsRate || "-"}</p>
      <p><strong>Total Savings:</strong> ${info.savingsAmount || "-"}</p>
    </div>

    <div class="quiz-card">
      <h4>📊 Investment Profile</h4>
      <p><strong>Risk Level:</strong> ${info.risk || "-"}</p>
      <p><strong>Investment Horizon:</strong> ${info.horizon || "-"}</p>
      <p><strong>Current Investments:</strong> ${info.investment || "-"}</p>
      <p><strong>Preference:</strong> ${info.preference || "-"}</p>
    </div>

    <div class="quiz-card">
      <h4>🎯 Financial Goals</h4>
      <p><strong>Main Goal:</strong> ${info.goal || "-"}</p>
      <p><strong>Market Reaction:</strong> ${info.reaction || "-"}</p>
    </div>

    <div class="quiz-card">
      <h4>🛡 Financial Health</h4>
      <p><strong>Loans:</strong> ${info.loans || "-"}</p>
      <p><strong>Emergency Fund:</strong> ${info.emergency || "-"}</p>
      <p><strong>Insurance:</strong> ${info.insurance || "-"}</p>
      <p><strong>Tracking Habit:</strong> ${info.tracking || "-"}</p>
    </div>
  `;

  // FEEDBACK
  if (user.feedback) {
    quizDataEl.innerHTML += `
      <div class="quiz-card">
        <h4>💬 Your Feedback</h4>
        <p>${user.feedback}</p>
      </div>
    `;
  }
}