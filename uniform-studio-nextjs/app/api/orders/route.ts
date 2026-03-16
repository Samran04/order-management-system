// ============================================
// ORDERS API ROUTE
// ============================================
// GET /api/orders - Get all orders
// POST /api/orders - Create new order

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

// ============================================
// GET HANDLER - Fetch All Orders
// ============================================

/**
 * Get All Orders
 * 
 * Fetches all orders from the database with related data
 * Requires authentication
 * 
 * @param request - Next.js request object
 * @returns NextResponse with array of orders or error
 * 
 * Headers Required:
 * Authorization: Bearer <token>
 * 
 * Success Response (200):
 * [
 *   {
 *     id, orderNumber, type, clientName, status, ...
 *     salesPerson: { id, name, email },
 *     postDelivery: { ... }
 *   }
 * ]
 * 
 * Error Responses:
 * - 401: Unauthorized (no token or invalid token)
 * - 500: Server error
 */
export async function GET(request: NextRequest) {
    try {
        // ==========================================
        // 1. AUTHENTICATE REQUEST
        // ==========================================
        const user = authenticateRequest(request.headers.get('authorization'));

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // ==========================================
        // 2. FETCH ORDERS FROM DATABASE
        // ==========================================
        const orders = await prisma.order.findMany({
            // Include related data
            include: {
                salesPerson: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                postDelivery: true,
            },
            // Sort by most recent first
            orderBy: {
                createdAt: 'desc',
            },
        });

        // ==========================================
        // 3. TRANSFORM DATA FOR FRONTEND
        // ==========================================
        const transformedOrders = orders.map((order: any) => ({
            ...order,
            // Convert dates to ISO strings
            date: order.date.toISOString(),
            startDate: order.startDate.toISOString(),
            // Map Enums back to frontend format
            type: order.type === 'FinalProduction' ? 'Final Production' : 'Pre Production Sample',
            status: order.status.replace(/([A-Z])/g, ' $1').trim(), // e.g. "OrderReceived" -> "Order Received"
            
            // Flatten salesPerson data
            salesPerson: order.salesPerson.name,
            salesPersonId: order.salesPerson.id,
        }));

        // ==========================================
        // 4. RETURN SUCCESS RESPONSE
        // ==========================================
        return NextResponse.json(transformedOrders);

    } catch (error) {
        // ==========================================
        // ERROR HANDLING
        // ==========================================
        console.error('Get orders error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// ============================================
// POST HANDLER - Create New Order
// ============================================

/**
 * Create New Order
 * 
 * Creates a new order in the database
 * Requires authentication
 * 
 * @param request - Next.js request object
 * @returns NextResponse with created order or error
 * 
 * Headers Required:
 * Authorization: Bearer <token>
 * 
 * Request Body:
 * {
 *   orderNumber, type, date, startDate, deliveryDate,
 *   clientName, brand, productName, itemDescription,
 *   fabric, color, sleeve, fabricSupplier, accessories,
 *   patternFollowed, cmPrice, cmUnit, cmPartner,
 *   embroideryPrint, sizes, totalQuantity, images,
 *   logoImage, status, notes
 * }
 * 
 * Success Response (201):
 * {
 *   id, orderNumber, ..., salesPerson: { ... }
 * }
 * 
 * Error Responses:
 * - 400: Validation error or duplicate order number
 * - 401: Unauthorized
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
    try {
        // ==========================================
        // 1. AUTHENTICATE REQUEST
        // ==========================================
        const user = authenticateRequest(request.headers.get('authorization'));

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // ==========================================
        // 2. PARSE REQUEST BODY
        // ==========================================
        const body = await request.json();

        // Extract only valid database fields to avoid Prisma "Unknown argument" errors
        const {
            orderNumber, clientName, brand, productName, itemDescription,
            fabric, color, sleeve, fabricSupplier, accessories, patternFollowed,
            cmPrice, cmUnit, cmPartner, embroideryPrint, sizes, totalQuantity,
            images, logoImage, notes
        } = body;

        const orderData = {
            orderNumber, clientName, brand, productName, itemDescription,
            fabric, color, sleeve, fabricSupplier, accessories, patternFollowed,
            cmPrice, cmUnit, cmPartner, embroideryPrint, sizes, totalQuantity,
            images, logoImage, notes,
            
            date: new Date(body.date),
            startDate: new Date(body.startDate),
            deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : new Date(),
            salesPersonId: user.userId, // Set from authenticated user
            // Map spaces out of enums for Prisma Client
            type: (body.type === 'Final Production' ? 'FinalProduction' : 'PreProductionSample') as any,
            status: (body.status ? body.status.replace(/[\s/]/g, '') : 'OrderReceived') as any,
        } as any;

        // ==========================================
        // 3. CHECK FOR DUPLICATE ORDER NUMBER
        // ==========================================
        const existing = await prisma.order.findUnique({
            where: { orderNumber: orderData.orderNumber },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Order number already exists' },
                { status: 400 }
            );
        }

        // ==========================================
        // 4. CREATE ORDER IN DATABASE
        // ==========================================
        const order = await prisma.order.create({
            data: orderData,
            include: {
                salesPerson: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        // ==========================================
        // 5. TRANSFORM DATA FOR FRONTEND
        // ==========================================
        const transformedOrder = {
            ...order,
            date: order.date.toISOString(),
            startDate: order.startDate.toISOString(),
            // Map Enums back to frontend format
            type: order.type === 'FinalProduction' ? 'Final Production' : 'Pre Production Sample',
            status: order.status.replace(/([A-Z])/g, ' $1').trim(), // e.g. "OrderReceived" -> "Order Received"
            
            salesPerson: order.salesPerson.name,
            salesPersonId: order.salesPerson.id,
        };

        // ==========================================
        // 6. RETURN SUCCESS RESPONSE
        // ==========================================
        return NextResponse.json(transformedOrder, { status: 201 });

    } catch (error) {
        // ==========================================
        // ERROR HANDLING
        // ==========================================
        console.error('Create order error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
