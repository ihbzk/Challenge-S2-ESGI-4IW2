import { describe, it, expect, vi } from 'vitest';
import checkRole from '../src/middlewares/checkRole';

describe('checkRole middleware', () => {
    it('should return 401 if req.user is not set', async () => {
        const req = {};
        const res = { sendStatus: vi.fn() };
        const next = vi.fn();

        await checkRole({ roles: ['ROLE_ADMIN'] })(req, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user role is not authorized', async () => {
        const req = { user: { role: 'ROLE_USER' } };
        const res = { sendStatus: vi.fn() };
        const next = vi.fn();

        await checkRole({ roles: ['ROLE_ADMIN'] })(req, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next if user role is authorized', async () => {
        const req = { user: { role: 'ROLE_ADMIN' } };
        const res = { sendStatus: vi.fn() };
        const next = vi.fn();

        await checkRole({ roles: ['ROLE_ADMIN'] })(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});