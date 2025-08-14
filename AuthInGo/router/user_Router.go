package router

import (
	"AuthInGo/controllers"
	"AuthInGo/middlewares"

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
	r.With(middlewares.JWTAuthMiddleware).Get("/profile", ur.userController.GetUserById)
	r.With(middlewares.UserloginRequestValidator).Post("/login", ur.userController.Login)
	r.With(middlewares.UserCreateRequestValidator).Post("/signup", ur.userController.Signup)
	r.Get("/auth/email/verify", ur.userController.VerifyEmail)
	r.With(middlewares.JWTAuthMiddleware).Post("/auth/mfa/setup", ur.userController.SetupMFA)
	r.With(middlewares.JWTAuthMiddleware).Post("/auth/mfa/enable", ur.userController.EnableMFA)
}
