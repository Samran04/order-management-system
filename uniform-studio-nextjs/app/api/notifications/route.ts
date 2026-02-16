// ============================================
// NOTIFICATIONS API ROUTE
// ============================================
// GET /api/notifications - Get user notifications
// PUT /api/notifications/read-all - Mark all as read

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

// ============================================
// GET HANDLER - Fetch User Notifications
// ============================================

/**
 * Get User Notifications
 * 
 * Fetches all notifications for the authenticated user
 * Requires authentication
 * 
 * @param request - Next.js request object
 * @returns NextResponse with array of notifications or error
 */
export async function GET(request: NextRequest) {
    try {
        // Authenticate request
        const user = authenticateRequest(request.headers.get('authorization'));
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch notifications for this user
        const notifications = await prisma.notification.findMany({
            where: { userId: user.userId },
            orderBy: { createdAt: 'desc' },
        });

        // Transform data
        const transformedNotifications = notifications.map((notif: any) => ({
            id: notif.id,
            title: notif.title,
            message: notif.message,
            type: notif.type,
            read: notif.read,
            timestamp: notif.createdAt.toISOString(),
        }));

        return NextResponse.json(transformedNotifications);

    } catch (error) {
        console.error('Get notifications error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// ============================================
// POST HANDLER - Create Notification
// ============================================

/**
 * Create Notification
 * 
 * Creates a new notification for a user
 * Requires authentication (Admin only recommended)
 * 
 * @param request - Next.js request object
 * @returns NextResponse with created notification or error
 */
export async function POST(request: NextRequest) {
    try {
        // Authenticate request
        const user = authenticateRequest(request.headers.get('authorization'));
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse request body
        const body = await request.json();
        const { userId, title, message, type } = body;

        // Create notification
        const notification = await prisma.notification.create({
            data: {
                userId: userId || user.userId, // Default to current user
                title,
                message,
                type: type || 'info',
            },
        });

        return NextResponse.json({
            id: notification.id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            read: notification.read,
            timestamp: notification.createdAt.toISOString(),
        }, { status: 201 });

    } catch (error) {
        console.error('Create notification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
