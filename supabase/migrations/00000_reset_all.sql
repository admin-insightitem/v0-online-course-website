-- =============================================
-- RichClass DB 전체 초기화 (Reset)
-- public 스키마의 모든 객체를 동적으로 삭제합니다.
-- 주의: 모든 데이터가 삭제됩니다!
-- =============================================

-- 1. auth.users 테이블의 트리거 삭제
DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN (
    SELECT tgname FROM pg_trigger
    WHERE tgrelid = 'auth.users'::regclass AND NOT tgisinternal
  ) LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON auth.users', r.tgname);
  END LOOP;
END $$;

-- 2. public 스키마의 모든 함수 삭제
DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN (
    SELECT ns.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace ns ON p.pronamespace = ns.oid
    WHERE ns.nspname = 'public'
  ) LOOP
    EXECUTE format('DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE', r.nspname, r.proname, r.args);
  END LOOP;
END $$;

-- 3. public 스키마의 모든 테이블 삭제
DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN (
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', r.tablename);
  END LOOP;
END $$;

-- 4. public 스키마의 모든 커스텀 타입(ENUM) 삭제
DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN (
    SELECT t.typname FROM pg_type t
    JOIN pg_namespace ns ON t.typnamespace = ns.oid
    WHERE ns.nspname = 'public' AND t.typtype = 'e'
  ) LOOP
    EXECUTE format('DROP TYPE IF EXISTS public.%I CASCADE', r.typname);
  END LOOP;
END $$;

-- 5. auth.users 테이블의 모든 사용자 삭제
-- 기존 auth 유저가 남아있으면 handle_new_user 트리거가 재발동하지 않아
-- profiles 테이블에 데이터가 생성되지 않는 문제가 발생합니다.
DELETE FROM auth.users;
