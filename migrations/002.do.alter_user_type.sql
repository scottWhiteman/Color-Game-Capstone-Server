CREATE TYPE access AS ENUM (
  'basic',
  'admin'
);

ALTER TABLE colorgame_users
  ADD COLUMN
    user_type access;