-- Create Users table
CREATE TABLE IF NOT EXISTS "Users" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'company_admin', 'salesman')),
  "firstName" VARCHAR(100) NOT NULL,
  "lastName" VARCHAR(100) NOT NULL,
  "companyId" UUID,
  "isActive" BOOLEAN DEFAULT TRUE,
  "lastLogin" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Create Companies table
CREATE TABLE IF NOT EXISTS "Companies" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  "businessType" VARCHAR(100) NOT NULL,
  "gstNumber" VARCHAR(50),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  "subscriptionTier" VARCHAR(50) DEFAULT 'basic',
  "subscriptionStart" TIMESTAMP,
  "subscriptionEnd" TIMESTAMP,
  "isTrial" BOOLEAN DEFAULT TRUE,
  "trialStart" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "trialEnd" TIMESTAMP,
  "isActive" BOOLEAN DEFAULT TRUE,
  "cashInHand" DECIMAL(15,2) DEFAULT 0,
  "bankBalance" DECIMAL(15,2) DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Create Salesmen table
CREATE TABLE IF NOT EXISTS "Salesmen" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "companyId" UUID NOT NULL,
  "employeeId" VARCHAR(50) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  address TEXT,
  "assignedRoute" VARCHAR(100),
  "vanNumber" VARCHAR(50),
  "dailyTarget" DECIMAL(15,2) DEFAULT 0,
  "monthlySales" DECIMAL(15,2) DEFAULT 0,
  "monthlyCollections" DECIMAL(15,2) DEFAULT 0,
  "currentMonth" VARCHAR(7),
  "lastActive" TIMESTAMP,
  "isActive" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE CASCADE,
  FOREIGN KEY ("companyId") REFERENCES "Companies"(id) ON DELETE CASCADE
);

-- Create Parties table
CREATE TABLE IF NOT EXISTS "Parties" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "companyId" UUID NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('customer', 'supplier')),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  "gstNumber" VARCHAR(50),
  "openingBalance" DECIMAL(15,2) DEFAULT 0,
  "currentBalance" DECIMAL(15,2) DEFAULT 0,
  "creditLimit" DECIMAL(15,2) DEFAULT 0,
  "totalPurchases" DECIMAL(15,2) DEFAULT 0,
  "totalPayments" DECIMAL(15,2) DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("companyId") REFERENCES "Companies"(id) ON DELETE CASCADE
);

-- Create Items table
CREATE TABLE IF NOT EXISTS "Items" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "companyId" UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  "purchasePrice" DECIMAL(15,2) NOT NULL,
  "sellingPrice" DECIMAL(15,2) NOT NULL,
  mrp DECIMAL(15,2),
  "gstRate" DECIMAL(5,2) DEFAULT 0,
  "hsnCode" VARCHAR(50),
  "minStock" INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("companyId") REFERENCES "Companies"(id) ON DELETE CASCADE
);
