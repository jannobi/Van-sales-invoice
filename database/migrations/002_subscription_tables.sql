-- Create Subscriptions table
CREATE TABLE IF NOT EXISTS "Subscriptions" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "companyId" UUID NOT NULL UNIQUE,
  tier VARCHAR(50) NOT NULL CHECK (tier IN ('basic', 'premium', 'enterprise')),
  price DECIMAL(15,2) NOT NULL,
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP NOT NULL,
  "isActive" BOOLEAN DEFAULT TRUE,
  "autoRenew" BOOLEAN DEFAULT FALSE,
  "paymentMethod" VARCHAR(50),
  "paymentToken" VARCHAR(255),
  "lastPaymentDate" TIMESTAMP,
  "nextPaymentDate" TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("companyId") REFERENCES "Companies"(id) ON DELETE CASCADE
);

-- Create Sessions table
CREATE TABLE IF NOT EXISTS "Sessions" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  "deviceInfo" JSONB NOT NULL,
  "ipAddress" VARCHAR(45),
  "isActive" BOOLEAN DEFAULT TRUE,
  "isBlocked" BOOLEAN DEFAULT FALSE,
  "lastActivity" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE CASCADE
);

-- Create Invoices table
CREATE TABLE IF NOT EXISTS "Invoices" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "companyId" UUID NOT NULL,
  "invoiceNumber" VARCHAR(50) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('sale', 'purchase')),
  "partyId" UUID NOT NULL,
  "salesmanId" UUID,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dueDate" TIMESTAMP,
  subtotal DECIMAL(15,2) NOT NULL,
  "gstAmount" DECIMAL(15,2) DEFAULT 0,
  discount DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) NOT NULL,
  "paidAmount" DECIMAL(15,2) DEFAULT 0,
  "balanceDue" DECIMAL(15,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft',
  "paymentMethod" VARCHAR(50),
  notes TEXT,
  items JSONB NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("companyId") REFERENCES "Companies"(id) ON DELETE CASCADE,
  FOREIGN KEY ("partyId") REFERENCES "Parties"(id) ON DELETE CASCADE,
  FOREIGN KEY ("salesmanId") REFERENCES "Salesmen"(id) ON DELETE SET NULL
);

-- Create Transactions table
CREATE TABLE IF NOT EXISTS "Transactions" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "companyId" UUID NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  "paymentMethod" VARCHAR(50),
  reference VARCHAR(100),
  "invoiceId" UUID,
  description TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'completed',
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("companyId") REFERENCES "Companies"(id) ON DELETE CASCADE,
  FOREIGN KEY ("invoiceId") REFERENCES "Invoices"(id) ON DELETE SET NULL
);

-- Create Expenses table
CREATE TABLE IF NOT EXISTS "Expenses" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "companyId" UUID NOT NULL,
  "salesmanId" UUID,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  "paymentMethod" VARCHAR(50),
  receipt VARCHAR(255),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("companyId") REFERENCES "Companies"(id) ON DELETE CASCADE,
  FOREIGN KEY ("salesmanId") REFERENCES "Salesmen"(id) ON DELETE SET NULL
);

-- Create Routes table
CREATE TABLE IF NOT EXISTS "Routes" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "companyId" UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  "salesmanId" UUID,
  waypoints JSONB NOT NULL,
  schedule JSONB,
  "isActive" BOOLEAN DEFAULT TRUE,
  day VARCHAR(20),
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("companyId") REFERENCES "Companies"(id) ON DELETE CASCADE,
  FOREIGN KEY ("salesmanId") REFERENCES "Salesmen"(id) ON DELETE SET NULL
);
