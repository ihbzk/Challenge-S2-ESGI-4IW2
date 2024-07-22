exports.getRecentSearches = (req, res) => {
    const recentSearches = req.session.recentSearches || [];
    res.json(recentSearches);
};

exports.addRecentSearch = (req, res) => {
    const searchTerm = req.body.searchTerm;
    if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
    }

    req.session.recentSearches = req.session.recentSearches || [];

    if (!req.session.recentSearches.includes(searchTerm)) {
        req.session.recentSearches.unshift(searchTerm);
    }

    if (req.session.recentSearches.length > 10) {
        req.session.recentSearches.pop();
    }

    res.status(201).json({ message: 'Search term added', recentSearches: req.session.recentSearches });
};