const axios = require('axios');

const getCountries = async ({ search = '', page = 1, limit = 20 } = {}) => {
  try {
    const response = await axios.get(`${process.env.COUNTRY_BASE_URL}/countries`, {
      headers: {
        'X-CSCAPI-KEY': process.env.COUNTRY_API_KEY,
      },
    });

    let countries = response.data;

    if (search) {
      countries = countries.filter(country =>
        country.name.toLowerCase().startsWith(search.toLowerCase())
      );
    }

    countries.sort((a, b) => a.name.localeCompare(b.name));

    const startIndex = (page - 1) * limit;
    const paginatedCountries = countries.slice(startIndex, startIndex + limit);

    return {
      data: paginatedCountries,
      total: countries.length,
      page,
      limit,
      totalPages: Math.ceil(countries.length / limit),
    };
  } catch (error) {
    throw new Error('Error with getting countries');
  }
};

const getCitiesByCountryIso2 = async (countryIso2, { search = '', page = 1, limit = 20 } = {}) => {
  try {
    const response = await axios.get(`${process.env.COUNTRY_BASE_URL}/countries/${countryIso2}/cities`, {
      headers: {
        'X-CSCAPI-KEY': process.env.COUNTRY_API_KEY,
      },
    });

    let cities = response.data;

    if (search) {
      cities = cities.filter(city =>
        city.name.toLowerCase().startsWith(search.toLowerCase())
      );
    }

    cities.sort((a, b) => a.name.localeCompare(b.name));

    const startIndex = (page - 1) * limit;
    const paginatedCities = cities.slice(startIndex, startIndex + limit);

    return {
      data: paginatedCities,
      total: cities.length,
      page,
      limit,
      totalPages: Math.ceil(cities.length / limit),
    };
  } catch (error) {
    throw new Error(`Error with getting cities in country with ${countryIso2}`);
  }
};

module.exports = {
  getCountries,
  getCitiesByCountryIso2
};
