-- Fix RLS security issues by enabling RLS on tables that have policies but no RLS enabled
-- These tables likely exist and have policies but RLS is disabled

-- Enable RLS on any tables that might be missing it
DO $$
DECLARE
    table_record RECORD;
BEGIN
    -- Get all tables in public schema that have policies but might not have RLS enabled
    FOR table_record IN 
        SELECT DISTINCT schemaname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        -- Enable RLS on each table that has policies
        EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY;', 
                      table_record.schemaname, table_record.tablename);
    END LOOP;
END $$;