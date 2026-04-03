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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        // Authenticate request
        const user = authenticateRequest(request.headers.get('authorization'));
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch order from database
        const order = await prisma.order.findUnique({
            where: { id: resolvedParams.id },
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        // Authenticate request
        const user = authenticateRequest(request.headers.get('authorization'));
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse request body
        const body = await request.json();

        // Build a clean update payload with only valid Prisma fields.
        // Strip out frontend-only or relation fields: id, salesPerson (string),
        // salesPersonId, postDelivery, createdAt, updatedAt.
        const {
            orderNumber, clientName, brand, productName, itemDescription,
            fabric, color, sleeve, fabricSupplier, accessories, patternFollowed,
            cmPrice, cmUnit, cmPartner, embroideryPrint, sizes, totalQuantity,
            images, logoImage, notes, status, type,
            date: rawDate, startDate: rawStartDate, deliveryDate: rawDeliveryDate,
        } = body;

        const updateData: any = {
            orderNumber, clientName, brand, productName, itemDescription,
            fabric, color, sleeve, fabricSupplier, accessories, patternFollowed,
            cmPrice, cmUnit, cmPartner, embroideryPrint, sizes, totalQuantity,
            images, logoImage, notes,
        };

        // Convert date strings to Date objects if present
        if (rawDate) updateData.date = new Date(rawDate);
        if (rawStartDate) updateData.startDate = new Date(rawStartDate);
        if (rawDeliveryDate) updateData.deliveryDate = new Date(rawDeliveryDate);

        // Normalize enum values (frontend sends human-readable strings)
        if (type) {
            updateData.type = (type === 'Final Production' ? 'FinalProduction' : 'PreProductionSample') as any;
        }
        if (status) {
            updateData.status = status.replace(/[\s/]/g, '') as any;
        }

        // Remove undefined keys to avoid overwriting with null
        Object.keys(updateData).forEach(k => updateData[k] === undefined && delete updateData[k]);

        // Update order in database
        const order = await prisma.order.update({
            where: { id: resolvedParams.id },
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
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
            where: { id: resolvedParams.id },
        });

        return NextResponse.json({ message: 'Order deleted successfully' });

    } catch (error) {
        console.error('Delete order error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
