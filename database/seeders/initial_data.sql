-- Insert Super Admin
INSERT INTO "Users" (id, email, password, role, "firstName", "lastName", "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'superadmin@system.com',
  '$2a$10$YourHashedPasswordHere', -- Change this
  'super_admin',
  'Super',
  'Admin',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert default company for testing
INSERT INTO "Companies" (id, name, "businessType", "isTrial", "trialStart", "trialEnd", "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Demo Company',
  'Retail',
  true,
  NOW(),
  NOW() + INTERVAL '30 days',
  true,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Insert default items
INSERT INTO "Items" (id, "companyId", name, sku, category, unit, "purchasePrice", "sellingPrice", mrp, "isActive", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  (SELECT id FROM "Companies" WHERE name = 'Demo Company' LIMIT 1),
  'Sample Product',
  'SKU001',
  'General',
  'Pcs',
  100.00,
  150.00,
  200.00,
  true,
  NOW(),
  NOW()
WHERE EXISTS (SELECT 1 FROM "Companies" WHERE name = 'Demo Company');

-- Insert default party
INSERT INTO "Parties" (id, "companyId", type, name, phone, "currentBalance", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  (SELECT id FROM "Companies" WHERE name = 'Demo Company' LIMIT 1),
  'customer',
  'Demo Customer',
  '01700000000',
  0,
  NOW(),
  NOW()
WHERE EXISTS (SELECT 1 FROM "Companies" WHERE name = 'Demo Company');
