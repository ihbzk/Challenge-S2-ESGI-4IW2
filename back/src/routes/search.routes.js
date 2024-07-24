const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

router.get('/recent-searches', searchController.getRecentSearches);
router.post('/recent-searches', searchController.addRecentSearch);

module.exports = router;