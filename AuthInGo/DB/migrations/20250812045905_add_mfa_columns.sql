-- +goose Up
-- +goose StatementBegin
ALTER TABLE users
ADD COLUMN mfa_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN mfa_secret TEXT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users
DROP COLUMN IF EXISTS mfa_secret,
DROP COLUMN IF EXISTS mfa_enabled;
-- +goose StatementEnd
