-- Add new event types to the enum
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'NBA';
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'MLS';
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'NWSL';
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'Olympics';
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'World Cup';