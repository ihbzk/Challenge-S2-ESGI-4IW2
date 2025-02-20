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
    categoryId: z.number().int().min(1, { message: "La catégorie est obligatoire" }),
    brandId: z.number().nonnegative('La marque est obligatoire'),
    price: z.number().min(0, { message: "Le prix doit être supérieur ou égal à 0" }),
    promotion: z.boolean(),
    stock: z.number().int().min(0, { message: "Le stock doit être un entier supérieur ou égal à 0" }),
    illustration: z.string().url({ message: "L'illustration doit être une URL valide" }),
});

export const categorySchema = z.object({
  name: z.string().min(1, { message: "Le nom de la catégorie est obligatoire" }),
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

export const informationsSchema = z.object({
    email: z.string().email({ message: "Le format de l'adresse email est invalide" }),
    newsletter: z.boolean().optional(),
});

export const orderSchema = z.object({
    firstName: z.string().min(1, { message: 'Le prénom est obligatoire' }).optional(),
    lastName: z.string().min(1, { message: 'Le nom est obligatoire' }),
    address: z.string().min(1, { message: 'L\'adresse est obligatoire' }),
    city: z.string().min(1, { message: 'La ville est obligatoire' }),
    postalCode: z.string()
      .length(5, { message: 'Le code postal doit comporter exactement 5 chiffres' })
      .regex(/^\d{5}$/, { message: 'Le code postal doit contenir uniquement des chiffres' }),
    country: z.string().min(1, { message: 'Le pays est obligatoire' }),
});

export const userInfoSchema = z.object({
    firstname: z.string().nonempty({ message: 'Le prénom est obligatoire' }),
    lastname: z.string().nonempty({ message: 'Le nom de famille est obligatoire' }),
    email: z.string().email({ message: "Le format de l'adresse email est invalide" }),
    password: z.string().optional().refine((value) => {
      if (value) {
        return (
          value.length >= 12 &&
          /[a-z]/.test(value) &&
          /[A-Z]/.test(value) &&
          /\d/.test(value) &&
          /[\W_]/.test(value)
        );
      }
      return true;
    }, {
      message: 'Le mot de passe doit contenir au moins 12 caractères, une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial',
    }),
    confirmPassword: z.string().optional(),
  }).superRefine(({ password, confirmPassword }, ctx) => {
    if (password && password !== confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: 'Les mots de passe ne correspondent pas',
      });
    }
  });
  