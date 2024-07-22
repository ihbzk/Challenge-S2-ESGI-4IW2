import { describe, it, expect, vi } from 'vitest';
import { createPaymentIntent } from '../src/controllers/payment.controller';
import stripe from '../src/config/stripe';

vi.mock('../src/config/stripe');

describe('createPaymentIntent', () => {
    it('devrait créer une intention de paiement et retourner le secret client', async () => {
        const req = {
            body: {
                amount: 1000,
            },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        const mockPaymentIntent = {
            client_secret: 'test_secret',
        };

        stripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);

        await createPaymentIntent(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
            clientSecret: 'test_secret',
        });
    });

    it('devrait gérer les erreurs', async () => {
        const req = {
            body: {
                amount: 1000,
            },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        const errorMessage = 'Test error';
        stripe.paymentIntents.create.mockRejectedValue(new Error(errorMessage));

        await createPaymentIntent(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            error: errorMessage,
        });
    });
});