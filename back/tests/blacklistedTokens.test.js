import { describe, it, expect } from 'vitest';
import blacklistedTokens from '../src/middlewares/blacklistedTokens';

describe('blacklistedTokens', () => {
    it('should add a token to the blacklist', () => {
        const token = 'testToken';
        blacklistedTokens.add(token);
        expect(blacklistedTokens.has(token)).toBe(true);
    });

    it('should remove a token from the blacklist', () => {
        const token = 'testToken';
        blacklistedTokens.add(token);
        blacklistedTokens.delete(token);
        expect(blacklistedTokens.has(token)).toBe(false);
    });
});