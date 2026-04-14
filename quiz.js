const quiz = [
  {
    question: "What is your age group?",
    options: ["Under 18", "18–25", "26–35", "36–50", "50+"]
  },
  {
    question: "What is your occupation?",
    options: ["Student", "Salaried", "Self-employed", "Freelancer", "Retired"]
  },
  {
    question: "Monthly income range?",
    options: ["Below ₹20k", "₹20k–₹50k", "₹50k–₹1L", "₹1L–₹2L", "Above ₹2L"]
  },
  {
    question: "How much do you save?",
    options: ["No savings", "<10%", "10–25%", "25–50%", ">50%"]
  },
  {
    question: "Your main financial goal?",
    options: ["Savings", "Buy house/car", "Travel", "Retirement", "Wealth growth"]
  },
  {
    question: "Investment horizon?",
    options: ["<1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years"]
  },
  {
    question: "Risk tolerance?",
    options: ["Very low", "Low", "Moderate", "High", "Very high"]
  },
  {
    question: "If investment drops 20%?",
    options: ["Sell", "Wait", "Invest more", "Not sure"]
  },
  {
    question: "Do you invest?",
    options: ["No", "FD", "Mutual funds", "Stocks", "Crypto"]
  },
  {
    question: "Savings amount?",
    options: ["<₹50k", "₹50k–₹2L", "₹2L–₹5L", "₹5L–₹10L", ">₹10L"]
  },
  {
    question: "Any loans?",
    options: ["No", "Small EMI", "Moderate EMI", "High EMI"]
  },
  {
    question: "Emergency fund?",
    options: ["Yes", "Partial", "No"]
  },
  {
    question: "Insurance?",
    options: ["None", "Health", "Life", "Both"]
  },
  {
    question: "Finance tracking?",
    options: ["Don't track", "Rough idea", "Use apps", "Actively plan"]
  },
  {
    question: "Preferred recommendation?",
    options: ["Safe", "Balanced", "High growth", "Automated"]
  }
];

let current = 0;
let answers = [];

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");

// LOAD QUESTION
function loadQuestion() {
  nextBtn.disabled = true;
  questionEl.innerText = quiz[current].question;
  optionsEl.innerHTML = "";

  quiz[current].options.forEach(option => {
    const btn = document.createElement("div");
    btn.classList.add("option");
    btn.innerText = option;

    btn.onclick = () => {
      document.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
      btn.classList.add("selected");

      answers[current] = option;
      nextBtn.disabled = false;
    };

    optionsEl.appendChild(btn);
  });
}

// NEXT BUTTON
nextBtn.onclick = () => {
  current++;

  if (current < quiz.length) {
    loadQuestion();
  } else {
    showResult();
  }
};

// SHOW RESULT
function showResult() {
  questionEl.innerText = "✅ Quiz Completed!";

  optionsEl.innerHTML = `
    <h3>Your Answers:</h3>
    <pre>${JSON.stringify(answers, null, 2)}</pre>

    <h3>💬 Suggestions :</h3>
    <textarea id="feedback" rows="4" maxlength="500" placeholder="Type your suggestion..."></textarea>
    
    <p id="counter">0 / 500 characters</p>

    <button id="submitBtn">Submit</button>
  `;

  nextBtn.style.display = "none";

  const feedback = document.getElementById("feedback");
  const counter = document.getElementById("counter");
  const submitBtn = document.getElementById("submitBtn");

  // CHARACTER COUNTER
  feedback.addEventListener("input", function () {
    let length = feedback.value.length;
    counter.innerText = length + " / 500 characters";

    counter.style.color = length > 150 ? "#ff6b6b" : "#94d2bd";
  });

  // SUBMIT BUTTON
  submitBtn.onclick = () => {
    const userFeedback = feedback.value;

    // ===== SAVE QUIZ DATA TO USER =====
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedUser) {
      loggedUser.quizData = quiz.map((q, i) => ({
        question: q.question,
        answer: answers[i]
      }));
      loggedUser.feedback = userFeedback;

      localStorage.setItem("loggedInUser", JSON.stringify(loggedUser));
    }

    // THANK YOU MESSAGE
    optionsEl.innerHTML = `
      <h3>🎉 Thank you!</h3>
      <p>Your response has been recorded.</p>
    `;

    // REDIRECT AFTER 2s
    setTimeout(() => {
      window.location.href = "home.html";
    }, 2000);
  };
}

// INIT
loadQuestion();