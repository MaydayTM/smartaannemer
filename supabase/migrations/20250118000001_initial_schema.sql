-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Credit sessions table
CREATE TABLE credit_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token TEXT UNIQUE NOT NULL,
  credits_total INTEGER DEFAULT 1,
  credits_used INTEGER DEFAULT 0,
  first_used_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credit_sessions_token ON credit_sessions(session_token);

-- Contractors table
CREATE TABLE contractors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  website TEXT,
  email TEXT,
  phone TEXT,
  region TEXT,
  city TEXT,
  country TEXT DEFAULT 'BE',

  -- Capabilities
  offers_roof BOOLEAN DEFAULT FALSE,
  offers_facade BOOLEAN DEFAULT FALSE,
  offers_insulation BOOLEAN DEFAULT FALSE,
  offers_solar BOOLEAN DEFAULT FALSE,

  -- Quality flags
  verified BOOLEAN DEFAULT FALSE,
  financially_healthy BOOLEAN DEFAULT FALSE,
  full_guidance_premiums BOOLEAN DEFAULT FALSE,

  -- Metadata
  avg_project_value_min INTEGER,
  avg_project_value_max INTEGER,
  avg_projects_per_year INTEGER,
  rating DECIMAL(2,1),
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contractors_region ON contractors(region);
CREATE INDEX idx_contractors_verified ON contractors(verified);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT,

  -- Contact info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Project info
  address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  project_type TEXT NOT NULL,
  building_type TEXT NOT NULL,
  year_built INTEGER,
  urgency TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  priority TEXT,
  extra_info TEXT,

  -- Estimate snapshot
  estimate_min INTEGER,
  estimate_max INTEGER,
  estimate_currency TEXT DEFAULT 'EUR',

  -- Matching info
  matched_contractor_ids UUID[],
  chosen_contractor_id UUID REFERENCES contractors(id),

  -- Status
  status TEXT DEFAULT 'new',
  notes TEXT
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_postal_code ON leads(postal_code);

-- Row Level Security (RLS)
ALTER TABLE credit_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow anonymous read on contractors" ON contractors
  FOR SELECT USING (verified = TRUE);

CREATE POLICY "Allow anonymous insert on leads" ON leads
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Allow anonymous insert on credit_sessions" ON credit_sessions
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Allow anonymous read own credit_session" ON credit_sessions
  FOR SELECT USING (TRUE);

CREATE POLICY "Allow anonymous update own credit_session" ON credit_sessions
  FOR UPDATE USING (TRUE);
