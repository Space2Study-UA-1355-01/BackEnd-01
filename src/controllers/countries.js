const { getCountries } = require('../services/countries');

const fetchCountries = async (req, res) => {
  try {
    const countries = await getCountries();
    res.json(countries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error with getting countries' });
  }
};

module.exports = { fetchCountries };
