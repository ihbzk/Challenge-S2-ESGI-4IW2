import { describe, it, expect, vi } from 'vitest';
import checkRole from '../src/middlewares/checkRole';

describe('middleware checkRole', () => {
    it('devrait retourner 401 si req.user n’est pas défini', async () => {
        const req = {};
        const res = { sendStatus: vi.fn() };
        const next = vi.fn();

        await checkRole({ roles: ['ROLE_ADMIN'] })(req, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner 403 si le rôle de l’utilisateur n’est pas autorisé', async () => {
        const req = { user: { role: 'ROLE_USER' } };
        const res = { sendStatus: vi.fn() };
        const next = vi.fn();

        await checkRole({ roles: ['ROLE_ADMIN'] })(req, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it('devrait appeler next si le rôle de l’utilisateur est autorisé', async () => {
        const req = { user: { role: 'ROLE_ADMIN' } };
        const res = { sendStatus: vi.fn() };
        const next = vi.fn();

        await checkRole({ roles: ['ROLE_ADMIN'] })(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});