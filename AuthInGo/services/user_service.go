package services

import (
	db "AuthInGo/DB/repositories"
	env "AuthInGo/config/env"
	"AuthInGo/utils"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

type UserService interface {
	GetUserById() error
	CreateUser() error
	LoginUser() (string, error)
}
type UserServiceImpl struct {
	userRepository db.UserRepository
}

func NewUserService(_userRepo db.UserRepository) UserService {
	return &UserServiceImpl{
		userRepository: _userRepo,
	}
}
func (u *UserServiceImpl) CreateUser() error {
	password := "123456789"
	email := "king@admin.com"
	username := "admin"
	hashedPassword, err := utils.HashedPassword(password)

	if err != nil {
		fmt.Println("Not able to hash the password")
		return err
	}

	u.userRepository.Create(username, email, hashedPassword)
	return nil

}
func (u *UserServiceImpl) LoginUser() (string, error) {

	user, err := u.userRepository.LoginUser("king@admin.com")
	if err != nil {
		fmt.Println("No user Found", err)
		return "", err
	}
	isPasswordValid := utils.CheckPasswordHash("", user.Password)
	if !isPasswordValid {
		fmt.Println("Password is worng")
		return "", nil
	}
	payload := jwt.MapClaims{
		"email": user.Email,
		"id":    user.Id,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, payload)
	tokenString, err := token.SignedString([]byte(env.GetString("JWT_SECRET", "TOKEN")))
	if err != nil {
		fmt.Println("Not able to generate the token", err)
		return "", err
	}
	fmt.Println(tokenString)
	return tokenString, nil

}
func (u *UserServiceImpl) GetUserById() error {

	u.userRepository.GetUserById()
	return nil

}
