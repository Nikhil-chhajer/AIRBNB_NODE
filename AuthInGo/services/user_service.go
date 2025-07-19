package services

import (
	db "AuthInGo/DB/repositories"
	"fmt"
)

type UserService interface {
	GetUserById() error
}
type UserServiceImpl struct {
	userRepository db.UserRepository
}

func NewUserService(_userRepo db.UserRepository) UserService {
	return &UserServiceImpl{
		userRepository: _userRepo,
	}
}
func (u *UserServiceImpl) GetUserById() error {
	fmt.Println("hello i am  service")
	u.userRepository.Create()
	return nil

}
