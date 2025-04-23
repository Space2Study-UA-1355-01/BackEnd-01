const axios = require('axios');

const API_KEY = 'OWRxZlBwaXpIWXlYN3loZlB6cm1hdkhpWHVNeUthR1lFVlU3S21vWA==';
const BASE_URL = 'https://api.countrystatecity.in/v1';

const getCountries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/countries`, {
      headers: {
        'X-CSCAPI-KEY': API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error with getting countries');
  }
};

const getCitiesByCountryIso2 = async (countryIso2) => {
  try {
    const response = await axios.get(`${BASE_URL}/countries/${countryIso2}/cities`, {
      headers: {
        'X-CSCAPI-KEY': API_KEY,
      },
    });

    const sortedCities = response.data.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return sortedCities;
  } catch (error) {
    throw new Error(`Error with getting cities in country with ${countryIso2}`);
  }
};

module.exports = {
  getCountries,
  getCitiesByCountryIso2
};
