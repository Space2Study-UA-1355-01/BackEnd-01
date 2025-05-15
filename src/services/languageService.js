const axios = require('axios')

const fetchLanguages = async () => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all', {
      timeout: 5000 // Add timeout
    });
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid API response format');
    }

    // Extract unique languages from countries data
    const languagesMap = response.data.reduce((acc, country) => {
      if (country.languages) {
        Object.entries(country.languages).forEach(([code, name]) => {
          // Ensure consistent case for codes
          acc[code.toLowerCase()] = name;
        });
      }
      return acc;
    }, {});

    // Convert to array of objects
    const languages = Object.entries(languagesMap).map(([code, name]) => ({
      code,
      name: name.trim() // Ensure clean strings
    }));

    // Sort by language name
    return languages.sort((a, b) => a.name.localeCompare(b.name));
    
  } catch (error) {
    console.error('Error fetching languages:', error);
    // Return a sensible default or cached data in case of API failure
    throw error;
  }
}

module.exports = {
  fetchLanguages
}
