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

// const getCitiesByCountryIso2 = async (countryIso2) => {
//   try {
//     const res = await axios.get(`${BASE_URL}/countries/${countryIso2}/cities`, {
//       headers,
//     });
//     return res.data;
//   } catch (error) {
//     throw new Error(`Error with getting cities in country with ${countryIso2}`);
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

const getCitiesByCountryIso2 = async (countryIso2) => {
  try {
    const cities = {
      UA: [
        { name: 'Kyiv', iso2: 'UA-KY' },
        { name: 'Lviv', iso2: 'UA-LV' },
        { name: 'Odessa', iso2: 'UA-OD' },
      ],
      PL: [
        { name: 'Warsaw', iso2: 'PL-WA' },
        { name: 'Kraków', iso2: 'PL-KR' },
        { name: 'Gdańsk', iso2: 'PL-GD' },
      ],
      DE: [
        { name: 'Berlin', iso2: 'DE-BE' },
        { name: 'Munich', iso2: 'DE-MU' },
        { name: 'Hamburg', iso2: 'DE-HH' },
      ],
      FR: [
        { name: 'Paris', iso2: 'FR-75' },
        { name: 'Lyon', iso2: 'FR-69' },
        { name: 'Marseille', iso2: 'FR-13' },
      ],
      IT: [
        { name: 'Rome', iso2: 'IT-RM' },
        { name: 'Milan', iso2: 'IT-MI' },
        { name: 'Naples', iso2: 'IT-NA' },
      ],
    };

    if (cities[countryIso2]) {
      return cities[countryIso2];
    } else {
      throw new Error(`No cities found for country with ISO2: ${countryIso2}`);
    }
  } catch (error) {
    throw new Error(`Error with getting cities in country with ${countryIso2}`);
  }
};

module.exports = {
  getCountries,
  getCitiesByCountryIso2
};
