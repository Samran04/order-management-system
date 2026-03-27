import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const verifySchema = z.object({
    token: z.string().min(1, 'Token is required'),
});

/**
 * Verify Email Handler
 * POST /api/auth/verify-email
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validationResult = verifySchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        const { token } = validationResult.data;

        // Find user by token
        const user = await prisma.user.findUnique({
            where: { verificationToken: token },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid or expired verification token' },
                { status: 400 }
            );
        }

        // Mark user as verified
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null,
            },
        });

        return NextResponse.json({
            message: 'Email verified successfully. You can now log in.',
        });

    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
