const countriesService = require('../services/countries');

const fetchCountries = async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const parsedPage = Math.max(1, parseInt(page) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));

  try {
    const countries = await countriesService.getCountries({
      search,
      page: parsedPage,
      limit: parsedLimit,
    });

    if (!countries || countries.data.length === 0) {
      return res.status(404).json({ message: `No countries found` });
    }

    res.json(countries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error with getting countries' });
  }
};

const fetchCitiesByCountry = async (req, res) => {
  const { countryCode } = req.params;
  const { search = '', page = 1, limit = 20 } = req.query;

  if (!countryCode) {
    return res.status(400).json({ message: 'Country code is required' });
  }

  const parsedPage = Math.max(1, parseInt(page) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));

  try {
    const cities = await countriesService.getCitiesByCountryIso2(countryCode, {
      search,
      page: parsedPage,
      limit: parsedLimit,
    });

    if (!cities || cities.data.length === 0) {
      return res.status(404).json({ message: `No cities found for country code '${countryCode}'` });
    }

    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error with getting cities for country ${countryCode}` });
  }
};

module.exports = {
  fetchCountries,
  fetchCitiesByCountry,
};
