-- +goose Up
-- +goose StatementBegin
ALTER TABLE users
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users
DROP COLUMN IF EXISTS is_Verified;

-- +goose StatementEnd
