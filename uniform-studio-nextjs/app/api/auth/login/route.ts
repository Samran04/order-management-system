// ============================================
// LOGIN API ROUTE
// ============================================
// POST /api/auth/login
// Authenticates a user and returns a JWT token

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';
import { z } from 'zod';

// ============================================
// VALIDATION SCHEMA
// ============================================

/**
 * Login request validation schema
 * Ensures email and password are provided
 */
const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// ============================================
// POST HANDLER
// ============================================

/**
 * Login Handler
 * 
 * Authenticates user credentials and returns JWT token
 * 
 * @param request - Next.js request object
 * @returns NextResponse with user data and token, or error
 * 
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 * 
 * Success Response (200):
 * {
 *   "user": { id, email, name, role, organization },
 *   "token": "jwt-token-here"
 * }
 * 
 * Error Responses:
 * - 400: Validation error
 * - 401: Invalid credentials
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
    try {
        // ==========================================
        // 1. PARSE AND VALIDATE REQUEST BODY
        // ==========================================
        const body = await request.json();
        const validationResult = loginSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        const { email, password } = validationResult.data;

        // ==========================================
        // 2. FIND USER IN DATABASE
        // ==========================================
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // User not found - return generic error for security
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // ==========================================
        // 3. VERIFY PASSWORD
        // ==========================================
        const isValidPassword = await verifyPassword(password, user.passwordHash);

        // Password incorrect - return generic error for security
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // ==========================================
        // 4. GENERATE JWT TOKEN
        // ==========================================
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        // ==========================================
        // 5. RETURN SUCCESS RESPONSE
        // ==========================================
        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                organization: user.organization,
            },
            token,
        });

    } catch (error) {
        // ==========================================
        // ERROR HANDLING
        // ==========================================
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
