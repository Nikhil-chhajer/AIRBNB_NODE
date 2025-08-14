package utils

import (
	env "AuthInGo/config/env"
	"fmt"
	"net/smtp"

	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateEmailVerificationToken(email string) (string, error) {
	data := jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, data)
	tokenstring, err := token.SignedString([]byte(env.GetString("JWT_EMAIL_SECRET", "TOKEN")))

	if err != nil {
		return "", err
	}

	return tokenstring, nil

}
func SendConfimationMail(verificationURl string, useremail []string) error {
	password := env.GetString("EMAIL_PASSWORD", "pass")
	from := env.GetString("EMAIL_ID", "ID")
	host := "smtp.gmail.com"
	port := "587"

	subject := "Subject: Email Confirmation\r\n"

	body := fmt.Sprintf("Please verify your email by clicking '%s'", verificationURl)
	message := []byte(subject + "\r\n" + body)
	fmt.Println(verificationURl)
	auth := smtp.PlainAuth("", from, password, host)

	err := smtp.SendMail(host+":"+port, auth, from, useremail, message)

	// handling the errors
	if err != nil {
		fmt.Println(err)
		return err
	}

	fmt.Println("Successfully sent mail to all user in toList", useremail)
	return nil
}
func VerifyEmailToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(env.GetString("JWT_EMAIL_SECRET", "secret")), nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		email := claims["email"].(string)
		return email, nil
	}

	return "", err
}
