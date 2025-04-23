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

module.exports = { getCountries };
