const express = require('express');
const app = express();
const port = 3000;

// Conversion factors for units that can be multiplied directly
const conversionFactors = {
    'gallonsToLiters': 3.78541,
    'litersToGallons': 1 / 3.78541,
    'milesToKilometers': 1.60934,
    'kilometersToMiles': 1 / 1.60934,
    'poundsToKilograms': 0.453592,
    'kilogramsToPounds': 1 / 0.453592,
    'feetToMeters': 0.3048,
    'metersToFeet': 1 / 0.3048,
    'inchesToCentimeters': 2.54,
    'centimetersToInches': 1 / 2.54,
    'quartsToLiters': 0.946353,
    'litersToQuarts': 1 / 0.946353,
    'inchesToMillimeters': 25.4,
    'millimetersToInches': 1 / 25.4,
    'centimetersToMillimeters': 10,
    'millimetersToCentimeters': 1 / 10,
    'metersToMillimeters': 1000,
    'millimetersToMeters': 1 / 1000,
    'kilometersToMillimeters': 1e6,
    'millimetersToKilometers': 1 / 1e6,
    'micrometersToMillimeters': 1 / 1000,
    'millimetersToMicrometers': 1000,
    'nanometersToMillimeters': 1 / 1e6,
    'millimetersToNanometers': 1e6
};

// Special conversion logic for temperature
const convertTemperature = (value, type) => {
    switch (type) {
        case 'celsiusToFahrenheit':
            return (value * 9/5) + 32;
        case 'fahrenheitToCelsius':
            return (value - 32) * 5/9;
        case 'celsiusToKelvin':
            return value + 273.15;
        case 'kelvinToCelsius':
            return value - 273.15;
        case 'fahrenheitToKelvin':
            return ((value + 459.67) * 5/9);
        case 'kelvinToFahrenheit':
            return (value * 9/5) - 459.67;
        default:
            return null;
    }
};

// General conversion logic
const convertUnit = (value, factor) => value * factor;

// API routes
app.get('/convert', (req, res) => {
    const { unit, value } = req.query;

    if (!unit || !value || isNaN(value)) {
        return res.status(400).json({ error: "Invalid unit or value" });
    }

    let result;
    const floatValue = parseFloat(value);

    // Handle temperature conversion separately
    if (
        unit === 'celsiusToFahrenheit' || unit === 'fahrenheitToCelsius' || 
        unit === 'celsiusToKelvin' || unit === 'kelvinToCelsius' || 
        unit === 'fahrenheitToKelvin' || unit === 'kelvinToFahrenheit'
    ) {
        result = convertTemperature(floatValue, unit);
        if (result === null) {
            return res.status(400).json({ error: "Invalid temperature conversion" });
        }
    } else {
        // Handle standard unit conversions
        const factor = conversionFactors[unit];
        if (!factor) {
            return res.status(400).json({ error: "Invalid unit type" });
        }
        result = convertUnit(floatValue, factor);
    }

    // Limit result to 2 decimal places
    result = result.toFixed(2);

    res.json({
        unit,
        inputValue: value,
        convertedValue: result
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Unit Conversion API running on http://localhost:${port}`);
});
