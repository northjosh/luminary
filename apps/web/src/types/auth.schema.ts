import { z } from 'zod/v4';

const PASSWORD_LENGTH = 25

export const ZPasswordSchema = z
.string()
.min(8, { message: 'Must be at least 8 characters in length' })
.max(72, { message: 'Cannot be more than 72 characters in length' })
.refine((value) => value.length > PASSWORD_LENGTH || /[A-Z]/.test(value), {
    message: 'One uppercase character',
})
.refine((value) => value.length > PASSWORD_LENGTH || /[a-z]/.test(value), { 
    message: 'One lowercase character',
})
.refine((value) => value.length > PASSWORD_LENGTH || /\d/.test(value), {
    message: 'One number',
})
.refine(
    (value) =>
        value.length > PASSWORD_LENGTH || /[`~<>?,./!@#$%^&*()\-_"'+=|{}[\];:\\]/.test(value),
    {
        message: 'One special character is required',
    }
);

export const ZSignUpSchema = z.object({
  firstName: z.string().min(2, 'Name must be at least 2 characters'),
  lastName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: ZPasswordSchema,
});

export const ZLoginSchema = z.object({
  email: z.email('Invalid email address'),
  password: ZPasswordSchema,
});