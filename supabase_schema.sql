-- Garage Billing - PostgreSQL/Supabase schema
-- This creates the application schema. It does NOT import your existing Railway data.
-- Import/verify the old MySQL data separately before switching production traffic.

CREATE TABLE IF NOT EXISTS customers (
    customer_id BIGSERIAL PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT,
    address TEXT
);

CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT,
    vehicle_number TEXT,
    vehicle_type TEXT,
    fuel_type TEXT,
    brand TEXT,
    model TEXT,
    manufacture_year INTEGER
);

CREATE TABLE IF NOT EXISTS services (
    service_id BIGSERIAL PRIMARY KEY,
    service_name TEXT NOT NULL,
    description TEXT,
    labour_charge NUMERIC(12,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS inventory (
    part_id BIGSERIAL PRIMARY KEY,
    part_name TEXT NOT NULL,
    category TEXT,
    stock_quantity NUMERIC(12,2) DEFAULT 0,
    unit_price NUMERIC(12,2) DEFAULT 0,
    mrp NUMERIC(12,2) DEFAULT 0,
    selling_price NUMERIC(12,2) DEFAULT 0,
    supplier TEXT,
    date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_cards (
    job_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT,
    vehicle_id BIGINT,
    service_date DATE,
    odometer_reading NUMERIC(12,2),
    status TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS job_services (
    job_service_id BIGSERIAL PRIMARY KEY,
    job_id BIGINT,
    service_id BIGINT,
    service_name TEXT,
    quantity NUMERIC(12,2) DEFAULT 1,
    labour_charge NUMERIC(12,2) DEFAULT 0,
    total_amount NUMERIC(12,2) DEFAULT 0,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS job_parts (
    job_part_id BIGSERIAL PRIMARY KEY,
    job_id BIGINT,
    part_id BIGINT,
    part_name TEXT,
    quantity NUMERIC(12,2) DEFAULT 1,
    unit_price NUMERIC(12,2) DEFAULT 0,
    total_amount NUMERIC(12,2) DEFAULT 0,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS invoices (
    invoice_id BIGSERIAL PRIMARY KEY,
    job_id BIGINT,
    invoice_number TEXT,
    invoice_date TIMESTAMPTZ,
    subtotal NUMERIC(12,2) DEFAULT 0,
    tax NUMERIC(12,2) DEFAULT 0,
    total_amount NUMERIC(12,2) DEFAULT 0,
    paid_amount NUMERIC(12,2) DEFAULT 0,
    balance_amount NUMERIC(12,2) DEFAULT 0,
    status TEXT
);

CREATE INDEX IF NOT EXISTS idx_vehicles_customer_id ON vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_job_cards_customer_id ON job_cards(customer_id);
CREATE INDEX IF NOT EXISTS idx_job_cards_vehicle_id ON job_cards(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_job_services_job_id ON job_services(job_id);
CREATE INDEX IF NOT EXISTS idx_job_parts_job_id ON job_parts(job_id);
CREATE INDEX IF NOT EXISTS idx_invoices_job_id ON invoices(job_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_date ON invoices(invoice_date);
