import { describe, it, expect, vi } from 'vitest';
import * as userController from '../src/controllers/user.controller';
import User from '../src/models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendMail } from '../src/services/emailService';

vi.mock('../src/models/user.model');
vi.mock('bcrypt');
vi.mock('jsonwebtoken');
vi.mock('crypto');
vi.mock('../src/services/emailService');

describe('Contrôleur Utilisateur', () => {
    it('devrait connecter un utilisateur', async () => {
        const req = { body: { email: 'test@example.com', password: 'password' } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const user = { id: 1, password: 'hashedPassword', isConfirmed: true, loginAttempts: 0, save: vi.fn() };
        User.findOne.mockResolvedValue(user);
        bcrypt.compareSync.mockReturnValue(true);
        jwt.sign.mockReturnValue('token');

        await userController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ authToken: 'token' });
    });

    it('devrait enregistrer un utilisateur', async () => {
        const req = { body: { firstname: 'John', lastname: 'Doe', email: 'test@example.com', password: 'password' } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const user = { save: vi.fn(), validate: vi.fn() };
        User.build.mockReturnValue(user);
        User.findOne.mockResolvedValue(null);
        bcrypt.hashSync.mockReturnValue('hashedPassword');
        crypto.randomBytes.mockReturnValue({ toString: () => 'token' });

        await userController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Inscription réussie avec succès. Veuillez vérifier votre email pour confirmer votre inscription.',
            verificationRequired: true
        });
    });

    it('devrait confirmer un utilisateur', async () => {
        const req = { query: { token: 'token' } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const user = { save: vi.fn() };
        User.findOne.mockResolvedValue(user);

        await userController.confirm(req, res);

        expect(user.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Confirmation réussie' });
    });

    it('devrait obtenir les détails de l’utilisateur', async () => {
        const req = { user: { id: 1 }, headers: { authorization: 'Bearer token' } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        const user = { email: 'test@example.com', firstname: 'John', lastname: 'Doe', role: 'ROLE_USER' };
        User.findByPk.mockResolvedValue(user);

        await userController.me(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            email: 'test@example.com',
            firstname: 'John',
            lastname: 'Doe',
            role: 'ROLE_USER'
        });
    });

    it('devrait déconnecter un utilisateur', async () => {
        const req = { headers: { authorization: 'Bearer token' } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        await userController.logout(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Déconnexion réussie' });
    });
});