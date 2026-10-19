DO $$
DECLARE
  suffix TEXT := to_char(clock_timestamp(), 'YYYYMMDDHH24MISS');
  tbl TEXT;
  legacy_tbl TEXT;
  idx RECORD;
  seq_name TEXT;
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'id'
      AND udt_name <> 'uuid'
  ) THEN
    FOREACH tbl IN ARRAY ARRAY[
      'activities',
      'favorites',
      'pet_images',
      'pets',
      'shelters',
      'contact_submissions',
      'users',
      'cities',
      'listing_types',
      'pet_types'
    ] LOOP
      IF to_regclass(format('public.%I', tbl)) IS NOT NULL THEN
        seq_name := tbl || '_id_seq';
        IF to_regclass(format('public.%I', seq_name)) IS NOT NULL THEN
          EXECUTE format('ALTER SEQUENCE public.%I RENAME TO %I', seq_name, 'legacy_' || seq_name || '_' || suffix);
        END IF;

        legacy_tbl := 'legacy_' || tbl || '_' || suffix;
        EXECUTE format('ALTER TABLE public.%I RENAME TO %I', tbl, legacy_tbl);

        FOR idx IN
          SELECT indexname
          FROM pg_indexes
          WHERE schemaname = 'public'
            AND tablename = legacy_tbl
        LOOP
          EXECUTE format(
            'ALTER INDEX public.%I RENAME TO %I',
            idx.indexname,
            left('legacy_' || idx.indexname || '_' || suffix, 63)
          );
        END LOOP;
      END IF;
    END LOOP;
  END IF;
END $$;
