const axios = require('axios');

const getCountries = async () => {
  try {
    const response = await axios.get(`${process.env.COUNTRY_BASE_URL}/countries`, {
      headers: {
        'X-CSCAPI-KEY': process.env.COUNTRY_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error with getting countries');
  }
};

const getCitiesByCountryIso2 = async (countryIso2) => {
  try {
    const response = await axios.get(`${process.env.COUNTRY_BASE_URL}/countries/${countryIso2}/cities`, {
      headers: {
        'X-CSCAPI-KEY': process.env.COUNTRY_API_KEY,
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
