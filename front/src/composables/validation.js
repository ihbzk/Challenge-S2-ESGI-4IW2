import { z } from 'zod';

export const registerSchema = z.object({
    role: z.enum(['ROLE_USER', 'ROLE_STORE_KEEPER', 'ROLE_ADMIN'], {
        errorMap: () => ({ message: "Le rôle doit être 'ROLE_USER', 'ROLE_STORE_KEEPER' ou 'ROLE_ADMIN'" })
    }).default('ROLE_USER'),
    firstname: z.string().nonempty({ message: 'Le prénom est obligatoire' }),
    lastname: z.string().nonempty({ message: 'Le nom de famille est obligatoire' }),
    email: z.string().email({ message: "Le format de l'adresse email est invalide" }),
    password: z.string()
        .min(12, { message: 'Le mot de passe doit contenir au moins 12 caractères' })
        .regex(/^(?=.*[a-z])/, { message: 'Le mot de passe doit contenir au moins une lettre minuscule' })
        .regex(/^(?=.*[A-Z])/, { message: 'Le mot de passe doit contenir au moins une lettre majuscule' })
        .regex(/^(?=.*\d)/, { message: 'Le mot de passe doit contenir au moins un chiffre' })
        .regex(/^(?=.*[\W_])/, { message: 'Le mot de passe doit contenir au moins un caractère spécial' }),
    
    repeatPassword: z.string().min(12, { message: 'Le mot de passe doit contenir au moins 12 caractères' })
        .regex(/^(?=.*[a-z])/, { message: 'Le mot de passe doit contenir au moins une lettre minuscule' })
        .regex(/^(?=.*[A-Z])/, { message: 'Le mot de passe doit contenir au moins une lettre majuscule' })
        .regex(/^(?=.*\d)/, { message: 'Le mot de passe doit contenir au moins un chiffre' })
        .regex(/^(?=.*[\W_])/, { message: 'Le mot de passe doit contenir au moins un caractère spécial' }),
    lastPasswordModificationDate: z.date().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    isConfirmed: z.boolean().default(false),
    loginAttempts: z.number().int().nonnegative().default(0),
    lockUntil: z.date().optional()
}).superRefine(({ password, repeatPassword }, ctx) => {
    if (password !== repeatPassword) {
        ctx.addIssue({
            path: ['repeatPassword'],
            message: 'Les mots de passe ne correspondent pas',
        });
    }
});

export const loginSchema = z.object({
    email: z.string().email({ message: "Le format de l'adresse email est invalide" }),
    password: z.string().min(12, { message: 'Le mot de passe doit contenir au moins 12 caractères' })
});

export const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Le format de l'adresse email est invalide" }),
});

export const resetPasswordSchema = z.object({
    password: z.string()
        .min(12, { message: 'Le mot de passe doit contenir au moins 12 caractères' })
        .regex(/^(?=.*[a-z])/, { message: 'Le mot de passe doit contenir au moins une lettre minuscule' })
        .regex(/^(?=.*[A-Z])/, { message: 'Le mot de passe doit contenir au moins une lettre majuscule' })
        .regex(/^(?=.*\d)/, { message: 'Le mot de passe doit contenir au moins un chiffre' })
        .regex(/^(?=.*[\W_])/, { message: 'Le mot de passe doit contenir au moins un caractère spécial' }),
    repeatPassword: z.string().min(12, { message: 'Le mot de passe doit contenir au moins 12 caractères' })
        .regex(/^(?=.*[a-z])/, { message: 'Le mot de passe doit contenir au moins une lettre minuscule' })
        .regex(/^(?=.*[A-Z])/, { message: 'Le mot de passe doit contenir au moins une lettre majuscule' })
        .regex(/^(?=.*\d)/, { message: 'Le mot de passe doit contenir au moins un chiffre' })
        .regex(/^(?=.*[\W_])/, { message: 'Le mot de passe doit contenir au moins un caractère spécial' }),
}).superRefine(({ password, repeatPassword }, ctx) => {
    if (password !== repeatPassword) {
        ctx.addIssue({
            path: ['repeatPassword'],
            message: 'Les mots de passe ne correspondent pas',
        });
    }
});