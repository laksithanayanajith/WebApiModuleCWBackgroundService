const express = require('express');
const app = express();
const cron = require('node-cron');
const axios = require('axios');
const WeatherData = require('./WeatherData');

// Function to generate random weather data
let generatedWeatherData = null;

cron.schedule('*/5 * * * *', () => {
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

    const districtsOfSriLanka = [
        "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
        "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy",
        "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale",
        "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa",
        "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
    ];

    // Select a random district
    const randomIndex = Math.floor(Math.random() * districtsOfSriLanka.length);
    const district = districtsOfSriLanka[randomIndex];

    generatedWeatherData = new WeatherData(temperature, isActiveIoTDeviceTemperature, humidity, isActiveIoTDeviceHumidity, airPressure, isActiveIoTDeviceAirPressure, lastUpdatedDateTime, district);
});

function generateWeatherData() {
    return generatedWeatherData;
}

async function insertWeatherData() {
    const weatherData = generateWeatherData();
    try {
        if (weatherData !== null) {
            await axios.post('http://localhost:3000/api/weather', weatherData);
        }
        console.log(weatherData !== null ? 'Weather data inserted successfully.' : 'Not found weather data!');
    } catch (error) {
        console.error('Error inserting weather data:', error.message);
    }
}

cron.schedule('*/5 * * * *', () => {
    insertWeatherData();
});


// Serve static files (HTML, CSS, JS) from the public directory
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} at ${new Date().toLocaleString()}`);
});
