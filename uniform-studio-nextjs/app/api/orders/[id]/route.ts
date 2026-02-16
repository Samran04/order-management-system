// ============================================
// SINGLE ORDER API ROUTE
// ============================================
// GET /api/orders/[id] - Get single order
// PUT /api/orders/[id] - Update order
// DELETE /api/orders/[id] - Delete order

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

// ============================================
// GET HANDLER - Fetch Single Order
// ============================================

/**
 * Get Single Order
 * 
 * Fetches a specific order by ID
 * Requires authentication
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing order ID
 * @returns NextResponse with order data or error
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Authenticate request
        const user = authenticateRequest(request.headers.get('authorization'));
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch order from database
        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                salesPerson: {
                    select: { id: true, name: true, email: true, role: true },
                },
                postDelivery: true,
            },
        });

        // Order not found
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Transform data
        const transformedOrder = {
            ...order,
            date: order.date.toISOString(),
            startDate: order.startDate.toISOString(),
            deliveryDate: order.deliveryDate.toISOString(),
            salesPerson: order.salesPerson.name,
            salesPersonId: order.salesPerson.id,
        };

        return NextResponse.json(transformedOrder);

    } catch (error) {
        console.error('Get order error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// ============================================
// PUT HANDLER - Update Order
// ============================================

/**
 * Update Order
 * 
 * Updates an existing order
 * Requires authentication
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing order ID
 * @returns NextResponse with updated order or error
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

        // Parse request body
        const body = await request.json();

        // Convert date strings to Date objects if present
        const updateData: any = { ...body };
        if (body.date) updateData.date = new Date(body.date);
        if (body.startDate) updateData.startDate = new Date(body.startDate);
        if (body.deliveryDate) updateData.deliveryDate = new Date(body.deliveryDate);

        // Update order in database
        const order = await prisma.order.update({
            where: { id: params.id },
            data: updateData,
            include: {
                salesPerson: {
                    select: { id: true, name: true, email: true, role: true },
                },
                postDelivery: true,
            },
        });

        // Transform data
        const transformedOrder = {
            ...order,
            date: order.date.toISOString(),
            startDate: order.startDate.toISOString(),
            deliveryDate: order.deliveryDate.toISOString(),
            salesPerson: order.salesPerson.name,
            salesPersonId: order.salesPerson.id,
        };

        return NextResponse.json(transformedOrder);

    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// ============================================
// DELETE HANDLER - Delete Order
// ============================================

/**
 * Delete Order
 * 
 * Deletes an order from the database
 * Requires authentication (Admin only recommended)
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing order ID
 * @returns NextResponse with success message or error
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Authenticate request
        const user = authenticateRequest(request.headers.get('authorization'));
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Optional: Check if user is Admin
        // if (user.role !== 'Admin') {
        //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        // }

        // Delete order from database
        await prisma.order.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Order deleted successfully' });

    } catch (error) {
        console.error('Delete order error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
