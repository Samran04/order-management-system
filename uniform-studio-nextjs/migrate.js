const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

async function migrateData() {
    console.log('Starting data migration from Local to Supabase...');
    
    // Initialize both clients
    const local = new PrismaClient({
        datasources: { db: { url: process.env.LOCAL_DATABASE_URL } }
    });
    
    // We use the direct URL for bulk inserts to avoid pooler limitations
    const remote = new PrismaClient({
        datasources: { db: { url: process.env.DIRECT_URL } }
    });

    try {
        // --- 1. Migrate Users ---
        console.log('Fetching local users...');
        const users = await local.user.findMany();
        console.log(`Found ${users.length} users locally.`);
        
        if (users.length > 0) {
            console.log('Pushing users to Supabase...');
            await remote.user.createMany({
                data: users,
                skipDuplicates: true
            });
            console.log('Users migrated successfully.');
        }

        // --- 2. Migrate Orders ---
        console.log('Fetching local orders...');
        const orders = await local.order.findMany();
        console.log(`Found ${orders.length} orders locally.`);
        
        if (orders.length > 0) {
            console.log('Pushing orders to Supabase...');
            await remote.order.createMany({
                data: orders,
                skipDuplicates: true
            });
            console.log('Orders migrated successfully.');
        }

        // --- 3. Migrate PostDelivery ---
        console.log('Fetching local post-delivery records...');
        const postDeliveries = await local.postDelivery.findMany();
        console.log(`Found ${postDeliveries.length} post-delivery records locally.`);
        
        if (postDeliveries.length > 0) {
            console.log('Pushing post-delivery records to Supabase...');
            await remote.postDelivery.createMany({
                data: postDeliveries,
                skipDuplicates: true
            });
            console.log('Post-delivery records migrated successfully.');
        }

        // --- 4. Migrate Notifications ---
        console.log('Fetching local notifications...');
        const notifications = await local.notification.findMany();
        console.log(`Found ${notifications.length} notifications locally.`);
        
        if (notifications.length > 0) {
            console.log('Pushing notifications to Supabase...');
            await remote.notification.createMany({
                data: notifications,
                skipDuplicates: true
            });
            console.log('Notifications migrated successfully.');
        }

        console.log('✅ ALL DATA MIGRATED SUCCESSFULLY!');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await local.$disconnect();
        await remote.$disconnect();
    }
}

migrateData();
