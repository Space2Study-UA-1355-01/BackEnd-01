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

module.exports = { getCountries };
