import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateResetToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/mail';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

/**
 * Forgot Password Handler
 * POST /api/auth/forgot-password
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validationResult = forgotPasswordSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        const { email } = validationResult.data;

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Even if user not found, return success for security (prevent email enumeration)
        if (!user) {
            return NextResponse.json({
                message: 'If an account exists with this email, a reset link has been sent.',
            });
        }

        // Generate reset token and expiry (1 hour)
        const resetToken = generateResetToken();
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Save to user
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        // Send reset email
        await sendPasswordResetEmail(user.email, resetToken);

        return NextResponse.json({
            message: 'If an account exists with this email, a reset link has been sent.',
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
