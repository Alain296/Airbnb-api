import { Role } from "@prisma/client";
import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.nativeEnum(Role).optional(),
    avatar: z.string().url("Avatar must be a valid URL").optional(),
    bio: z.string().optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required")
  })
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters")
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format")
  })
});

export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().min(1, "Token is required")
  }),
  body: z.object({
    password: z.string().min(8, "Password must be at least 8 characters")
  })
});