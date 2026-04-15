const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/* =========================
   DATABASE CONNECTION
========================= */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB ✅"))
    .catch(err => console.error("MongoDB Connection Error ❌", err));

/* =========================
   SCHEMAS & MODELS
========================= */

// User Model
const User = mongoose.model('User', new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

// Expense Model
const Expense = mongoose.model('Expense', new mongoose.Schema({
    userEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now }
}));

// Goal Model
const Goal = mongoose.model('Goal', new mongoose.Schema({
    userEmail: { type: String, required: true },
    goalName: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentSavings: { type: Number, default: 0 },
    deadline: { type: Date },
    date: { type: Date, default: Date.now }
}));

// Investment Model
const Investment = mongoose.model('Investment', new mongoose.Schema({
    userEmail: { type: String, required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    rate: { type: Number, required: true },
    years: { type: Number, required: true },
    category: { type: String },
    risk: { type: String },
    futureValue: { type: Number },
    profit: { type: Number },
    date: { type: Date, default: Date.now }
}));

/* =========================
   AUTH ROUTES
========================= */

app.post('/signup', async (req, res) => {
    try {
        const { name, contact, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, contact, email, password: hashedPassword });
        await newUser.save();
        res.json({ message: "Signup successful ✅", user: { name: newUser.name, email: newUser.email } });
    } catch (err) { res.status(500).json({ message: "Error during signup" }); }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials ❌" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials ❌" });

        res.json({ message: "Login successful ✅", user: { name: user.name, email: user.email } });
    } catch (err) { res.status(500).json({ message: "Error during login" }); }
});

/* =========================
   EXPENSE TRACKER ROUTES
========================= */

app.post('/expense', async (req, res) => {
    try {
        const { email, amount, category, description } = req.body;
        await new Expense({ userEmail: email, amount, category, description }).save();
        res.json({ message: "Expense saved to database 💸" });
    } catch (err) { res.status(500).json({ message: "Error saving expense" }); }
});

app.get('/history/:email', async (req, res) => {
    try {
        const userExpenses = await Expense.find({ userEmail: req.params.email });
        res.json(userExpenses);
    } catch (err) { res.status(500).json({ message: "Error fetching history" }); }
});

/* =========================
   GOAL TRACKER ROUTES
========================= */

app.post('/goal', async (req, res) => {
    try {
        const { email, goalName, targetAmount, initialSavings, deadline } = req.body;
        await new Goal({ 
            userEmail: email, goalName, targetAmount, 
            currentSavings: initialSavings || 0, deadline 
        }).save();
        res.json({ message: "Goal Added Successfully! 🎯" });
    } catch (err) { res.status(500).json({ message: "Error saving goal" }); }
});

app.get('/goals/:email', async (req, res) => {
    try {
        const userGoals = await Goal.find({ userEmail: req.params.email });
        res.json(userGoals);
    } catch (err) { res.status(500).json(err); }
});

app.put('/goal/update/:id', async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        goal.currentSavings += Number(req.body.amount);
        await goal.save();
        res.json({ message: "Savings updated!" });
    } catch (err) { res.status(500).json(err); }
});

app.delete('/goal/:id', async (req, res) => {
    try {
        await Goal.findByIdAndDelete(req.params.id);
        res.json({ message: "Goal deleted!" });
    } catch (err) { res.status(500).json(err); }
});

/* =========================
   INVESTMENT TRACKER ROUTES
========================= */

app.post('/investment', async (req, res) => {
    try {
        const { email, name, amount, rate, years, category, risk } = req.body;
        
        // Future Value Calculation
        const futureValue = amount * Math.pow(1 + rate / 100, years);
        const profit = futureValue - amount;

        await new Investment({
            userEmail: email, name, amount, rate, years, 
            category, risk, futureValue, profit
        }).save();

        res.json({ message: "Investment Saved! 📈" });
    } catch (err) { res.status(500).json({ message: "Error saving investment" }); }
});

app.get('/investments/:email', async (req, res) => {
    try {
        const data = await Investment.find({ userEmail: req.params.email });
        res.json(data);
    } catch (err) { res.status(500).json(err); }
});

app.delete('/investment/:id', async (req, res) => {
    try {
        await Investment.findByIdAndDelete(req.params.id);
        res.json({ message: "Investment deleted!" });
    } catch (err) { res.status(500).json(err); }
});

/* =========================
   START SERVER
========================= */
app.get('/', (req, res) => res.send("FINTECH Backend is running 🚀"));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:3000 🚀`);
});
