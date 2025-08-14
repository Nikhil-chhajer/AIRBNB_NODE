package controllers

import (
	"AuthInGo/dto"
	"AuthInGo/services"
	"AuthInGo/utils"
	"encoding/json"
	"fmt"
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
	fmt.Println("Fetching user by ID in UserController")
	// extract userid from url parameters
	userId := r.URL.Query().Get("id")
	if userId == "" {
		userId = r.Context().Value("userID").(string) // Fallback to context if not in URL
	}

	fmt.Println("User ID from context or query:", userId)

	if userId == "" {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "User ID is required", fmt.Errorf("missing user ID"))
		return
	}
	user, err := uc.UserService.GetUserById(userId)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch user", err)
		return
	}
	if user == nil {
		utils.WriteJsonErrorResponse(w, http.StatusNotFound, "User not found", fmt.Errorf("user with ID  not found", userId))
		return
	}
	utils.WriteJsonSuccessResponse(w, http.StatusOK, "User fetched successfully", user)
	fmt.Println("User fetched successfully:", user)
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
func (uc *UserController) SetupMFA(w http.ResponseWriter, r *http.Request) {
	userId := r.Context().Value("userID").(string)

	if userId == "" {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "User ID is required", fmt.Errorf("missing user ID"))
		return
	}

	response, err := uc.UserService.SetupMFA(userId)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to setup MFA", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "Success", response)
}

func (uc *UserController) EnableMFA(w http.ResponseWriter, r *http.Request) {
	userId := r.Context().Value("userID").(string)

	if userId == "" {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "User ID is required", fmt.Errorf("missing user ID"))
		return
	}
	var req dto.EnableMFARequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	if req.Code == "" {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "MFA code is required", fmt.Errorf("missing MFA code"))
		return
	}

	err := uc.UserService.EnableMFA(userId, req.Code)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusUnauthorized, "Failed to enable MFA", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "MFA enabled successfully", nil)
}
func (uc *UserController) VerifyEmail(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("token")
	if token == "" {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Token is required", fmt.Errorf("missing token"))
		return
	}

	err := uc.UserService.VerifyEmail(token)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to verify email", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "Email verified successfully", nil)
}
