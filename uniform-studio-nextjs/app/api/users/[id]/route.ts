// ============================================
// SINGLE USER API ROUTE
// ============================================
// GET /api/users/[id] - Get user by ID
// PUT /api/users/[id] - Update user profile

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

// ============================================
// GET HANDLER - Get User by ID
// ============================================

/**
 * Get User by ID
 * 
 * Fetches a user's profile by their ID
 * Requires authentication
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing user ID
 * @returns NextResponse with user data or error
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Authenticate request
        const userPayload = authenticateRequest(request.headers.get('authorization'));
        if (!userPayload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user from database
        const user = await prisma.user.findUnique({
            where: { id: params.id },
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
        console.error('Get user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// ============================================
// PUT HANDLER - Update User Profile
// ============================================

/**
 * Update User Profile
 * 
 * Updates a user's profile information
 * Users can only update their own profile unless Admin
 * Requires authentication
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing user ID
 * @returns NextResponse with updated user data or error
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Authenticate request
        const userPayload = authenticateRequest(request.headers.get('authorization'));
        if (!userPayload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is updating their own profile or is Admin
        if (userPayload.userId !== params.id && userPayload.role !== 'Admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Parse request body
        const body = await request.json();
        const { name, organization } = body;

        // Update user (only allow updating name and organization)
        const user = await prisma.user.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(organization !== undefined && { organization }),
            },
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

        return NextResponse.json(user);

    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
