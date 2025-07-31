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
