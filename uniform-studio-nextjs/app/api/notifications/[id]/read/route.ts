// ============================================
// SINGLE NOTIFICATION API ROUTE
// ============================================
// PUT /api/notifications/[id]/read - Mark notification as read

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

// ============================================
// PUT HANDLER - Mark Notification as Read
// ============================================

/**
 * Mark Notification as Read
 * 
 * Updates a notification's read status to true
 * Requires authentication
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing notification ID
 * @returns NextResponse with success message or error
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Authenticate request
        const user = authenticateRequest(request.headers.get('authorization'));
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Update notification
        const notification = await prisma.notification.update({
            where: {
                id: params.id,
                userId: user.userId, // Ensure user owns this notification
            },
            data: {
                read: true,
            },
        });

        return NextResponse.json({
            id: notification.id,
            read: notification.read,
        });

    } catch (error) {
        console.error('Mark notification read error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
