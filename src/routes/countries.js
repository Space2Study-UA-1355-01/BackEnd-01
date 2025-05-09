const express = require('express');
const router = express.Router();
const countryController =  require('~/controllers/countries');
const asyncWrapper = require('~/middlewares/asyncWrapper')

router.get('/', asyncWrapper(countryController.fetchCountries));
router.get('/:countryCode/cities', asyncWrapper(countryController.fetchCitiesByCountry));


module.exports = router;
