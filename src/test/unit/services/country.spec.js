const countryService = require('~/services/countries');
const axios = require('axios');

jest.mock('axios');
require('dotenv').config({ path: '.env.local' });

describe('countryService', () => {

  describe('getCountries', () => {
    it('should return a list of countries from the external API', async () => {
      const mockCountries = [
        {
          id: 233,
          name: 'United States',
          iso2: 'US',
          iso3: 'USA',
          phonecode: '1',
          capital: 'Washington',
          currency: 'USD',
          native: 'United States',
          emoji: '🇺🇸',
        },
        {
          id: 244,
          name: 'Canada',
          iso2: 'CA',
          iso3: 'CAN',
          phonecode: '1',
          capital: 'Ottawa',
          currency: 'CAD',
          native: 'Canada',
          emoji: '🇨🇦',
        }
      ];

      axios.get.mockResolvedValue({ data: mockCountries });

      const result = await countryService.getCountries();

      expect(axios.get).toHaveBeenCalledWith(`${process.env.COUNTRY_BASE_URL}/countries`, {
        headers: { 'X-CSCAPI-KEY': process.env.COUNTRY_API_KEY }
      });
      expect(result).toEqual(mockCountries);
    });

    it('should throw an error if the external API fails', async () => {
        axios.get.mockRejectedValueOnce(new Error('Error fetching countries'));
      
        try {
          await countryService.getCountries();
        } catch (error) {
          expect(error.message).toBe('Error with getting countries');
        }
      });
  });
});
