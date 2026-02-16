// ============================================
// REGISTER API ROUTE
// ============================================
// POST /api/auth/register
// Creates a new user account and returns a JWT token

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { z } from 'zod';

// ============================================
// VALIDATION SCHEMA
// ============================================

/**
 * Registration request validation schema
 * Ensures all required fields are provided and valid
 */
const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(['Admin', 'Sales', 'Production'], {
        message: 'Role must be Admin, Sales, or Production',
    }),
    organization: z.string().optional(),
});

// ============================================
// POST HANDLER
// ============================================

/**
 * Register Handler
 * 
 * Creates a new user account with hashed password
 * and returns JWT token for immediate login
 * 
 * @param request - Next.js request object
 * @returns NextResponse with user data and token, or error
 * 
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123",
 *   "name": "John Doe",
 *   "role": "Sales",
 *   "organization": "Company Name" (optional)
 * }
 * 
 * Success Response (201):
 * {
 *   "user": { id, email, name, role, organization },
 *   "token": "jwt-token-here"
 * }
 * 
 * Error Responses:
 * - 400: Validation error or email already exists
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
    try {
        // ==========================================
        // 1. PARSE AND VALIDATE REQUEST BODY
        // ==========================================
        const body = await request.json();
        const validationResult = registerSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        const { email, password, name, role, organization } = validationResult.data;

        // ==========================================
        // 2. CHECK IF USER ALREADY EXISTS
        // ==========================================
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // ==========================================
        // 3. HASH PASSWORD
        // ==========================================
        // NEVER store plain text passwords!
        const passwordHash = await hashPassword(password);

        // ==========================================
        // 4. CREATE USER IN DATABASE
        // ==========================================
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                role,
                organization,
            },
        });

        // ==========================================
        // 5. GENERATE JWT TOKEN
        // ==========================================
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        // ==========================================
        // 6. RETURN SUCCESS RESPONSE
        // ==========================================
        return NextResponse.json(
            {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    organization: user.organization,
                },
                token,
            },
            { status: 201 } // 201 Created
        );

    } catch (error) {
        // ==========================================
        // ERROR HANDLING
        // ==========================================
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
