import { z } from 'zod';

export const registerSchema = z.object({
    role: z.enum(['ROLE_USER', 'ROLE_STORE_KEEPER', 'ROLE_COMPTA', 'ROLE_ADMIN'], {
        errorMap: () => ({ message: "Le rôle doit être 'ROLE_USER', 'ROLE_STORE_KEEPER', 'ROLE_COMPTA' ou 'ROLE_ADMIN'" })
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

export const productSchema = z.object({
    productName: z.string().min(1, { message: "Le nom du produit est obligatoire" }),
    description: z.string().min(1, { message: "La description est obligatoire" }),
    category: z.string().min(1, { message: "La catégorie est obligatoire" }),
    brand: z.string().min(1, { message: "La marque est obligatoire" }),
    price: z.number().min(0, { message: "Le prix doit être supérieur ou égal à 0" }),
    promotion: z.boolean(),
    stock: z.number().int().min(0, { message: "Le stock doit être un entier supérieur ou égal à 0" }),
    illustration: z.string().url({ message: "L'illustration doit être une URL valide" }),
});

export const widgetSchema = z.object({
    title: z.string().min(1, { message: "Le titre est obligatoire" }),
    x: z.number().int().nonnegative(),
    y: z.number().int().nonnegative(),
    width: z.number().int().nonnegative(),
    height: z.number().int().nonnegative(),
    dimensionsDatas: z.array(z.string()).optional(),
    measuresDatas: z.array(z.string()).optional(),
    type: z.enum(['bar', 'line', 'pie'], {
        errorMap: () => ({ message: "Le type doit être 'bar', 'line' ou 'pie'" })
    }),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});