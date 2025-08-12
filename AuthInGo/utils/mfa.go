package utils

import (
	"encoding/base64"

	"github.com/pquerna/otp/totp"
	"github.com/skip2/go-qrcode"
)

func GenerateMFASecret(email string) (string, string, error) {

	secret, err := totp.Generate(totp.GenerateOpts{
		Issuer:      "AuthInGo",
		AccountName: email,
	})
	if err != nil {

		return "", "", err
	}
	return secret.URL(), secret.Secret(), nil

}
func VerifyMFACode(secret string, code string) bool {
	return totp.Validate(code, secret)
}
func GenerateQRCodeImage(url string, filePath string) error {
	return qrcode.WriteFile(url, qrcode.Medium, 256, filePath)
}

func GenerateQRCodeBase64(otpURL string) (string, error) {
	png, err := qrcode.Encode(otpURL, qrcode.Medium, 256)
	if err != nil {
		return "", err
	}

	base64QR := base64.StdEncoding.EncodeToString(png)
	return base64QR, nil
}
