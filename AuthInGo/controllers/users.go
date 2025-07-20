package controllers

import (
	"AuthInGo/services"
	"net/http"
)

type UserController struct {
	UserService services.UserService
}

func NewUserController(_userService services.UserService) *UserController {
	return &UserController{
		UserService: _userService,
	}
}
func (uc *UserController) GetUserById(w http.ResponseWriter, r *http.Request) {
	uc.UserService.GetUserById()
	w.Write([]byte("user registered"))

}
func (uc *UserController) Login(w http.ResponseWriter, r *http.Request) {
	uc.UserService.LoginUser()
	w.Write([]byte("user registered"))

}
