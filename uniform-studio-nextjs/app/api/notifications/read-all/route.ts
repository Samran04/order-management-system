// ============================================
// MARK ALL NOTIFICATIONS READ API ROUTE
// ============================================
// PUT /api/notifications/read-all - Mark all notifications as read

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

// ============================================
// PUT HANDLER - Mark All Notifications as Read
// ============================================

/**
 * Mark All Notifications as Read
 * 
 * Updates all user's notifications to read status
 * Requires authentication
 * 
 * @param request - Next.js request object
 * @returns NextResponse with count of updated notifications or error
 */
export async function PUT(request: NextRequest) {
    try {
        // Authenticate request
        const user = authenticateRequest(request.headers.get('authorization'));
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Update all notifications for this user
        const result = await prisma.notification.updateMany({
            where: {
                userId: user.userId,
                read: false,
            },
            data: {
                read: true,
            },
        });

        return NextResponse.json({
            message: 'All notifications marked as read',
            count: result.count,
        });

    } catch (error) {
        console.error('Mark all notifications read error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
