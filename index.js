const express = require('express');
const app = express();
const port = 3000;

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
    'kilometersToMillimeters': 1000000,
    'millimetersToKilometers': 1 / 1000000,
    'micrometersToMillimeters': 1 / 1000,
    'millimetersToMicrometers': 1000,
    'nanometersToMillimeters': 1 / 1000000,
    'millimetersToNanometers': 1000000,
    'gramsToKilograms': 1 / 1000,
    'kilogramsToGrams': 1000,
    'gramsToPounds': 0.00220462,
    'poundsToGrams': 453.592,
    'gramsToOunces': 0.035274,
    'ouncesToGrams': 28.3495
};

const convertTemperature = (value, type) => {
    switch (type) {
        case 'celsiusToFahrenheit':
            return (value * 9 / 5) + 32;
        case 'fahrenheitToCelsius':
            return (value - 32) * 5 / 9;
        case 'celsiusToKelvin':
            return value + 273.15;
        case 'kelvinToCelsius':
            return value - 273.15;
        case 'fahrenheitToKelvin':
            return ((value + 459.67) * 5 / 9);
        case 'kelvinToFahrenheit':
            return (value * 9 / 5) - 459.67;
        default:
            return null;
    }
};

const convertUnit = (value, factor) => value * factor;

app.get('/convert', (req, res) => {
    const { unit, value } = req.query;

    if (!unit || !value || isNaN(value)) {
        return res.status(400).json({ error: "Invalid unit or value" });
    }

    const floatValue = parseFloat(value);
    let result = {};

    if (unit === 'grams') {
        result['grams'] = floatValue;
        result['kilograms'] = convertUnit(floatValue, conversionFactors['gramsToKilograms']);
        result['pounds'] = convertUnit(floatValue, conversionFactors['gramsToPounds']);
        result['ounces'] = convertUnit(floatValue, conversionFactors['gramsToOunces']);
    }
    else if (unit === 'meters' || unit === 'miles' || unit === 'feet' || unit === 'inches' || unit === 'centimeters' || unit === 'millimeters') {
        if (unit === 'meters') {
            result['meters'] = floatValue;
            result['kilometers'] = convertUnit(floatValue, 1 / 1000);
            result['miles'] = convertUnit(floatValue, 1 / 1609.34);
            result['feet'] = convertUnit(floatValue, conversionFactors['metersToFeet']);
            result['inches'] = convertUnit(floatValue, conversionFactors['metersToFeet'] * 12);
            result['centimeters'] = convertUnit(floatValue, conversionFactors['metersToMillimeters'] / 10);
            result['millimeters'] = convertUnit(floatValue, conversionFactors['metersToMillimeters']);
        } else if (unit === 'miles') {
            result['miles'] = floatValue;
            const meters = convertUnit(floatValue, conversionFactors['milesToKilometers'] * 1000);
            result['meters'] = meters;
            result['feet'] = convertUnit(meters, conversionFactors['metersToFeet']);
            result['inches'] = convertUnit(meters, conversionFactors['metersToFeet'] * 12);
            result['centimeters'] = convertUnit(meters, conversionFactors['metersToMillimeters'] / 10);
            result['millimeters'] = convertUnit(meters, conversionFactors['metersToMillimeters']);
            result['kilometers'] = convertUnit(floatValue, conversionFactors['milesToKilometers']);
        } else if (unit === 'feet') {
            result['feet'] = floatValue;
            const meters = convertUnit(floatValue, conversionFactors['feetToMeters']);
            result['meters'] = meters;
            result['miles'] = convertUnit(meters, 1 / 1609.34);
            result['inches'] = convertUnit(floatValue, 12);
            result['centimeters'] = convertUnit(meters, conversionFactors['metersToMillimeters'] / 10);
            result['millimeters'] = convertUnit(meters, conversionFactors['metersToMillimeters']);
            result['kilometers'] = convertUnit(meters, 1 / 1000);
        } else if (unit === 'inches') {
            result['inches'] = floatValue;
            const meters = convertUnit(floatValue, conversionFactors['inchesToCentimeters'] / 100);
            result['meters'] = meters;
            result['miles'] = convertUnit(meters, 1 / 1609.34);
            result['feet'] = convertUnit(floatValue, 1 / 12);
            result['centimeters'] = convertUnit(meters, conversionFactors['metersToMillimeters'] / 10);
            result['millimeters'] = convertUnit(meters, conversionFactors['metersToMillimeters']);
            result['kilometers'] = convertUnit(meters, 1 / 1000);
        } else if (unit === 'centimeters') {
            result['centimeters'] = floatValue;
            const meters = convertUnit(floatValue, 1 / 100);
            result['meters'] = meters;
            result['miles'] = convertUnit(meters, 1 / 1609.34);
            result['feet'] = convertUnit(meters, conversionFactors['metersToFeet']);
            result['inches'] = convertUnit(floatValue, conversionFactors['centimetersToInches']);
            result['millimeters'] = convertUnit(floatValue, 10);
            result['kilometers'] = convertUnit(meters, 1 / 1000);
        } else if (unit === 'millimeters') {
            result['millimeters'] = floatValue;
            const meters = convertUnit(floatValue, 1 / 1000);
            result['meters'] = meters;
            result['miles'] = convertUnit(meters, 1 / 1609.34);
            result['feet'] = convertUnit(meters, conversionFactors['metersToFeet']);
            result['inches'] = convertUnit(meters, conversionFactors['metersToFeet'] * 12);
            result['centimeters'] = convertUnit(meters, 1 / 10);
            result['kilometers'] = convertUnit(meters, 1 / 1000);
        }
    } else if (unit === 'celsius' || unit === 'fahrenheit' || unit === 'kelvin') {
        if (unit === 'celsius') {
            result['celsius'] = floatValue;
            result['fahrenheit'] = convertTemperature(floatValue, 'celsiusToFahrenheit');
            result['kelvin'] = convertTemperature(floatValue, 'celsiusToKelvin');
        } else if (unit === 'fahrenheit') {
            result['fahrenheit'] = floatValue;
            result['celsius'] = convertTemperature(floatValue, 'fahrenheitToCelsius');
            result['kelvin'] = convertTemperature(floatValue, 'fahrenheitToKelvin');
        } else if (unit === 'kelvin') {
            result['kelvin'] = floatValue;
            result['celsius'] = convertTemperature(floatValue, 'kelvinToCelsius');
            result['fahrenheit'] = convertTemperature(floatValue, 'kelvinToFahrenheit');
        }
    } else {
        return res.status(400).json({ error: "Invalid unit type" });
    }

    res.json(result);
});

app.listen(port, () => {
    console.log(`Unit Conversion API running on http://localhost:${port}`);
});
