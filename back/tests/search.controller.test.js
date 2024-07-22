import { describe, it, expect, vi } from 'vitest';
import * as searchController from '../src/controllers/search.controller';

describe('Search Controller', () => {
    it('should get recent searches', () => {
        const req = { session: { recentSearches: ['search1', 'search2'] } };
        const res = { json: vi.fn() };

        searchController.getRecentSearches(req, res);

        expect(res.json).toHaveBeenCalledWith(['search1', 'search2']);
    });

    it('should add a recent search', () => {
        const req = { body: { searchTerm: 'new search' }, session: { recentSearches: [] } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        searchController.addRecentSearch(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Search term added', recentSearches: ['new search'] });
    });

    it('should not add a duplicate recent search', () => {
        const req = { body: { searchTerm: 'search1' }, session: { recentSearches: ['search1'] } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        searchController.addRecentSearch(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Search term added', recentSearches: ['search1'] });
    });

    it('should limit recent searches to 10', () => {
        const req = { body: { searchTerm: 'new search' }, session: { recentSearches: Array(10).fill('search') } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        searchController.addRecentSearch(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Search term added', recentSearches: ['new search', ...Array(9).fill('search')] });
    });
});