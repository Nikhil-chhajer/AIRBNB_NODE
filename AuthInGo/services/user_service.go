package services

import (
	env "AuthInGo/config/env"
	repositories "AuthInGo/db/repositories"
	"AuthInGo/dto"
	"AuthInGo/models"
	"AuthInGo/utils"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

type UserService interface {
	GetUserById(id string) (*models.User, error)
	CreateUser(payload *dto.SignUpUserRequestDTO) (*models.User, error)
	LoginUser(payload *dto.LoginUserRequestDTO) (string, error)
	SetupMFA(userId string) (*dto.SetupMFAResponseDTO, error)
	EnableMFA(userID string, code string) error
}
type UserServiceImpl struct {
	userRepository repositories.UserRepository
}

func NewUserService(_userRepo repositories.UserRepository) UserService {
	return &UserServiceImpl{
		userRepository: _userRepo,
	}
}
func (u *UserServiceImpl) CreateUser(payload *dto.SignUpUserRequestDTO) (*models.User, error) {

	hashedPassword, err := utils.HashedPassword(payload.Password)

	if err != nil {
		fmt.Println("Not able to hash the password")
		return nil, err
	}

	user, err := u.userRepository.Create(payload.Username, payload.Email, hashedPassword)
	if err != nil {
		fmt.Println("User Not created")
		return nil, nil
	}
	return user, nil

}
func (u *UserServiceImpl) LoginUser(payload *dto.LoginUserRequestDTO) (string, error) {

	user, err := u.userRepository.LoginUser(payload.Email)
	if err != nil {
		fmt.Println("No user Found", err)
		return "", err
	}
	isPasswordValid := utils.CheckPasswordHash(user.Password, payload.Password)

	if !isPasswordValid {
		fmt.Println("Password is wrong")
		return "", fmt.Errorf("invalid credentials")
	}
	jwtpayload := jwt.MapClaims{
		"email": user.Email,
		"id":    user.Id,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwtpayload)
	tokenString, err := token.SignedString([]byte(env.GetString("JWT_SECRET", "TOKEN")))
	if err != nil {
		fmt.Println("Not able to generate the token", err)
		return "", err
	}
	// fmt.Println(tokenString)
	return tokenString, nil

}
func (u *UserServiceImpl) GetUserById(id string) (*models.User, error) {
	fmt.Println("Fetching user in UserService")
	user, err := u.userRepository.GetUserById(id)
	if err != nil {
		fmt.Println("Error fetching user:", err)
		return nil, err
	}
	return user, nil
}
func (u *UserServiceImpl) SetupMFA(userId string) (*dto.SetupMFAResponseDTO, error) {
	user, err := u.userRepository.GetUserById(userId)
	if err != nil {
		fmt.Println("No User available", err)
		return nil, fmt.Errorf("user not found")
	}
	if user.MFAEnabled {
		return nil, fmt.Errorf("MFA already enabled hai")
	}
	secreturl, secretcode, err := utils.GenerateMFASecret(user.Email)
	if err != nil {
		fmt.Println("Not able to setupMFA", err)
		return nil, fmt.Errorf("failed to generate TOTP secret: %w", err)
	}
	if err := u.userRepository.SaveMFASecret(user.Id, secretcode); err != nil {
		return nil, fmt.Errorf("failed to save MFA secret: %w", err)
	}
	base64QR, err := utils.GenerateQRCodeBase64(secreturl)
	if err != nil {
		return nil, fmt.Errorf("failed to generate QR code: %w", err)
	}

	return &dto.SetupMFAResponseDTO{
		QRCodeBase64: base64QR,
	}, nil

}
func (u *UserServiceImpl) EnableMFA(userID string, code string) error {
	user, err := u.userRepository.GetUserById(userID)
	if err != nil || user == nil {
		return fmt.Errorf("user not found")
	}

	if user.MFAEnabled {
		return fmt.Errorf("MFA already enabled")
	}

	secret, err := u.userRepository.GetMFASecret(user.Id)
	if err != nil || secret == "" {
		return fmt.Errorf("MFA secret not found")
	}

	if !utils.VerifyMFACode(secret, code) {
		return fmt.Errorf("invalid OTP code")
	}

	if err := u.userRepository.EnableMFA(user.Id); err != nil {
		return fmt.Errorf("failed to enable MFA: %w", err)
	}

	return nil
}

// func (u *UserServiceImpl) VerifyMFACode(email string, code string) bool {
// 	user, err := u.userRepository.GetByEmail(email)
// 	if err != nil {
// 		fmt.Println("No User available", err)
// 		return false
// 	}

// 	return utils.VerifyMFACode(user.MFASecret, code)
// }
