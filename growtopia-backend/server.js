const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Homepage route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to Growtopia Backend!" });
});

// Plant Guide (Search for a plant)
app.get('/plant-guide', (req, res) => {
    const plantName = req.query.name || '';
    res.json({ plant: plantName, details: "Plant details go here." });
});

// Choose the Right One (Suggest plants based on humidity & temperature)
app.post('/choose-plant', (req, res) => {
    const { humidity, temperature } = req.body;
    res.json({ suggested_plants: ["Plant 1", "Plant 2"] });
});

// Disease Detection (Predict plant disease)
app.post('/detect-disease', (req, res) => {
    const { symptoms } = req.body;
    res.json({ disease: "Unknown", treatment: "Treatment suggestions go here." });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
