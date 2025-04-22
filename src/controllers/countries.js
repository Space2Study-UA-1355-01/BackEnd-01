const countriesService = require('../services/countries');

const fetchCountries = async (req, res) => {
  try {
    const countries = await countriesService.getCountries();
    res.json(countries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error with getting countries' });
  }
};

const fetchCitiesByCountry = async (req, res) => {
  const { countryCode } = req.params;

  if (!countryCode) {
    return res.status(400).json({ message: 'Country code is required' });
  }

  try {
    const cities = await countriesService.getCitiesByCountryIso2(countryCode);
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
