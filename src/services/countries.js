const axios = require('axios');

const API_KEY = 'api-key';
const BASE_URL = 'https://api.countrystatecity.in/v1';

// const getCountries = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/countries`, {
//       headers: {
//         'X-CSCAPI-KEY': API_KEY,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error('Error with getting countries');
//   }
// };


const getCountries = async () => {
  try {
    const response = [
      { name: 'Ukraine', iso2: 'UA' },
      { name: 'Poland', iso2: 'PL' },
      { name: 'Germany', iso2: 'DE' },
      { name: 'France', iso2: 'FR' },
      { name: 'Italy', iso2: 'IT' },
    ];
    return response;
  } catch (error) {
    throw new Error('Error with getting countries');
  }
};

module.exports = { getCountries };
