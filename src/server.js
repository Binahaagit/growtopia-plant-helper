const fs = require('fs');
const path = require('path');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
// API Routes with AI Integration
// ===========================

// Plant Guide (Search for a plant with AI-powered details)
app.get('/api/plant-guide', async (req, res) => {
    const plantName = req.query.name || '';
    
    if (!plantName.trim()) {
        return res.status(400).json({ error: 'Please provide a plant name' });
    }

    try {
        const prompt = `You are a plant care expert. Provide detailed care instructions for ${plantName} in the following JSON format:
{
  "name": "plant name",
  "description": "brief description",
  "wateringSchedule": "how often to water",
  "sunlight": "sunlight requirements",
  "temperature": "temperature range",
  "humidity": "humidity preference",
  "soil": "soil type recommendation",
  "fertilizer": "fertilizer schedule",
  "commonPests": ["pest1", "pest2"],
  "tips": ["tip1", "tip2", "tip3"]
}
Keep the response concise and practical.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const plantDetails = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Could not parse plant details' };
        
        res.json(plantDetails);
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'Failed to fetch plant details', details: error.message });
    }
});

// Choose the Right One (Suggest plants based on humidity & temperature)
app.post('/api/choose-plant', async (req, res) => {
    const { humidity, temperature, soil } = req.body;

    // Convert input values to numbers (safeguard)
    const humidityVal = Number(humidity);
    const temperatureVal = Number(temperature);
    const soilType = soil.toLowerCase();

    try {
        const prompt = `You are a plant expert. Suggest 3-5 plants suitable for these conditions:
- Humidity: ${humidityVal}%
- Temperature: ${temperatureVal}°C
- Soil Type: ${soilType}

Respond with a JSON array of plant names and brief reasons why they're suitable:
[
  {"name": "plant name", "reason": "why it fits these conditions"}
]`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Extract JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        const suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
        
        if (suggestions.length > 0) {
            res.json({ suggested_plants: suggestions });
        } else {
            res.json({ suggested_plants: [{ name: "No matching plants found", reason: "Try adjusting conditions" }] });
        }
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'Failed to suggest plants', details: error.message });
    }
});


// Disease Detection (Predict plant disease)
app.post('/api/detect-disease', async (req, res) => {
    const { symptoms } = req.body;
    
    if (!symptoms.trim()) {
        return res.status(400).json({ error: 'Please describe the symptoms' });
    }

    try {
        const prompt = `You are a plant pathologist. Based on these symptoms: "${symptoms}", identify the likely disease and provide treatment.
Respond with JSON:
{
  "disease": "disease name",
  "likelihood": "high/medium/low",
  "description": "description",
  "treatment": "treatment steps",
  "prevention": "prevention tips"
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const diagnosis = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Could not diagnose' };
        
        res.json(diagnosis);
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'Failed to detect disease', details: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🌱 Growtopia running at http://localhost:${PORT}`);
    console.log(`📡 Using Gemini AI for plant care guidance`);
});
