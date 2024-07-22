import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import checkAuth from '../src/middlewares/checkAuth';
import User from '../src/models/user.model';
import blacklistedTokens from '../src/middlewares/blacklistedTokens';

vi.mock('jsonwebtoken');
vi.mock('../src/models/user.model');
vi.mock('../src/middlewares/blacklistedTokens');

describe('middleware checkAuth', () => {
    it('devrait retourner 401 si aucun en-tête d’autorisation n’est présent', async () => {
        const req = { headers: {} };
        const res = { sendStatus: vi.fn() };
        const next = vi.fn();

        await checkAuth(req, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner 401 si le type d’autorisation n’est pas Bearer', async () => {
        const req = { headers: { authorization: 'Basic token' } };
        const res = { sendStatus: vi.fn() };
        const next = vi.fn();

        await checkAuth(req, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner 403 si le jeton est sur liste noire', async () => {
        const req = { headers: { authorization: 'Bearer token' } };
        const res = { sendStatus: vi.fn() };
        const next = vi.fn();

        blacklistedTokens.has.mockReturnValue(true);

        await checkAuth(req, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner 401 si la vérification du jeton échoue', async () => {
        const req = { headers: { authorization: 'Bearer token' } };
        const res = { sendStatus: vi.fn() };
        const next = vi.fn();

        blacklistedTokens.has.mockReturnValue(false);
        jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

        await checkAuth(req, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('devrait définir req.user et appeler next si le jeton est valide', async () => {
        const req = { headers: { authorization: 'Bearer token' } };
        const res = { sendStatus: vi.fn() };
        const next = vi.fn();

        const decoded = { id: 1 };
        const user = { id: 1, name: 'Test User' };

        blacklistedTokens.has.mockReturnValue(false);
        jwt.verify.mockReturnValue(decoded);
        User.findByPk.mockResolvedValue(user);

        await checkAuth(req, res, next);

        expect(req.user).toEqual(user);
        expect(next).toHaveBeenCalled();
    });
});