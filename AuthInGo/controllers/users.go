package controllers

import (
	"AuthInGo/dto"
	"AuthInGo/services"
	"AuthInGo/utils"
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
	payload := r.Context().Value("payload").(dto.LoginUserRequestDTO)

	jwtToken, err := uc.UserService.LoginUser(&payload)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Invalid JWT token", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "user Logged in", jwtToken)

}
func (uc *UserController) Signup(w http.ResponseWriter, r *http.Request) {

	payload := r.Context().Value("payload").(dto.SignUpUserRequestDTO)
	user, err := uc.UserService.CreateUser(&payload)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to create user", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "User registered successfully", user)

}
