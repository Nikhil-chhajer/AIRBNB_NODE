package models

import "time"

type User struct {
	Id        int64
	Username  string
	Email     string
	Password  string
	CreatedAt time.Time
	UpdatedAt time.Time
}
