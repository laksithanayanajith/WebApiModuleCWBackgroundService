const express = require('express');
const app = express();
const cron = require('node-cron');
const axios = require('axios');
const WeatherData = require('./WeatherData');

// Function to generate random weather data for a given district
function generateWeatherData(district) {
    // Example: Temperature in Celsius (valid range: 15°C to 40°C)
    const temperature = Math.floor(Math.random() * 26) + 15;

    // Example: Humidity in percentage (valid range: 70% to 90%)
    const humidity = Math.floor(Math.random() * 21) + 70;

    // Example: Air pressure in hPa (valid range: 1000 hPa to 1020 hPa)
    const airPressure = Math.floor(Math.random() * 21) + 1000;

    // Assume IoT devices are active
    const isActiveIoTDeviceTemperature = true;
    const isActiveIoTDeviceHumidity = true;
    const isActiveIoTDeviceAirPressure = true;

    // Get current date and time
    const lastUpdatedDateTime = new Date().toLocaleDateString() + " at " + new Date().toLocaleTimeString()

    return new WeatherData(temperature, isActiveIoTDeviceTemperature, humidity, isActiveIoTDeviceHumidity, airPressure, isActiveIoTDeviceAirPressure, lastUpdatedDateTime, district);
}

async function insertWeatherDataForDistrict(district) {
    const weatherData = generateWeatherData(district);
    try {
        await axios.patch('http://localhost:3002/api/weather/byDistrict', {
            district: district,
            weatherData: weatherData
        });
        console.log(`Weather data inserted successfully for ${district}.`);
    } catch (error) {
        console.error(`Error inserting weather data for ${district}:`, error.message);
    }
}

// Generate and insert weather data for all districts
const districtsOfSriLanka = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
    "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy",
    "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale",
    "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa",
    "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

async function insertWeatherDataForAllDistricts() {
    for (const district of districtsOfSriLanka) {
        await insertWeatherDataForDistrict(district);
    }
}

cron.schedule('*/5 * * * *', () => {
    insertWeatherDataForAllDistricts();
});

// Serve static files (HTML, CSS, JS) from the public directory
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} at ${new Date().toLocaleString()}`);
});
