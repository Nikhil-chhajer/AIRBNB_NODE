package router

import (
	"AuthInGo/controllers"
	"fmt"

	"github.com/go-chi/chi/v5"
)

type UserRouter struct {
	userController *controllers.UserController
}

func NewUserRouter(_userController *controllers.UserController) Router {
	return &UserRouter{
		userController: _userController,
	}
}
func (ur *UserRouter) Register(r chi.Router) {
	fmt.Println("hiii")
	r.Get("/profile", ur.userController.GetUserById)
	r.Get("/login", ur.userController.Login)
}
