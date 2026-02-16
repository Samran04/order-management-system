// ============================================
// USERS API ROUTE
// ============================================
// GET /api/users/me - Get current user profile

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

// ============================================
// GET HANDLER - Get Current User
// ============================================

/**
 * Get Current User Profile
 * 
 * Fetches the authenticated user's profile information
 * Requires authentication
 * 
 * @param request - Next.js request object
 * @returns NextResponse with user data or error
 */
export async function GET(request: NextRequest) {
    try {
        // Authenticate request
        const userPayload = authenticateRequest(request.headers.get('authorization'));
        if (!userPayload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user from database
        const user = await prisma.user.findUnique({
            where: { id: userPayload.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                organization: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);

    } catch (error) {
        console.error('Get current user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
