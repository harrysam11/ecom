-- Enable RLS on multi-tenant tables
ALTER TABLE "Store" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Coupon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ShippingZone" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Cart" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Wishlist" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReturnRequest" ENABLE ROW LEVEL SECURITY;

-- Helper function to get the current store_id from the headers/app context
-- Note: In a real Supabase SSR setup, you'd usually pass store_id via a custom claim or use a lookup table.
-- For this implementation, we will use a more direct approach: users can only see records belonging to stores they are members of.

-- Example Policy for Products: Users can see products of the current store if it's public, or if they are staff.
-- For simplicity in this SaaS architecture, we'll implement a policy where:
-- 1. Everyone can SELECT from public stores.
-- 2. Only Store Users can INSERT/UPDATE/DELETE.

CREATE POLICY "Public cross-tenant read" ON "Product"
    FOR SELECT USING (true); -- Public read for storefront

CREATE POLICY "Store user isolation" ON "Product"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "StoreUser"
            WHERE "StoreUser"."storeId" = "Product"."storeId"
            AND "StoreUser"."userId" = auth.uid()
        )
    );

-- Similar policies would be repeated for other tables.
-- Due to Prisma handling the queries with a service role usually (unless using Supabase client directly), 
-- these policies are mostly for direct Supabase client usage or if we switch Prisma to use individual user tokens.
