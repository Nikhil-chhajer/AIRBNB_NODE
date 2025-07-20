package utils

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func HashedPassword(plainPassword string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(plainPassword), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("Error hashing Password")
		return "", err
	}
	return string(hashedPassword), nil

}
func CheckPasswordHash(hashedPassword string, plainPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword))

	return err == nil
}
