const fs = require('fs');
const path = require('path');

const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '..', 'public')));

const PORT = 5000;

// Homepage route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'home.html'));
});

// Serve HTML pages for routing
app.get('/plant-guide', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'plant_guide.html'));
});

app.get('/choose-right', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'choose_right.html'));
});

app.get('/plant-doctor', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'plant_doctor.html'));
});

// ===========================
// API Routes
// ===========================

// Plant Guide (Search for a plant)
app.get('/api/plant-guide', (req, res) => {
    const plantName = req.query.name || '';
    res.json({ plant: plantName, details: "Plant details go here." });
});

// Choose the Right One (Suggest plants based on humidity & temperature)
app.post('/api/choose-plant', (req, res) => {
    const { humidity, temperature, soil } = req.body;

    // Convert input values to numbers (safeguard)
    const humidityVal = Number(humidity);
    const temperatureVal = Number(temperature);
    const soilType = soil.toLowerCase();

    // Load plant data from JSON file
    const rawData = fs.readFileSync(path.join(__dirname, '..', 'data', 'plants.json'));
    const plantList = JSON.parse(rawData);

    // Filter logic: find matching plants
    const matches = plantList.filter(plant => {
        const withinHumidity = humidityVal >= plant.humidityRange[0] && humidityVal <= plant.humidityRange[1];
        const withinTemperature = temperatureVal >= plant.temperatureRange[0] && temperatureVal <= plant.temperatureRange[1];
        const matchesSoil = plant.soil.includes(soilType);
        return withinHumidity && withinTemperature && matchesSoil;
    });

    if (matches.length > 0) {
        res.json({ suggested_plants: matches.map(p => p.name) });
    } else {
        res.json({ suggested_plants: ["No matching plants found for the given conditions."] });
    }
});


// Disease Detection (Predict plant disease)
app.post('/api/detect-disease', (req, res) => {
    const { symptoms } = req.body;
    res.json({ disease: "Unknown", treatment: "Treatment suggestions go here." });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🌱 Growtopia running at http://localhost:${PORT}`);
});
