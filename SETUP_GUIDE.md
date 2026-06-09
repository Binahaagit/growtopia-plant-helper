# 🌱 Plant Care Guide with AI - Setup Guide

## Quick Start

### 1. Get Your Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com)
2. Click **"Get API Key"** → **"Create API key in new project"**
3. Copy the API key

### 2. Add API Key to `.env`
Open `.env` file and replace:
```
GEMINI_API_KEY=your_gemini_api_key_here
```
with your actual API key:
```
GEMINI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
```

### 3. Run the Server
```bash
npm start
```

You should see:
```
🌱 Growtopia running at http://localhost:5000
📡 Using Gemini AI for plant care guidance
```

### 4. Test the Plant Care Guide
- Go to `http://localhost:5000/plant-guide`
- Search for any plant (e.g., "Monstera", "Pothos", "Snake Plant")
- Get instant AI-powered care instructions!

## Features

### ✨ Plant Search with AI
- Get detailed care instructions for any plant
- Learn about watering, sunlight, temperature, humidity, soil, and fertilizer
- Get common pests and pro tips
- Powered by Google Gemini

### 🔧 API Endpoints

#### Get Plant Details
```
GET /api/plant-guide?name=Monstera
```
Returns:
```json
{
  "name": "Monstera",
  "description": "...",
  "wateringSchedule": "...",
  "sunlight": "...",
  "temperature": "...",
  "humidity": "...",
  "soil": "...",
  "fertilizer": "...",
  "commonPests": [...],
  "tips": [...]
}
```

#### Suggest Plants by Conditions
```
POST /api/choose-plant
{
  "humidity": 60,
  "temperature": 22,
  "soil": "loamy"
}
```

#### Detect Plant Disease
```
POST /api/detect-disease
{
  "symptoms": "Yellow leaves, drooping plant"
}
```

## Troubleshooting

### "API Key not found"
- Make sure `.env` file exists in the root directory
- Check that `GEMINI_API_KEY=your_key` is correctly set
- Restart the server after updating `.env`

### "Failed to fetch plant details"
- Verify your Gemini API key is valid
- Check your internet connection
- Ensure the API key has access to the Generative AI API

### Port Already in Use
If port 5000 is already in use, you can change it in `src/server.js` line 17:
```javascript
const PORT = 3000; // or any other port
```

## Project Structure
```
.
├── src/
│   └── server.js           # Express backend with Gemini AI
├── public/
│   ├── plant_guide.html    # AI-powered plant search UI
│   ├── home.html           # Homepage
│   └── ...other pages
├── data/
│   └── plants.json         # Plant database (optional)
├── .env                    # Your API key (CREATE THIS)
└── package.json
```

## Next Steps

Want to add more features? Consider:
- 🖼️ **Image upload** - Analyze plant images for disease detection
- 🌍 **Multi-language** - Support for different languages
- 📊 **Plant stats** - Track plant growth and care history
- 💬 **Chat interface** - 24/7 plant care chatbot

Happy gardening! 🌿
