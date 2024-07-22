import { describe, it, expect } from 'vitest';
import blacklistedTokens from '../src/middlewares/blacklistedTokens';

describe('blacklistedTokens', () => {
    it('devrait ajouter un jeton à la liste noire', () => {
        const token = 'testToken';
        blacklistedTokens.add(token);
        expect(blacklistedTokens.has(token)).toBe(true);
    });

    it('devrait supprimer un jeton de la liste noire', () => {
        const token = 'testToken';
        blacklistedTokens.add(token);
        blacklistedTokens.delete(token);
        expect(blacklistedTokens.has(token)).toBe(false);
    });
});