-- Update Portland Timbers event times to official PT times (stored as UTC) and correct home/away labels

-- Aug 23, 2025 — @ San Diego FC — 7:30 PM PT => 2025-08-24 02:30:00+00
UPDATE public.events
SET event_date = TIMESTAMPTZ '2025-08-24 02:30:00+00',
    event_title = 'Portland Timbers @ San Diego FC'
WHERE id = '4b29dc7c-479a-4722-a93a-708f9475b5a3';

-- Aug 30, 2025 — @ Minnesota United FC — 5:30 PM PT => 2025-08-31 00:30:00+00
UPDATE public.events
SET event_date = TIMESTAMPTZ '2025-08-31 00:30:00+00',
    event_title = 'Portland Timbers @ Minnesota United FC'
WHERE id = 'c8f2f9f0-7f9d-44ed-b4ce-cd39f2781d02';

-- Sep 20, 2025 — @ Houston Dynamo FC — 5:30 PM PT => 2025-09-21 00:30:00+00
UPDATE public.events
SET event_date = TIMESTAMPTZ '2025-09-21 00:30:00+00',
    event_title = 'Portland Timbers @ Houston Dynamo FC'
WHERE id = 'e4bb8da9-b95a-4ad8-8fe0-fc4613356808';

-- Sep 24, 2025 — vs Vancouver Whitecaps — 7:30 PM PT => 2025-09-25 02:30:00+00
UPDATE public.events
SET event_date = TIMESTAMPTZ '2025-09-25 02:30:00+00'
WHERE id = 'f5a51b82-e9b1-4b0c-b74e-7655ee76c648';

-- Sep 27, 2025 — vs FC Dallas — 7:30 PM PT => 2025-09-28 02:30:00+00
UPDATE public.events
SET event_date = TIMESTAMPTZ '2025-09-28 02:30:00+00'
WHERE id = 'd327f665-96b0-4540-bdd9-1a2e939299d7';

-- Oct 4, 2025 — @ Seattle Sounders FC — 7:30 PM PT => 2025-10-05 02:30:00+00
UPDATE public.events
SET event_date = TIMESTAMPTZ '2025-10-05 02:30:00+00',
    event_title = 'Portland Timbers @ Seattle Sounders FC'
WHERE id = 'a4272865-6c91-4c47-aad9-533a6c47ce65';

-- Oct 18, 2025 — vs San Diego FC — 6:00 PM PT => 2025-10-19 01:00:00+00
UPDATE public.events
SET event_date = TIMESTAMPTZ '2025-10-19 01:00:00+00'
WHERE id = 'e546f02c-f4a1-43b4-bcac-6c232e1851c3';